import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import DailyAggregate from './DailyAggregate';

vi.stubGlobal('fetch', vi.fn());

const renderWithRouter = (ui: React.ReactNode) => {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
};

describe('DailyAggregate', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.setItem('token', 'test-token');
    (fetch as any).mockResolvedValue({
      json: () => Promise.resolve({
        success: true,
        data: { items: [], total: 0 },
      }),
    });
  });

  it('renders aggregate page', async () => {
    renderWithRouter(<DailyAggregate />);
    await waitFor(() => {
      expect(screen.getByText(/gộp đơn|aggregate/i)).toBeInTheDocument();
    });
  });

  it('shows aggregate button', async () => {
    renderWithRouter(<DailyAggregate />);
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /gộp/i })).toBeInTheDocument();
    });
  });
});
