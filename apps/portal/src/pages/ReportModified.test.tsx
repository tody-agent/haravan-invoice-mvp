import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ReportModified from './ReportModified';

vi.stubGlobal('fetch', vi.fn());

const renderWithRouter = (ui: React.ReactNode) => {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
};

describe('ReportModified', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.setItem('token', 'test-token');
    (fetch as any).mockResolvedValue({
      json: () => Promise.resolve({
        success: true,
        data: { invoices: [], count: 0 },
      }),
    });
  });

  it('renders modified report', async () => {
    renderWithRouter(<ReportModified />);
    await waitFor(() => {
      expect(screen.getByText(/điều chỉnh|modified/i)).toBeInTheDocument();
    });
  });
});
