import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ReportReplaced from './ReportReplaced';

vi.stubGlobal('fetch', vi.fn());

const renderWithRouter = (ui: React.ReactNode) => {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
};

describe('ReportReplaced', () => {
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

  it('renders replaced report', async () => {
    renderWithRouter(<ReportReplaced />);
    await waitFor(() => {
      expect(screen.getByText(/thay thế|replaced/i)).toBeInTheDocument();
    });
  });
});
