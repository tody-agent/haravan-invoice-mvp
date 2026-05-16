import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Analytics from './Analytics';

vi.stubGlobal('fetch', vi.fn());

const renderWithRouter = (ui: React.ReactNode) => {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
};

describe('Analytics', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.setItem('token', 'test-token');
    (fetch as any).mockResolvedValue({
      json: () => Promise.resolve({
        success: true,
        data: [
          { channel: 'web', count: 50, total: 500000000 },
          { channel: 'pos', count: 30, total: 200000000 },
          { channel: 'admin', count: 20, total: 300000000 },
        ],
      }),
    });
  });

  it('renders analytics page', async () => {
    renderWithRouter(<Analytics />);
    await waitFor(() => {
      expect(screen.getByText(/kênh|channel|omnichannel/i)).toBeInTheDocument();
    });
  });

  it('shows channel data', async () => {
    renderWithRouter(<Analytics />);
    await waitFor(() => {
      expect(screen.getByText('web')).toBeInTheDocument();
    });
  });
});
