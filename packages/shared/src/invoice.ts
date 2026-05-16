export type InvoiceStatus =
  | 'draft'
  | 'pending'
  | 'issued'
  | 'cqt_accepted'
  | 'cqt_rejected'
  | 'adjusted'
  | 'replaced';

export type Channel = 'admin' | 'pos' | 'web' | 'auto';

export type PaymentMethod = 'cash' | 'transfer' | 'card' | 'cod' | 'other';

export type TaxRate = 0 | 0.05 | 0.08 | 0.1;

export interface Party {
  name: string;
  mst?: string;
  address?: string;
  email?: string;
  phone?: string;
}

export interface LineItem {
  name: string;
  sku?: string;
  quantity: number;
  unitPrice: number;
  taxRate: TaxRate;
  discount?: number;
  total: number;
}

export interface InvoiceTotals {
  subtotal: number;
  taxAmount: number;
  discount: number;
  total: number;
}

export interface Invoice {
  id: string;
  haravanId: string;
  tvanId?: string;
  status: InvoiceStatus;
  issueDate?: string;
  seller: Party;
  buyer: Party;
  items: LineItem[];
  totals: InvoiceTotals;
  paymentMethod: PaymentMethod;
  channel: Channel;
  orderId?: string;
  replacedBy?: string;
  replaces?: string;
  adjustedBy?: string;
  adjusts?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
  version: number;
}

export interface CreateInvoiceRequest {
  buyer: Party;
  items: LineItem[];
  paymentMethod?: PaymentMethod;
  channel?: Channel;
  orderId?: string;
  taxRate?: TaxRate;
}

export interface ReplaceInvoiceRequest {
  buyer: Party;
  items: LineItem[];
  reason: string;
}

export interface AdjustInvoiceRequest {
  type: 'increase' | 'decrease';
  items: Partial<LineItem>[];
  reason: string;
}

export interface InvoiceFilter {
  status?: InvoiceStatus[];
  dateFrom?: string;
  dateTo?: string;
  buyerMst?: string;
  buyerName?: string;
  channel?: Channel;
  page?: number;
  pageSize?: number;
}

export interface AuditLog {
  id: string;
  invoiceId: string;
  action: string;
  actor: string;
  details?: Record<string, unknown>;
  createdAt: string;
}

export interface Customer {
  id: string;
  name: string;
  mst?: string;
  address?: string;
  email?: string;
  phone?: string;
  createdAt: string;
}

export interface MerchantConfig {
  merchantId: string;
  autoIssueOnPaid: boolean;
  defaultTaxRate: TaxRate;
  sellerName?: string;
  sellerMst?: string;
  sellerAddress?: string;
  tvanProvider: 'mock' | 'hilo' | 'viettel' | 'misa';
  createdAt: string;
  updatedAt: string;
}
