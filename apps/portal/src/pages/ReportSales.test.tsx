import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ReportSales from './ReportSales';

vi.stubGlobal('fetch', vi.fn());

const renderWithRouter = (ui: React.ReactNode) => {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
};

describe('ReportSales', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.setItem('token', 'test-token');
    (fetch as any).mockResolvedValue({
      json: () => Promise.resolve({
        success: true,
        data: { days: [], summary: { count: 0, total: 0 } },
      }),
    });
  });

  it('renders sales report', async () => {
    renderWithRouter(<ReportSales />);
    await waitFor(() => {
      expect(screen.getByText(/doanh số|sales/i)).toBeInTheDocument();
    });
  });
});
