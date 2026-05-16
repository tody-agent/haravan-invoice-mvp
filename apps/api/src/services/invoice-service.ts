import type { Invoice, CreateInvoiceRequest, ReplaceInvoiceRequest, AdjustInvoiceRequest, InvoiceFilter } from '@haravan/shared';
import { validateInvoice } from '@haravan/shared';
import type { TVANAdapter } from '@haravan/shared';

function generateId(): string {
  return `inv-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
}

function generateHaravanId(seq: number): string {
  return `HRV-INV-${String(seq).padStart(3, '0')}-${String(seq).padStart(3, '0')}`;
}

export class InvoiceService {
  constructor(
    private db: D1Database,
    private adapter: TVANAdapter,
  ) {}

  async create(req: CreateInvoiceRequest, merchantId: string): Promise<{ invoice: Invoice; errors: string[] }> {
    const subtotal = req.items.reduce((s, i) => s + i.unitPrice * i.quantity, 0);
    const taxAmount = req.items.reduce((s, i) => s + i.unitPrice * i.quantity * (i.taxRate || 0.1), 0);
    const total = subtotal + taxAmount;

    const errors = validateInvoice({
      buyer: req.buyer,
      seller: { name: 'Merchant', mst: merchantId },
      items: req.items,
      totals: { subtotal, taxAmount, discount: 0, total },
    });

    if (errors.length > 0) {
      return { invoice: null as unknown as Invoice, errors };
    }

    const id = generateId();
    const haravanId = generateHaravanId(Date.now() % 10000);
    const now = new Date().toISOString();

    await this.db.prepare(`
      INSERT INTO invoices (id, haravan_id, status, issue_date, buyer_name, buyer_mst, buyer_address, buyer_email,
        seller_name, seller_mst, items, subtotal, tax_amount, total, tax_rate, payment_method, channel, order_id, created_at, updated_at)
      VALUES (?, ?, 'pending', datetime('now'), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
    `).bind(
      id, haravanId,
      req.buyer.name, req.buyer.mst || '', req.buyer.address || '', req.buyer.email || '',
      'Merchant', merchantId,
      JSON.stringify(req.items), subtotal, taxAmount, total,
      req.items[0]?.taxRate || 0.1,
      req.paymentMethod || 'transfer',
      req.channel || 'admin',
      req.orderId || null
    ).run();

    const invoice: Invoice = {
      id, haravanId, status: 'pending', issueDate: now,
      buyer: req.buyer, seller: { name: 'Merchant', mst: merchantId },
      items: req.items, totals: { subtotal, taxAmount, discount: 0, total },
      paymentMethod: req.paymentMethod || 'transfer',
      channel: req.channel || 'admin',
      orderId: req.orderId, createdAt: now, updatedAt: now, version: 1,
    };

    const result = await this.adapter.issue(invoice);

    if (result.success) {
      await this.db.prepare(
        "UPDATE invoices SET status = 'issued', tvan_id = ?, updated_at = datetime('now') WHERE id = ?"
      ).bind(result.tvanId, id).run();
      invoice.status = 'issued';
      invoice.tvanId = result.tvanId;
    } else {
      await this.db.prepare(
        "UPDATE invoices SET status = 'draft', updated_at = datetime('now') WHERE id = ?"
      ).bind(id).run();
      invoice.status = 'draft';
    }

    await this.auditLog(id, result.success ? 'issued' : 'issue_failed', `user:${merchantId}`, {
      tvanId: result.tvanId,
      error: result.error,
    });

    return { invoice, errors: [] };
  }

  async list(filter: InvoiceFilter, merchantId: string): Promise<{ items: Invoice[]; total: number; page: number; pageSize: number }> {
    const page = filter.page || 1;
    const pageSize = filter.pageSize || 20;
    const offset = (page - 1) * pageSize;

    let where = '1=1';
    const params: unknown[] = [];

    if (filter.status?.length) {
      where += ` AND status IN (${filter.status.map(() => '?').join(',')})`;
      params.push(...filter.status);
    }
    if (filter.dateFrom) {
      where += ' AND issue_date >= ?';
      params.push(filter.dateFrom);
    }
    if (filter.dateTo) {
      where += ' AND issue_date <= ?';
      params.push(filter.dateTo);
    }
    if (filter.buyerMst) {
      where += ' AND buyer_mst LIKE ?';
      params.push(`%${filter.buyerMst}%`);
    }
    if (filter.buyerName) {
      where += ' AND buyer_name LIKE ?';
      params.push(`%${filter.buyerName}%`);
    }

    const countResult = await this.db.prepare(
      `SELECT COUNT(*) as total FROM invoices WHERE ${where}`
    ).bind(...params).first() as { total: number };

    const rows = await this.db.prepare(
      `SELECT * FROM invoices WHERE ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`
    ).bind(...params, pageSize, offset).all();

    const items = (rows.results || []).map((r) => this.rowToInvoice(r as Record<string, unknown>));

    return { items, total: countResult.total, page, pageSize };
  }

  async getById(id: string): Promise<Invoice | null> {
    const row = await this.db.prepare('SELECT * FROM invoices WHERE id = ?').bind(id).first();
    return row ? this.rowToInvoice(row as Record<string, unknown>) : null;
  }

  async replace(id: string, req: ReplaceInvoiceRequest, merchantId: string): Promise<{ invoice: Invoice | null; errors: string[] }> {
    const original = await this.getById(id);
    if (!original) return { invoice: null, errors: ['Hóa đơn không tồn tại'] };
    if (original.status === 'replaced') return { invoice: null, errors: ['Hóa đơn đã được thay thế'] };

    const newId = generateId();
    const haravanId = generateHaravanId(Date.now() % 10000);
    const now = new Date().toISOString();
    const subtotal = req.items.reduce((s, i) => s + i.unitPrice * i.quantity, 0);
    const taxAmount = req.items.reduce((s, i) => s + i.unitPrice * i.quantity * (i.taxRate || 0.1), 0);
    const total = subtotal + taxAmount;

    await this.db.prepare(`
      INSERT INTO invoices (id, haravan_id, status, issue_date, buyer_name, buyer_mst, buyer_address,
        seller_name, seller_mst, items, subtotal, tax_amount, total, tax_rate, payment_method, channel,
        replaces, created_at, updated_at)
      VALUES (?, ?, 'pending', datetime('now'), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
    `).bind(
      newId, haravanId, req.buyer.name, req.buyer.mst || '', req.buyer.address || '',
      original.seller.name, original.seller.mst,
      JSON.stringify(req.items), subtotal, taxAmount, total,
      req.items[0]?.taxRate || 0.1, original.paymentMethod, original.channel, id
    ).run();

    const newInvoice: Invoice = {
      ...original, id: newId, haravanId, status: 'pending', replaces: id,
      buyer: req.buyer, items: req.items,
      totals: { subtotal, taxAmount, discount: 0, total },
      createdAt: now, updatedAt: now, version: 1,
    };

    const result = await this.adapter.replace(id, newInvoice);

    if (result.success) {
      await this.db.prepare("UPDATE invoices SET status = 'issued', tvan_id = ? WHERE id = ?")
        .bind(result.tvanId, newId).run();
      await this.db.prepare("UPDATE invoices SET status = 'replaced', replaced_by = ? WHERE id = ?")
        .bind(newId, id).run();
      newInvoice.status = 'issued';
    }

    await this.auditLog(id, 'replaced', `user:${merchantId}`, { newInvoiceId: newId, reason: req.reason });

    return { invoice: newInvoice, errors: [] };
  }

  async adjust(id: string, req: AdjustInvoiceRequest, merchantId: string): Promise<{ invoice: Invoice | null; errors: string[] }> {
    const original = await this.getById(id);
    if (!original) return { invoice: null, errors: ['Hóa đơn không tồn tại'] };

    const result = await this.adapter.adjust(id, { type: req.type, items: req.items });

    if (result.success) {
      await this.db.prepare("UPDATE invoices SET status = 'adjusted', adjusted_by = ?, updated_at = datetime('now') WHERE id = ?")
        .bind(result.tvanId, id).run();
    }

    await this.auditLog(id, 'adjusted', `user:${merchantId}`, {
      type: req.type, reason: req.reason, tvanId: result.tvanId,
    });

    return { invoice: { ...original, status: 'adjusted', adjustedBy: result.tvanId }, errors: [] };
  }

  private rowToInvoice(row: Record<string, unknown>): Invoice {
    return {
      id: row.id as string,
      haravanId: row.haravan_id as string,
      tvanId: row.tvan_id as string | undefined,
      status: row.status as Invoice['status'],
      issueDate: row.issue_date as string | undefined,
      buyer: {
        name: row.buyer_name as string,
        mst: row.buyer_mst as string,
        address: row.buyer_address as string,
        email: row.buyer_email as string,
      },
      seller: {
        name: row.seller_name as string,
        mst: row.seller_mst as string,
      },
      items: JSON.parse((row.items as string) || '[]'),
      totals: {
        subtotal: row.subtotal as number,
        taxAmount: row.tax_amount as number,
        discount: row.discount as number,
        total: row.total as number,
      },
      paymentMethod: row.payment_method as Invoice['paymentMethod'],
      channel: row.channel as Invoice['channel'],
      orderId: row.order_id as string | undefined,
      replacedBy: row.replaced_by as string | undefined,
      replaces: row.replaces as string | undefined,
      adjustedBy: row.adjusted_by as string | undefined,
      adjusts: row.adjusts as string | undefined,
      metadata: JSON.parse((row.metadata as string) || '{}'),
      createdAt: row.created_at as string,
      updatedAt: row.updated_at as string,
      version: (row.version as number) || 1,
    };
  }

  private async auditLog(invoiceId: string, action: string, actor: string, details: Record<string, unknown>) {
    const id = `audit-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    await this.db.prepare(
      'INSERT INTO audit_logs (id, invoice_id, action, actor, details) VALUES (?, ?, ?, ?, ?)'
    ).bind(id, invoiceId, action, actor, JSON.stringify(details)).run();
  }
}
