export function validateMST(mst: string): string | null {
  if (!mst) return 'MST không được để trống';
  if (!/^\d+$/.test(mst)) return 'MST chỉ được chứa chữ số';
  if (mst.length !== 10 && mst.length !== 13) return 'MST phải có 10 hoặc 13 chữ số';
  return null;
}

export function validateTaxRate(rate: number): string | null {
  const allowed = [0, 0.05, 0.08, 0.1];
  if (!allowed.includes(rate)) return 'Thuế suất không hợp lệ';
  return null;
}

const DONVI = ['', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín'];

function readGroup(n: number): string {
  const tram = Math.floor(n / 100);
  const chuc = Math.floor((n % 100) / 10);
  const donvi = n % 10;
  let result = '';
  if (tram > 0) result += DONVI[tram] + ' trăm';
  if (chuc > 1) {
    result += ' ' + DONVI[chuc] + ' mươi';
    if (donvi === 1) result += ' mốt';
    else if (donvi === 5) result += ' lăm';
    else if (donvi > 0) result += ' ' + DONVI[donvi];
  } else if (chuc === 1) {
    result += ' mười';
    if (donvi === 5) result += ' lăm';
    else if (donvi > 0) result += ' ' + DONVI[donvi];
  } else if (donvi > 0) {
    if (tram > 0) result += ' linh';
    result += ' ' + DONVI[donvi];
  }
  return result.trim();
}

export function amountToWords(amount: number): string {
  if (amount === 0) return 'Không đồng';
  const trieu = Math.floor(amount / 1000000);
  const nghin = Math.floor((amount % 1000000) / 1000);
  const du = amount % 1000;
  let result = '';
  if (trieu > 0) result += readGroup(trieu) + ' triệu';
  if (nghin > 0) result += (result ? ' ' : '') + readGroup(nghin) + ' nghìn';
  if (du > 0) result += (result ? ' ' : '') + readGroup(du);
  return result + ' đồng';
}

export function validateInvoice(invoice: unknown): string[] {
  const errors: string[] = [];
  const inv = invoice as Record<string, unknown>;
  const buyer = inv?.buyer as Record<string, unknown> | undefined;
  const items = inv?.items as unknown[] | undefined;
  const totals = inv?.totals as Record<string, unknown> | undefined;
  if (!buyer?.name) errors.push('Tên người mua không được để trống');
  if (!items || items.length === 0) errors.push('Phải có ít nhất một sản phẩm');
  if (!totals || (totals.total as number) <= 0) errors.push('Tổng tiền phải lớn hơn 0');
  return errors;
}
