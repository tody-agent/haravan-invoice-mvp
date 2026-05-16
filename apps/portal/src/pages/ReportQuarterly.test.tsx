import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ReportQuarterly from './ReportQuarterly';

vi.stubGlobal('fetch', vi.fn());

const renderWithRouter = (ui: React.ReactNode) => {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
};

describe('ReportQuarterly', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.setItem('token', 'test-token');
    (fetch as any).mockResolvedValue({
      json: () => Promise.resolve({
        success: true,
        data: { quarters: [], yearTotal: { count: 0 } },
      }),
    });
  });

  it('renders quarterly report', async () => {
    renderWithRouter(<ReportQuarterly />);
    await waitFor(() => {
      expect(screen.getByText(/quý|quarterly/i)).toBeInTheDocument();
    });
  });
});
