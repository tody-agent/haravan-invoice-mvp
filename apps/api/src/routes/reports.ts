import { Hono } from 'hono';
import { authMiddleware } from '../middleware/auth';

type Bindings = { DB: D1Database };

const reports = new Hono<{ Bindings: Bindings }>();
reports.use('*', authMiddleware());

reports.get('/summary', async (c) => {
  const now = new Date();
  const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const lastMonth = now.getMonth() === 0
    ? `${now.getFullYear() - 1}-12`
    : `${now.getFullYear()}-${String(now.getMonth()).padStart(2, '0')}`;

  const [totalIssued, totalPending, totalError, thisMonthRevenue, lastMonthRevenue] = await Promise.all([
    c.env.DB.prepare("SELECT COUNT(*) as count FROM invoices WHERE status IN ('issued', 'cqt_accepted')").first(),
    c.env.DB.prepare("SELECT COUNT(*) as count FROM invoices WHERE status = 'pending'").first(),
    c.env.DB.prepare("SELECT COUNT(*) as count FROM invoices WHERE status = 'cqt_rejected'").first(),
    c.env.DB.prepare("SELECT COALESCE(SUM(total), 0) as revenue FROM invoices WHERE status IN ('issued', 'cqt_accepted') AND issue_date LIKE ? || '%'").bind(thisMonth).first(),
    c.env.DB.prepare("SELECT COALESCE(SUM(total), 0) as revenue FROM invoices WHERE status IN ('issued', 'cqt_accepted') AND issue_date LIKE ? || '%'").bind(lastMonth).first(),
  ]);

  return c.json({
    success: true,
    data: {
      totalIssued: (totalIssued as Record<string, number>)?.count || 0,
      totalPending: (totalPending as Record<string, number>)?.count || 0,
      totalError: (totalError as Record<string, number>)?.count || 0,
      revenueThisMonth: (thisMonthRevenue as Record<string, number>)?.revenue || 0,
      revenueLastMonth: (lastMonthRevenue as Record<string, number>)?.revenue || 0,
    },
  });
});

reports.get('/monthly', async (c) => {
  const month = c.req.query('month') || new Date().toISOString().slice(0, 7);

  const invoices = await c.env.DB.prepare(
    "SELECT id, haravan_id, buyer_name, total, status, issue_date, tax_amount FROM invoices WHERE issue_date LIKE ? || '%' ORDER BY issue_date DESC"
  ).bind(month).all();

  const summary = await c.env.DB.prepare(
    "SELECT COUNT(*) as count, COALESCE(SUM(total), 0) as totalAmount, COALESCE(SUM(tax_amount), 0) as taxAmount FROM invoices WHERE issue_date LIKE ? || '%' AND status IN ('issued', 'cqt_accepted')"
  ).bind(month).first();

  return c.json({
    success: true,
    data: {
      month,
      invoices: (invoices.results || []).map(row => ({
        id: row.id,
        haravanId: row.haravan_id,
        buyerName: row.buyer_name,
        total: row.total,
        status: row.status,
        issueDate: row.issue_date,
        taxAmount: row.tax_amount,
      })),
      summary: {
        count: (summary as Record<string, number>)?.count || 0,
        totalAmount: (summary as Record<string, number>)?.totalAmount || 0,
        taxAmount: (summary as Record<string, number>)?.taxAmount || 0,
      },
    },
  });
});

