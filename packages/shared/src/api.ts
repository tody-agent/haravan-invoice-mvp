export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface HealthCheckResponse {
  status: 'ok' | 'error';
  db: string;
  kv?: string;
  timestamp: string;
}

export interface ReportSummary {
  totalIssued: number;
  totalPending: number;
  totalError: number;
  revenueThisMonth: number;
  revenueLastMonth: number;
}

export interface MonthlyReport {
  month: string;
  invoices: Array<{
    id: string;
    haravanId: string;
    buyerName: string;
    total: number;
    status: string;
    issueDate: string;
  }>;
  summary: {
    count: number;
    totalAmount: number;
    taxAmount: number;
  };
}
