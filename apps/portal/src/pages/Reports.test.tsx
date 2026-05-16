import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Reports from './Reports';

vi.stubGlobal('fetch', vi.fn());

const renderWithRouter = (ui: React.ReactNode) => {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
};

describe('Reports', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.setItem('token', 'test-token');
  });

  it('renders reports page', () => {
    renderWithRouter(<Reports />);
    expect(screen.getByText(/báo cáo|report/i)).toBeInTheDocument();
  });

  it('shows report navigation links', () => {
    renderWithRouter(<Reports />);
    expect(screen.getByText(/doanh số|sales/i)).toBeInTheDocument();
    expect(screen.getByText(/sổ cái|ledger/i)).toBeInTheDocument();
  });
});
