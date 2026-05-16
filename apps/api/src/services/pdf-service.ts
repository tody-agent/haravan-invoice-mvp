import type { Invoice } from '@haravan/shared';
import { amountToWords, STATUS_LABELS } from '@haravan/shared';

export class PDFService {
  generateHTML(invoice: Invoice): string {
    const itemsHTML = invoice.items
      .map(
        (item, i) => `
      <tr>
        <td class="center">${i + 1}</td>
        <td>${item.name}</td>
        <td class="center">${item.quantity}</td>
        <td class="right">${this.formatCurrency(item.unitPrice)}</td>
        <td class="center">${(item.taxRate * 100).toFixed(0)}%</td>
        <td class="right">${this.formatCurrency(item.total)}</td>
      </tr>`
      )
      .join('');

    return `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <title>Hóa đơn ${invoice.haravanId}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Arial, sans-serif; font-size: 13px; color: #333; padding: 40px; }
    .header { display: flex; justify-content: space-between; margin-bottom: 30px; border-bottom: 2px solid #1a73e8; padding-bottom: 20px; }
    .company-info h2 { color: #1a73e8; font-size: 18px; margin-bottom: 5px; }
    .invoice-info { text-align: right; }
    .invoice-info h1 { font-size: 22px; color: #1a73e8; }
    .parties { display: flex; justify-content: space-between; margin-bottom: 25px; }
    .party { width: 48%; }
    .party h3 { color: #555; font-size: 12px; text-transform: uppercase; margin-bottom: 8px; }
    .party p { margin-bottom: 4px; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
    th { background: #1a73e8; color: white; padding: 10px 8px; text-align: left; font-size: 12px; }
    td { padding: 8px; border-bottom: 1px solid #eee; }
    .center { text-align: center; }
    .right { text-align: right; }
    .totals { width: 300px; margin-left: auto; margin-bottom: 20px; }
    .totals tr td { padding: 6px 8px; }
    .totals .total-row { font-weight: bold; font-size: 15px; border-top: 2px solid #333; }
    .amount-words { background: #f5f5f5; padding: 12px; border-radius: 4px; margin-bottom: 20px; font-style: italic; }
    .footer { margin-top: 40px; text-align: center; font-size: 11px; color: #888; border-top: 1px solid #ddd; padding-top: 15px; }
    .status-badge { display: inline-block; padding: 4px 12px; border-radius: 12px; font-size: 11px; font-weight: bold; }
    .status-issued { background: #e3f2fd; color: #1565c0; }
    .status-accepted { background: #e8f5e9; color: #2e7d32; }
    @media print { body { padding: 20px; } }
  </style>
</head>
<body>
  <div class="header">
    <div class="company-info">
      <h2>${invoice.seller.name}</h2>
      <p>MST: ${invoice.seller.mst || 'N/A'}</p>
      <p>${invoice.seller.address || ''}</p>
    </div>
    <div class="invoice-info">
      <h1>HÓA ĐƠN ĐIỆN TỬ</h1>
      <p>Số: ${invoice.haravanId}</p>
      <p>Ngày: ${invoice.issueDate ? new Date(invoice.issueDate).toLocaleDateString('vi-VN') : 'N/A'}</p>
      <p><span class="status-badge status-${invoice.status === 'cqt_accepted' ? 'accepted' : 'issued'}">${STATUS_LABELS[invoice.status] || invoice.status}</span></p>
    </div>
  </div>

  <div class="parties">
    <div class="party">
      <h3>Người bán</h3>
      <p><strong>${invoice.seller.name}</strong></p>
      <p>MST: ${invoice.seller.mst || 'N/A'}</p>
      <p>${invoice.seller.address || ''}</p>
    </div>
    <div class="party">
      <h3>Người mua</h3>
      <p><strong>${invoice.buyer.name}</strong></p>
      <p>MST: ${invoice.buyer.mst || 'N/A'}</p>
      <p>${invoice.buyer.address || ''}</p>
      ${invoice.buyer.email ? `<p>Email: ${invoice.buyer.email}</p>` : ''}
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th class="center">STT</th>
        <th>Tên hàng hóa</th>
        <th class="center">SL</th>
        <th class="right">Đơn giá</th>
        <th class="center">Thuế suất</th>
        <th class="right">Thành tiền</th>
      </tr>
    </thead>
    <tbody>
      ${itemsHTML}
    </tbody>
  </table>

  <table class="totals">
    <tr><td>Tạm tính:</td><td class="right">${this.formatCurrency(invoice.totals.subtotal)}</td></tr>
    <tr><td>Thuế GTGT:</td><td class="right">${this.formatCurrency(invoice.totals.taxAmount)}</td></tr>
    ${invoice.totals.discount > 0 ? `<tr><td>Giảm giá:</td><td class="right">${this.formatCurrency(invoice.totals.discount)}</td></tr>` : ''}
    <tr class="total-row"><td>Tổng cộng:</td><td class="right">${this.formatCurrency(invoice.totals.total)}</td></tr>
  </table>

  <div class="amount-words">
    <strong>Bằng chữ:</strong> ${amountToWords(invoice.totals.total)}
  </div>

  ${invoice.tvanId ? `<p style="margin-bottom:10px"><strong>Mã TVAN:</strong> ${invoice.tvanId}</p>` : ''}

  <div class="footer">
    <p>Hóa đơn điện tử được tạo bởi hệ thống Haravan Invoice</p>
    <p>Theo Nghị định 70/2025/NĐ-CP và Thông tư 32/2025/TT-BTC</p>
  </div>
</body>
</html>`;
  }

  private formatCurrency(amount: number): string {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  }
}
