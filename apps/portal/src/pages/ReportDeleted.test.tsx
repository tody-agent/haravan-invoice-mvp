import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ReportDeleted from './ReportDeleted';

vi.stubGlobal('fetch', vi.fn());

const renderWithRouter = (ui: React.ReactNode) => {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
};

describe('ReportDeleted', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.setItem('token', 'test-token');
    (fetch as any).mockResolvedValue({
      json: () => Promise.resolve({
        success: true,
        data: { invoices: [], count: 0, note: '' },
      }),
    });
  });

  it('renders deleted report', async () => {
    renderWithRouter(<ReportDeleted />);
    await waitFor(() => {
      expect(screen.getByText(/xóa|hủy|deleted/i)).toBeInTheDocument();
    });
  });
});
