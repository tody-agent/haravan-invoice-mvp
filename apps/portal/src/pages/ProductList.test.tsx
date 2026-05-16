import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ProductList from './ProductList';

const mockProducts = {
  success: true,
  data: {
    items: [
      { name: 'Sản phẩm A', sku: 'SP001', totalQty: 10, totalRevenue: 1000000, invoiceCount: 3 },
      { name: 'Sản phẩm B', sku: 'SP002', totalQty: 5, totalRevenue: 500000, invoiceCount: 2 },
    ],
    total: 2,
    page: 1,
    pageSize: 20,
  },
};

describe('ProductList', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renders loading skeleton initially', () => {
    vi.spyOn(globalThis, 'fetch').mockImplementation(() => new Promise(() => {}));
    render(<BrowserRouter><ProductList /></BrowserRouter>);
    expect(document.querySelector('.hv-skeleton')).toBeTruthy();
  });

  it('renders product table after fetch', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => mockProducts,
    } as Response);

    render(<BrowserRouter><ProductList /></BrowserRouter>);

    await waitFor(() => {
      expect(screen.getByText('Sản phẩm A')).toBeTruthy();
      expect(screen.getByText('Sản phẩm B')).toBeTruthy();
      expect(screen.getByText('SP001')).toBeTruthy();
    });
  });

  it('renders empty state when no products', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, data: { items: [], total: 0 } }),
    } as Response);

    render(<BrowserRouter><ProductList /></BrowserRouter>);

    await waitFor(() => {
      expect(screen.getByText('Chưa có sản phẩm')).toBeTruthy();
    });
  });

  it('renders search input', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => mockProducts,
    } as Response);

    render(<BrowserRouter><ProductList /></BrowserRouter>);

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Tìm sản phẩm...')).toBeTruthy();
    });
  });
});
