import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import InvoiceCreate from './InvoiceCreate';

vi.stubGlobal('fetch', vi.fn());

const renderWithRouter = (ui: React.ReactNode) => {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
};

describe('InvoiceCreate', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.setItem('token', 'test-token');
  });

  it('renders form fields', () => {
    renderWithRouter(<InvoiceCreate />);
    expect(screen.getByText(/Tạo hóa đơn/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Tên người mua/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Mã số thuế/i)).toBeInTheDocument();
  });

  it('add item button works', () => {
    renderWithRouter(<InvoiceCreate />);
    const addBtn = screen.getByText(/Thêm sản phẩm/i) || screen.getByRole('button', { name: /thêm/i });
    fireEvent.click(addBtn);
  });

  it('submit button exists', () => {
    renderWithRouter(<InvoiceCreate />);
    expect(screen.getByRole('button', { name: /phát hành/i })).toBeInTheDocument();
  });
});