reports.get('/sales', async (c) => {
  const dateFrom = c.req.query('dateFrom') || new Date().toISOString().slice(0, 8) + '01';
  const dateTo = c.req.query('dateTo') || new Date().toISOString().slice(0, 10);

  const rows = await c.env.DB.prepare(
    `SELECT issue_date as date, COUNT(*) as count, COALESCE(SUM(subtotal), 0) as subtotal,
     COALESCE(SUM(tax_amount), 0) as tax, COALESCE(SUM(total), 0) as total
     FROM invoices WHERE issue_date >= ? AND issue_date <= ?
     AND status IN ('issued', 'cqt_accepted')
     GROUP BY issue_date ORDER BY issue_date`
  ).bind(dateFrom, dateTo).all();

  const summaryRow = await c.env.DB.prepare(
    `SELECT COUNT(*) as count, COALESCE(SUM(subtotal), 0) as subtotal,
     COALESCE(SUM(tax_amount), 0) as tax, COALESCE(SUM(total), 0) as total
     FROM invoices WHERE issue_date >= ? AND issue_date <= ?
     AND status IN ('issued', 'cqt_accepted')`
  ).bind(dateFrom, dateTo).first();

  return c.json({
    success: true,
    data: {
      days: rows.results || [],
      summary: {
        count: (summaryRow as Record<string, number>)?.count || 0,
        subtotal: (summaryRow as Record<string, number>)?.subtotal || 0,
        tax: (summaryRow as Record<string, number>)?.tax || 0,
        total: (summaryRow as Record<string, number>)?.total || 0,
      },
    },
  });
});

reports.get('/ledger', async (c) => {
  const dateFrom = c.req.query('dateFrom') || '2000-01-01';
  const dateTo = c.req.query('dateTo') || '2099-12-31';
  const status = c.req.query('status');

  let query = `SELECT id, haravan_id, issue_date, buyer_name, buyer_mst, subtotal, tax_amount, total, status
    FROM invoices WHERE issue_date >= ? AND issue_date <= ?`;
  const params: (string | number)[] = [dateFrom, dateTo];

  if (status) {
    query += ` AND status = ?`;
    params.push(status);
  }
  query += ` ORDER BY issue_date DESC`;

  const rows = await c.env.DB.prepare(query).bind(...params).all();

  let summaryQuery = `SELECT COUNT(*) as count, COALESCE(SUM(subtotal), 0) as subtotal,
    COALESCE(SUM(tax_amount), 0) as taxAmount, COALESCE(SUM(total), 0) as total
    FROM invoices WHERE issue_date >= ? AND issue_date <= ?`;
  const summaryParams: (string | number)[] = [dateFrom, dateTo];

  if (status) {
    summaryQuery += ` AND status = ?`;
    summaryParams.push(status);
  }

  const summary = await c.env.DB.prepare(summaryQuery).bind(...summaryParams).first();

  return c.json({
    success: true,
    data: {
      invoices: (rows.results || []).map((row: Record<string, unknown>) => ({
        id: row.id,
        haravanId: row.haravan_id,
        issueDate: row.issue_date,
        buyerName: row.buyer_name,
        buyerMst: row.buyer_mst,
        subtotal: row.subtotal,
        taxAmount: row.tax_amount,
        total: row.total,
        status: row.status,
      })),
      summary: {
        count: (summary as Record<string, number>)?.count || 0,
        subtotal: (summary as Record<string, number>)?.subtotal || 0,
        taxAmount: (summary as Record<string, number>)?.taxAmount || 0,
        total: (summary as Record<string, number>)?.total || 0,
      },
    },
  });
});

reports.get('/quarterly', async (c) => {
  const year = c.req.query('year') || String(new Date().getFullYear());

  const rows = await c.env.DB.prepare(
    `SELECT CASE
       WHEN CAST(strftime('%m', issue_date) AS INTEGER) BETWEEN 1 AND 3 THEN 1
       WHEN CAST(strftime('%m', issue_date) AS INTEGER) BETWEEN 4 AND 6 THEN 2
       WHEN CAST(strftime('%m', issue_date) AS INTEGER) BETWEEN 7 AND 9 THEN 3
       ELSE 4
     END as quarter,
     COUNT(*) as count, COALESCE(SUM(subtotal), 0) as subtotal,
     COALESCE(SUM(tax_amount), 0) as taxAmount, COALESCE(SUM(total), 0) as total
     FROM invoices WHERE strftime('%Y', issue_date) = ?
     AND status IN ('issued', 'cqt_accepted')
     GROUP BY quarter ORDER BY quarter`
  ).bind(year).all();

  const yearTotal = await c.env.DB.prepare(
    `SELECT COUNT(*) as count, COALESCE(SUM(subtotal), 0) as subtotal,
     COALESCE(SUM(tax_amount), 0) as taxAmount, COALESCE(SUM(total), 0) as total
     FROM invoices WHERE strftime('%Y', issue_date) = ?
     AND status IN ('issued', 'cqt_accepted')`
  ).bind(year).first();

  return c.json({
    success: true,
    data: {
      quarters: rows.results || [],
      yearTotal: {
        count: (yearTotal as Record<string, number>)?.count || 0,
        subtotal: (yearTotal as Record<string, number>)?.subtotal || 0,
        taxAmount: (yearTotal as Record<string, number>)?.taxAmount || 0,
        total: (yearTotal as Record<string, number>)?.total || 0,
      },
    },
  });
});

