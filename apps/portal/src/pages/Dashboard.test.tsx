import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from './Dashboard';

const mockSummary = {
  success: true,
  data: {
    totalIssued: 40,
    totalPending: 5,
    totalError: 2,
    revenueThisMonth: 50000000,
    revenueLastMonth: 40000000,
  },
};

describe('Dashboard', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renders loading skeleton initially', () => {
    vi.spyOn(globalThis, 'fetch').mockImplementation(() => new Promise(() => {}));
    render(<BrowserRouter><Dashboard /></BrowserRouter>);
    expect(document.querySelector('.hv-skeleton')).toBeTruthy();
  });

  it('renders KPI cards after fetch', async () => {
    vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockSummary,
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: { items: [] } }),
      } as Response);

    render(<BrowserRouter><Dashboard /></BrowserRouter>);

    await waitFor(() => {
      expect(screen.getByText('Tổng doanh thu')).toBeTruthy();
      expect(screen.getByText('Tổng hóa đơn')).toBeTruthy();
    });
  });

  it('renders period tabs', async () => {
    vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockSummary,
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: { items: [] } }),
      } as Response);

    render(<BrowserRouter><Dashboard /></BrowserRouter>);

    await waitFor(() => {
      expect(screen.getAllByText('30 ngày').length).toBeGreaterThanOrEqual(1);
    });
  });
});
