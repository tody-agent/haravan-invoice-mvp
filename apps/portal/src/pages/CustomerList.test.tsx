import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import CustomerList from './CustomerList';

vi.stubGlobal('fetch', vi.fn());

const renderWithRouter = (ui: React.ReactNode) => {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
};

describe('CustomerList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.setItem('token', 'test-token');
    (fetch as any).mockResolvedValue({
      json: () => Promise.resolve({
        success: true,
        data: {
          items: [
            { id: 'cust-001', name: 'Công ty ABC', mst: '0123456789', email: 'abc@example.com' },
            { id: 'cust-002', name: 'Nguyễn Văn A', mst: '', email: 'a@gmail.com' },
          ],
          total: 2,
          page: 1,
          pageSize: 20,
        },
      }),
    });
  });

  it('renders customer list', async () => {
    renderWithRouter(<CustomerList />);
    await waitFor(() => {
      expect(screen.getByText('Công ty ABC')).toBeInTheDocument();
    });
  });

  it('search input exists', async () => {
    renderWithRouter(<CustomerList />);
    await waitFor(() => {
      const searchInput = screen.getByPlaceholderText(/tìm kiếm|search/i);
      expect(searchInput).toBeInTheDocument();
    });
  });
});
