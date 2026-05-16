import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SettingsAutomation from './SettingsAutomation';

vi.stubGlobal('fetch', vi.fn());

const renderWithRouter = (ui: React.ReactNode) => {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
};

describe('SettingsAutomation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.setItem('token', 'test-token');
    (fetch as any).mockResolvedValue({
      json: () => Promise.resolve({
        success: true,
        data: { autoIssueOnPaid: true, channels: ['web', 'pos'] },
      }),
    });
  });

  it('renders automation settings', async () => {
    renderWithRouter(<SettingsAutomation />);
    await waitFor(() => {
      expect(screen.getByText(/tự động|automation|phát hành/i)).toBeInTheDocument();
    });
  });
});
