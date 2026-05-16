import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Notifications from './Notifications';

vi.stubGlobal('fetch', vi.fn());

const renderWithRouter = (ui: React.ReactNode) => {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
};

const mockNotifications = [
  { id: '1', type: 'success', title: 'Hóa đơn đã phát hành', message: 'HRV-INV-001-001 đã được CQT chấp nhận', time: new Date().toISOString(), read: false, link: '/invoices/inv-001', category: 'invoice' },
  { id: '2', type: 'warning', title: 'Hóa đơn chờ xử lý', message: 'Đang chờ CQT xác nhận', time: new Date().toISOString(), read: false, link: '', category: 'invoice' },
  { id: '3', type: 'error', title: 'Phát hành thất bại', message: 'Bị từ chối bởi CQT', time: new Date().toISOString(), read: true, link: '', category: 'invoice' },
];

describe('Notifications', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.setItem('token', 'test-token');
    (fetch as any).mockResolvedValue({
      json: () => Promise.resolve({
        success: true,
        data: { items: mockNotifications, total: 3, unreadCount: 2 },
      }),
    });
  });

  it('renders notification list', async () => {
    renderWithRouter(<Notifications />);
    await waitFor(() => {
      expect(screen.getByText('Hóa đơn đã phát hành')).toBeInTheDocument();
    });
    expect(screen.getByText('Hóa đơn chờ xử lý')).toBeInTheDocument();
    expect(screen.getByText('Phát hành thất bại')).toBeInTheDocument();
  });

  it('shows unread count badge', async () => {
    renderWithRouter(<Notifications />);
    await waitFor(() => {
      expect(screen.getByText('2')).toBeInTheDocument();
    });
  });

  it('shows mark all as read button when unread exists', async () => {
    renderWithRouter(<Notifications />);
    await waitFor(() => {
      expect(screen.getByText(/Đánh dấu tất cả đã đọc/)).toBeInTheDocument();
    });
  });

  it('filter tabs render', async () => {
    renderWithRouter(<Notifications />);
    await waitFor(() => {
      expect(screen.getByText('Tất cả')).toBeInTheDocument();
      expect(screen.getByText('Chưa đọc')).toBeInTheDocument();
    });
  });

  it('mark all as read works', async () => {
    renderWithRouter(<Notifications />);
    await waitFor(() => {
      const btn = screen.getByText(/Đánh dấu tất cả đã đọc/);
      fireEvent.click(btn);
    });
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/read-all'),
        expect.any(Object)
      );
    });
  });
});
