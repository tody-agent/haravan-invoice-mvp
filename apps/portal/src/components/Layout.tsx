import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { STATUS_LABELS } from '@haravan/shared';

const mainNav = [
  { id: 'dashboard', label: 'Tổng quan', icon: 'ti ti-layout-dashboard', href: '/' },
  { id: 'notifications', label: 'Thông báo', icon: 'ti ti-bell', href: '/notifications', count: 8 },
  {
    id: 'invoices', label: 'Hóa đơn', icon: 'ti ti-receipt', href: '/invoices',
    children: [
      { id: 'issue', label: 'Tạo hóa đơn', href: '/invoices/new' },
      { id: 'correction', label: 'Xử lý sai sót', href: '#' },
      { id: 'invoices', label: 'Danh sách hóa đơn', href: '/invoices' },
    ]
  },
  { id: 'customers', label: 'Khách hàng', icon: 'ti ti-users', href: '/customers' },
  { id: 'products', label: 'Sản phẩm', icon: 'ti ti-package', href: '/products' },
  { id: 'analytics', label: 'Phân tích', icon: 'ti ti-chart-dots-2', href: '/analytics' },
  {
    id: 'reports', label: 'Báo cáo', icon: 'ti ti-file-report', href: '/reports',
    children: [
      { id: 'report-quarterly', label: 'Sử dụng HĐĐT theo quý', href: '/reports/quarterly' },
      { id: 'report-ledger', label: 'Bảng kê hàng tháng', href: '/reports/ledger' },
      { id: 'report-sales', label: 'Chi tiết bán hàng', href: '/reports/sales' },
      { id: 'report-deleted', label: 'Hóa đơn xóa bỏ', href: '/reports/deleted' },
      { id: 'report-modified', label: 'Hóa đơn sửa đổi', href: '/reports/modified' },
      { id: 'report-replaced', label: 'Hóa đơn thay thế', href: '/reports/replaced' },
    ]
  },
];

const configNav = [
  { id: 'settings-org', label: 'Thông tin', icon: 'ti ti-building-store', href: '/settings' },
  { id: 'tvan', label: 'Chữ ký số', icon: 'ti ti-certificate', href: '/settings/cert' },
  { id: 'settings-templates', label: 'Mẫu hóa đơn', icon: 'ti ti-file-description', href: '/settings/templates' },
  { id: 'automation', label: 'Tự động hóa', icon: 'ti ti-bolt', href: '/settings/automation' },
  { id: 'settings-billing', label: 'Gói dịch vụ', icon: 'ti ti-credit-card', href: '/settings/plan' },
];

