import type { TVANAdapter, TVANResult } from '@haravan/shared';
import type { Invoice } from '@haravan/shared';

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function randomId(): string {
  return Math.random().toString(36).substring(2, 10);
}

export class MockAdapter implements TVANAdapter {
  readonly provider = 'mock';
  private errorRate: number;

  constructor(errorRate = 0.05) {
    this.errorRate = errorRate;
  }

  async issue(invoice: Invoice): Promise<TVANResult> {
    await delay(500);
    
    if (Math.random() < this.errorRate) {
      return {
        success: false,
        error: {
          code: 'MOCK_ERROR',
          message: 'Mock adapter simulated failure',
        },
      };
    }

    return {
      success: true,
      tvanId: `MOCK-${Date.now()}-${randomId()}`,
      cqtConfirmation: {
        id: `CQT-${randomId()}`,
        at: new Date().toISOString(),
      },
    };
  }

  async replace(originalId: string, replacement: Invoice): Promise<TVANResult> {
    await delay(800);
    
    if (Math.random() < this.errorRate) {
      return {
        success: false,
        error: { code: 'MOCK_ERROR', message: 'Mock replace failed' },
      };
    }

    return {
      success: true,
      tvanId: `MOCK-RPL-${Date.now()}-${randomId()}`,
      cqtConfirmation: {
        id: `CQT-RPL-${randomId()}`,
        at: new Date().toISOString(),
      },
    };
  }

  async adjust(originalId: string, adjustment: { type: 'increase' | 'decrease'; items: Partial<{ name: string; quantity: number; unitPrice: number; total: number }>[] }): Promise<TVANResult> {
    await delay(600);
    
    if (Math.random() < this.errorRate) {
      return {
        success: false,
        error: { code: 'MOCK_ERROR', message: 'Mock adjust failed' },
      };
    }

    return {
      success: true,
      tvanId: `MOCK-ADJ-${Date.now()}-${randomId()}`,
      cqtConfirmation: {
        id: `CQT-ADJ-${randomId()}`,
        at: new Date().toISOString(),
      },
    };
  }

  async query(tvanId: string): Promise<{ status: string; data?: unknown }> {
    await delay(200);
    
    return {
      status: 'cqt_accepted',
      data: {
        tvanId,
        confirmationId: `CQT-${randomId()}`,
        confirmedAt: new Date().toISOString(),
      },
    };
  }
}
