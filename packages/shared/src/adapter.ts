import type { Invoice } from './invoice';

export interface TVANResult {
  success: boolean;
  tvanId?: string;
  cqtConfirmation?: {
    id: string;
    at: string;
  };
  error?: {
    code: string;
    message: string;
  };
}

export interface TVANAdapter {
  readonly provider: string;

  issue(invoice: Invoice): Promise<TVANResult>;
  replace(originalId: string, replacement: Invoice): Promise<TVANResult>;
  adjust(
    originalId: string,
    adjustment: {
      type: 'increase' | 'decrease';
      items: Partial<{
        name: string;
        quantity: number;
        unitPrice: number;
        total: number;
      }>[];
    }
  ): Promise<TVANResult>;
  query(tvanId: string): Promise<{ status: string; data?: unknown }>;
}