export default function Layout() {
  const location = useLocation();
  const { user, logout } = useAuth();

  const isActive = (href: string) => {
    if (href === '/') return location.pathname === '/';
    return location.pathname.startsWith(href);
  };

  const hasActiveChild = (children?: { href: string }[]) => {
    if (!children) return false;
    return children.some(c => c.href !== '#' && location.pathname.startsWith(c.href));
  };

  const pageTitle = () => {
    if (location.pathname === '/') return 'Tổng quan';
    if (location.pathname === '/invoices') return 'Danh sách hóa đơn';
    if (location.pathname === '/invoices/new') return 'Tạo hóa đơn';
    if (location.pathname.match(/^\/invoices\/[^/]+\/correct$/)) return 'Xử lý sai sót';
    if (location.pathname.match(/^\/invoices\/[^/]+$/)) return 'Chi tiết hóa đơn';
    if (location.pathname === '/settings') return 'Thông tin doanh nghiệp';
    if (location.pathname === '/settings/templates') return 'Mẫu hóa đơn';
    if (location.pathname === '/settings/automation') return 'Tự động hóa';
    if (location.pathname === '/settings/plan') return 'Gói dịch vụ';
    if (location.pathname === '/settings/cert') return 'Chữ ký số';
    if (location.pathname === '/customers') return 'Khách hàng';
    if (location.pathname.match(/^\/customers\/[^/]+$/)) return 'Chi tiết khách hàng';
    if (location.pathname === '/products') return 'Sản phẩm';
    if (location.pathname === '/analytics') return 'Phân tích';
    if (location.pathname === '/reports') return 'Báo cáo';
    if (location.pathname === '/notifications') return 'Thông báo';
    return 'Haravan Invoice';
  };

  return (
    <>
      {/* Sidebar */}
      <aside className="hv-sidebar" role="navigation" aria-label="Điều hướng chính">
        <Link className="hv-sidebar-logo" to="/" aria-label="Trang chủ">
          <div className="logo-mark"><i className="ti ti-receipt-2"></i></div>
          <span className="logo-text">haravan<span className="logo-dot"></span></span>
        </Link>

        <div className="hv-sidebar-search">
          <div className="hv-sidebar-search-wrap">
            <i className="ti ti-search search-icon"></i>
            <input type="text" id="hv-global-search" placeholder="Tìm kiếm" aria-label="Tìm kiếm" />
            <span className="search-shortcut">⌘K</span>
          </div>
        </div>

        <div className="hv-sidebar-body">
          {mainNav.map(item => {
            const active = isActive(item.href);
            const childActive = hasActiveChild(item.children);
            const parentClass = [
              'hv-sidebar-item',
              active ? 'hv-sidebar-item-active' : '',
              childActive ? 'has-active-child' : '',
            ].filter(Boolean).join(' ');

            return (
              <div key={item.id}>
                <Link to={item.href} className={parentClass} aria-label={item.label}>
                  <i className={item.icon}></i>
                  <span className="label">{item.label}</span>
                  {item.count && <span className="count">{item.count}</span>}
                </Link>
                {item.children && (active || childActive) && (
                  <div className="hv-sidebar-subitems">
                    {item.children.map(child => (
                      <Link key={child.id} to={child.href}
                        className={`hv-sidebar-subitem ${isActive(child.href) ? 'active' : ''}`}>
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          <div className="hv-sidebar-section">
            <div className="hv-sidebar-section-title">
              <span>CẤU HÌNH</span>
              <i className="ti ti-chevron-down"></i>
            </div>
            {configNav.map(item => (
              <Link key={item.id} to={item.href}
                className={`hv-sidebar-item ${isActive(item.href) ? 'hv-sidebar-item-active' : ''}`}
                aria-label={item.label}>
                <i className={item.icon}></i>
                <span className="label">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="hv-sidebar-footer">
          <Link to="/settings" className={`hv-sidebar-item ${location.pathname === '/settings' ? 'hv-sidebar-item-active' : ''}`}>
            <i className="ti ti-settings"></i>
            <span className="label">Cấu hình</span>
          </Link>
        </div>
      </aside>

      {/* Topbar */}
      <div className="hv-topbar" role="banner" aria-label="Thanh công cụ">
        <div className="hv-topbar-left">
          <button className="hv-sidebar-toggle" aria-label="Mở menu" onClick={() => {
            document.querySelector('.hv-sidebar')?.classList.toggle('hv-sidebar-open');
          }}>
            <i className="ti ti-menu-2"></i>
          </button>
          <div className="hv-workspace-pill" title={user?.name || 'Admin'}>
            <span className="hv-workspace-avatar">{(user?.name || 'A').charAt(0).toUpperCase()}</span>
            <span style={{ maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user?.name || 'Admin'}
            </span>
          </div>
        </div>
        <nav className="hv-breadcrumb" aria-label="Breadcrumb">
          <span className="crumb-current">{pageTitle()}</span>
        </nav>
        <div className="hv-topbar-right">
          <button className="hv-topbar-icon-btn" aria-label="Thông báo" onClick={() => window.location.href = '/notifications'}>
            <i className="ti ti-bell"></i>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="hv-content" id="main-content">
        <div className="hv-content-max">
          <Outlet />
        </div>
      </div>
    </>
  );
}
