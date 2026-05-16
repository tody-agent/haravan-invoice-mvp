import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CustomerDetail from './CustomerDetail';

const mockCustomer = {
  success: true,
  data: {
    id: 'cust-001',
    name: 'Công ty TNHH ABC',
    mst: '0123456789',
    address: '123 Nguyễn Huệ, Q1, TP.HCM',
    email: 'abc@example.com',
    phone: '0901234567',
    createdAt: '2025-01-15T08:30:00Z',
    recentInvoices: [
      { id: 'inv-1', haravanId: 'HD001', status: 'issued', total: 5000000, issueDate: '2026-05-10' },
      { id: 'inv-2', haravanId: 'HD002', status: 'cqt_accepted', total: 3000000, issueDate: '2026-05-08' },
    ],
  },
};

const mockAnalytics = {
  success: true,
  data: {
    customer: mockCustomer.data,
    stats: {
      totalInvoices: 25,
      totalRevenue: 120000000,
      avgOrderValue: 4800000,
      firstInvoice: '2025-01-15T08:30:00Z',
      lastInvoice: '2026-05-10T14:20:00Z',
    },
    monthly: [
      { month: '2026-05', count: 3, total: 15000000 },
      { month: '2026-04', count: 5, total: 22000000 },
    ],
    channels: [
      { channel: 'pos', count: 15, total: 70000000 },
      { channel: 'web', count: 10, total: 50000000 },
    ],
  },
};

describe('CustomerDetail', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renders loading skeleton initially', () => {
    vi.spyOn(globalThis, 'fetch').mockImplementation(() => new Promise(() => {}));
    render(<BrowserRouter><CustomerDetail /></BrowserRouter>);
    expect(document.querySelector('.hv-skeleton')).toBeTruthy();
  });

  it('renders customer name and info after fetch', async () => {
    vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce({ ok: true, json: async () => mockCustomer } as Response)
      .mockResolvedValueOnce({ ok: true, json: async () => mockAnalytics } as Response);

    render(<BrowserRouter><CustomerDetail /></BrowserRouter>);

    await waitFor(() => {
      expect(screen.getAllByText('Công ty TNHH ABC').length).toBeGreaterThanOrEqual(2);
    });
    expect(screen.getByText('0123456789')).toBeTruthy();
    expect(screen.getByText(/123 Nguyễn Huệ/)).toBeTruthy();
  });

  it('renders KPI cards with analytics data', async () => {
    vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce({ ok: true, json: async () => mockCustomer } as Response)
      .mockResolvedValueOnce({ ok: true, json: async () => mockAnalytics } as Response);

    render(<BrowserRouter><CustomerDetail /></BrowserRouter>);

    await waitFor(() => {
      expect(screen.getByText('Tổng hóa đơn')).toBeTruthy();
      expect(screen.getByText('Tổng doanh thu')).toBeTruthy();
      expect(screen.getByText('Giá trị TB')).toBeTruthy();
      expect(screen.getByText('Giao dịch gần nhất')).toBeTruthy();
      expect(screen.getByText('25')).toBeTruthy();
      expect(screen.getByText('120.000.000đ')).toBeTruthy();
    });
  });

  it('renders channel breakdown table', async () => {
    vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce({ ok: true, json: async () => mockCustomer } as Response)
      .mockResolvedValueOnce({ ok: true, json: async () => mockAnalytics } as Response);

    render(<BrowserRouter><CustomerDetail /></BrowserRouter>);

    await waitFor(() => {
      expect(screen.getByText('Theo kênh')).toBeTruthy();
      expect(screen.getByText('POS')).toBeTruthy();
      expect(screen.getByText('WEB')).toBeTruthy();
    });
  });

  it('renders recent invoices table', async () => {
    vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce({ ok: true, json: async () => mockCustomer } as Response)
      .mockResolvedValueOnce({ ok: true, json: async () => mockAnalytics } as Response);

    render(<BrowserRouter><CustomerDetail /></BrowserRouter>);

    await waitFor(() => {
      expect(screen.getByText('Hóa đơn gần đây')).toBeTruthy();
      expect(screen.getByText('HD001')).toBeTruthy();
      expect(screen.getByText('HD002')).toBeTruthy();
    });
  });

  it('renders empty state when customer not found', async () => {
    vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce({ ok: true, json: async () => ({ success: false }) } as Response)
      .mockResolvedValueOnce({ ok: true, json: async () => ({ success: false }) } as Response);

    render(<BrowserRouter><CustomerDetail /></BrowserRouter>);

    await waitFor(() => {
      expect(screen.getByText('Không tìm thấy')).toBeTruthy();
    });
  });
});
