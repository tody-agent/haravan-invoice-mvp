import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ComplianceCenter from './ComplianceCenter';

vi.stubGlobal('fetch', vi.fn());

const renderWithRouter = (ui: React.ReactNode) => {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
};

describe('ComplianceCenter', () => {
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

  it('renders compliance center', async () => {
    renderWithRouter(<ComplianceCenter />);
    await waitFor(() => {
      expect(screen.getByText(/tuân thủ|compliance|NĐ 70/i)).toBeInTheDocument();
    });
  });
});
