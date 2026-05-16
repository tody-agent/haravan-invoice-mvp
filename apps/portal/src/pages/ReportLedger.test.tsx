import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ReportLedger from './ReportLedger';

vi.stubGlobal('fetch', vi.fn());

const renderWithRouter = (ui: React.ReactNode) => {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
};

describe('ReportLedger', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.setItem('token', 'test-token');
    (fetch as any).mockResolvedValue({
      json: () => Promise.resolve({
        success: true,
        data: { invoices: [], summary: { count: 0 } },
      }),
    });
  });

  it('renders ledger report', async () => {
    renderWithRouter(<ReportLedger />);
    await waitFor(() => {
      expect(screen.getByText(/sổ cái|ledger/i)).toBeInTheDocument();
    });
  });
});
