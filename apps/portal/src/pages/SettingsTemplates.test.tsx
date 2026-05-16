import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SettingsTemplates from './SettingsTemplates';

vi.stubGlobal('fetch', vi.fn());

const renderWithRouter = (ui: React.ReactNode) => {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
};

describe('SettingsTemplates', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.setItem('token', 'test-token');
    (fetch as any).mockResolvedValue({
      json: () => Promise.resolve({
        success: true,
        data: { mauSo: '01GTKT0/001', kyHieu: 'AA/20E' },
      }),
    });
  });

  it('renders template settings', async () => {
    renderWithRouter(<SettingsTemplates />);
    await waitFor(() => {
      expect(screen.getByText(/mẫu hóa đơn|template|ký hiệu/i)).toBeInTheDocument();
    });
  });
});