reports.get('/replaced', async (c) => {
  const dateFrom = c.req.query('dateFrom') || '2000-01-01';
  const dateTo = c.req.query('dateTo') || '2099-12-31';

  const rows = await c.env.DB.prepare(
    `SELECT orig.id as originalId, orig.haravan_id as originalHaravanId,
     inv.id as newId, inv.haravan_id as newHaravanId,
     inv.buyer_name as buyerName, inv.total, inv.created_at as replacedAt,
     COALESCE(json_extract(inv.metadata, '$.replaceReason'), '') as reason
     FROM invoices inv
     JOIN invoices orig ON inv.replaces = orig.id
     WHERE inv.status = 'issued' AND inv.replaces IS NOT NULL
     AND inv.issue_date >= ? AND inv.issue_date <= ?
     ORDER BY inv.created_at DESC`
  ).bind(dateFrom, dateTo).all();

  return c.json({
    success: true,
    data: {
      invoices: rows.results || [],
      count: (rows.results || []).length,
    },
  });
});

reports.get('/modified', async (c) => {
  const dateFrom = c.req.query('dateFrom') || '2000-01-01';
  const dateTo = c.req.query('dateTo') || '2099-12-31';

  const rows = await c.env.DB.prepare(
    `SELECT inv.id, inv.haravan_id, inv.buyer_name as buyerName, inv.total,
     inv.created_at as adjustedAt,
     COALESCE(json_extract(inv.metadata, '$.adjustedBy'), 'system') as adjustedBy,
     COALESCE(json_extract(inv.metadata, '$.adjustReason'), '') as reason
     FROM invoices inv
     WHERE inv.adjusts IS NOT NULL
     AND inv.issue_date >= ? AND inv.issue_date <= ?
     ORDER BY inv.created_at DESC`
  ).bind(dateFrom, dateTo).all();

  return c.json({
    success: true,
    data: {
      invoices: (rows.results || []).map((row: Record<string, unknown>) => ({
        id: row.id,
        haravanId: row.haravan_id,
        buyerName: row.buyerName,
        total: row.total,
        adjustedAt: row.adjustedAt,
        adjustedBy: row.adjustedBy,
        reason: row.reason,
      })),
      count: (rows.results || []).length,
    },
  });
});

reports.get('/deleted', async (c) => {
  const dateFrom = c.req.query('dateFrom') || '2000-01-01';
  const dateTo = c.req.query('dateTo') || '2099-12-31';

  const rows = await c.env.DB.prepare(
    `SELECT orig.id as originalId, orig.haravan_id as originalHaravanId,
     inv.id as newId, inv.haravan_id as newHaravanId,
     inv.buyer_name as buyerName, inv.total, inv.created_at as replacedAt,
     COALESCE(json_extract(inv.metadata, '$.replaceReason'), '') as reason
     FROM invoices inv
     JOIN invoices orig ON inv.replaces = orig.id
     WHERE inv.replaces IS NOT NULL
     AND inv.issue_date >= ? AND inv.issue_date <= ?
     ORDER BY inv.created_at DESC`
  ).bind(dateFrom, dateTo).all();

  return c.json({
    success: true,
    data: {
      invoices: rows.results || [],
      count: (rows.results || []).length,
      note: 'Theo NĐ 70/2025, không được phép hủy hóa đơn. Dữ liệu này hiển thị các hóa đơn đã được thay thế.',
    },
  });
});

export default reports;
