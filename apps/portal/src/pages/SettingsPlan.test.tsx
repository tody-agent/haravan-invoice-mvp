import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SettingsPlan from './SettingsPlan';

vi.stubGlobal('fetch', vi.fn());

const renderWithRouter = (ui: React.ReactNode) => {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
};

describe('SettingsPlan', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.setItem('token', 'test-token');
    (fetch as any).mockResolvedValue({
      json: () => Promise.resolve({
        success: true,
        data: { plan: 'Free', invoiceLimit: 100, invoiceUsed: 10 },
      }),
    });
  });

  it('renders plan settings', async () => {
    renderWithRouter(<SettingsPlan />);
    await waitFor(() => {
      expect(screen.getByText(/gói|plan|Free/i)).toBeInTheDocument();
    });
  });
});
