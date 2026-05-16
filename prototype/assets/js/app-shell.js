/* ============================================
   HARAVAN INVOICE — App Shell v5.0
   Sidebar + Topbar + Data + Toast + Modal + Utils
   Pixel-aligned to Haravan Admin screenshots
   ============================================ */

const HV = {
  page: window.HV_PAGE || {},

  /* ============================================
     NAVIGATION STRUCTURE
     ============================================ */
  nav: {
    main: [
      { id: 'dashboard', label: 'Tổng quan', icon: 'ti ti-layout-dashboard', href: 'dashboard.html' },
      { id: 'notifications', label: 'Thông báo', icon: 'ti ti-bell', href: 'notification-center.html', count: 8 },
      {
        id: 'invoices', label: 'Hóa đơn', icon: 'ti ti-receipt', href: 'invoice-list.html', count: 1247,
        children: [
          { id: 'issue',        label: 'Tạo hóa đơn',      href: 'invoice-issue.html', icon: 'ti ti-plus' },
          { id: 'correction',   label: 'Xử lý sai sót',    href: 'correction-wizard.html', icon: 'ti ti-tool' },
          { id: 'aggregation',  label: 'Gộp hóa đơn',      href: 'daily-aggregation.html', icon: 'ti ti-box-multiple' },
          { id: 'inbound',      label: 'Hóa đơn đầu vào',  href: 'inbound-workbench.html', icon: 'ti ti-download' },
          { id: 'invoices',     label: 'Danh sách hóa đơn', href: 'invoice-list.html', icon: 'ti ti-list' },
        ]
      },
      { id: 'customers',   label: 'Khách hàng', icon: 'ti ti-users-group', href: 'customer-catalog.html' },
      { id: 'products',    label: 'Sản phẩm',   icon: 'ti ti-package',     href: 'product-catalog.html' },
      { id: 'analytics',   label: 'Phân tích',   icon: 'ti ti-chart-dots-2', href: 'analytics.html' },
      { id: 'reports',     label: 'Báo cáo',     icon: 'ti ti-file-report',  href: 'reports.html',
        children: [
          { id: 'report-quarterly', label: 'Sử dụng HĐĐT theo quý', href: 'report-quarterly.html', icon: 'ti ti-calendar' },
          { id: 'report-ledger',    label: 'Bảng kê hàng tháng',    href: 'report-ledger.html', icon: 'ti ti-file-analytics' },
          { id: 'report-sales',     label: 'Chi tiết bán hàng',     href: 'report-sales.html', icon: 'ti ti-shopping-cart' },
          { id: 'report-deleted',   label: 'Hóa đơn xóa bỏ',       href: 'report-deleted.html', icon: 'ti ti-trash' },
          { id: 'report-modified',  label: 'Hóa đơn sửa đổi',      href: 'report-modified.html', icon: 'ti ti-edit' },
          { id: 'report-replaced',  label: 'Hóa đơn thay thế',      href: 'report-replaced.html', icon: 'ti ti-replace' },
        ]
      },
    ],
    configTitle: 'CẤU HÌNH',
    config: [
      { id: 'settings-org',       label: 'Thông tin',     icon: 'ti ti-building-store',   href: 'settings-org-users.html' },
      { id: 'tvan',               label: 'Chữ ký số',     icon: 'ti ti-certificate',      href: 'tvan-connections.html' },
      { id: 'settings-templates', label: 'Mẫu hóa đơn',   icon: 'ti ti-file-description', href: 'settings-templates.html' },
      { id: 'automation',         label: 'Tự động hóa',   icon: 'ti ti-bolt',             href: 'automation-builder.html' },
      { id: 'settings-billing',   label: 'Gói dịch vụ',   icon: 'ti ti-credit-card',      href: 'settings-invoice-billing.html' },
    ],
  },

  /* ============================================
     MOCK DATA LAYER  (preserved from v4)
     ============================================ */
  data: {
    invoices: [
      { id: '2025/00001234', customer: 'Công ty TNHH Cà phê Trung Nguyên Legend', mst: '0312345678', channel: 'Web', total: 1250000, payment: 'paid', cqt: 'accepted', date: '15/05/2026', items: [
        { name: 'Cà phê Robusta Đắk Lắk 500g', unit: 'Gói', qty: 5, price: 120000, tax: 10 },
        { name: 'Trà Sen Tây Hồ hộp 200g', unit: 'Hộp', qty: 3, price: 80000, tax: 10 },
        { name: 'Bánh Bao Nhân Thịt (hộp 10)', unit: 'Hộp', qty: 2, price: 80000, tax: 10 },
      ]},
      { id: '2025/00001233', customer: 'Khách lẻ', mst: '', channel: 'POS', total: 85000, payment: 'paid', cqt: 'pending', date: '15/05/2026', items: [
        { name: 'Cà phê sữa đá', unit: 'Ly', qty: 2, price: 35000, tax: 10 },
        { name: 'Bánh mì thịt', unit: 'Cái', qty: 1, price: 25000, tax: 10 },
      ]},
      { id: '2025/00001232', customer: 'CTCP Vàng bạc Đá quý DOJI', mst: '0100123456', channel: 'Web', total: 3750000, payment: 'pending', cqt: 'accepted', date: '14/05/2026', items: [
        { name: 'Nhẫn vàng 18K', unit: 'Cái', qty: 1, price: 3500000, tax: 10 },
      ]},
      { id: '2025/00001231', customer: 'Hộ kinh doanh Nguyễn Văn An', mst: '8765432109', channel: 'POS', total: 450000, payment: 'paid', cqt: 'accepted', date: '14/05/2026', items: [
        { name: 'Nước mắm Phú Quốc 500ml', unit: 'Chai', qty: 10, price: 45000, tax: 5 },
      ]},
      { id: '2025/00001230', customer: 'Công ty TNHH Thời trang Ivy Moda', mst: '0102345678', channel: 'Shopee', total: 890000, payment: 'paid', cqt: 'rejected', date: '13/05/2026', items: [
        { name: 'Áo sơ mi nữ trắng', unit: 'Cái', qty: 2, price: 350000, tax: 10 },
        { name: 'Quần jean nam slim', unit: 'Cái', qty: 1, price: 450000, tax: 10 },
      ]},
      { id: '2025/00001229', customer: 'Công ty CP FPT Digital Retail', mst: '0106284650', channel: 'Web', total: 5200000, payment: 'paid', cqt: 'accepted', date: '13/05/2026', items: [
        { name: 'iPhone 15 Pro Max 256GB', unit: 'Cái', qty: 1, price: 5200000, tax: 10 },
      ]},
      { id: '2025/00001228', customer: 'Khách lẻ', mst: '', channel: 'POS', total: 120000, payment: 'paid', cqt: 'pending', date: '13/05/2026', items: [
        { name: 'Trà sữa trân châu', unit: 'Ly', qty: 4, price: 30000, tax: 10 },
      ]},
      { id: '2025/00001227', customer: 'Công ty TNHH Thế giới Di động', mst: '0309538432', channel: 'Web', total: 18900000, payment: 'pending', cqt: 'accepted', date: '12/05/2026', items: [
        { name: 'MacBook Pro M3 14"', unit: 'Cái', qty: 2, price: 42000000, tax: 10 },
      ]},
      { id: '2025/00001226', customer: 'Hộ kinh doanh Lê Thị Mai', mst: '5432109876', channel: 'POS', total: 350000, payment: 'paid', cqt: 'accepted', date: '12/05/2026', items: [
        { name: 'Bánh tráng trộn', unit: 'Gói', qty: 50, price: 7000, tax: 0 },
      ]},
      { id: '2025/00001225', customer: 'CTCP Sách Việt Nam (FAHASA)', mst: '0301312749', channel: 'Lazada', total: 760000, payment: 'unpaid', cqt: 'rejected', date: '12/05/2026', items: [
        { name: 'Sách Giáo Khoa Toán Lớp 12', unit: 'Cuốn', qty: 20, price: 38000, tax: 5 },
      ]},
      { id: '2025/00001224', customer: 'Công ty TNHH Grab Việt Nam', mst: '0312398745', channel: 'Web', total: 2450000, payment: 'pending', cqt: 'pending', date: '11/05/2026', items: [
        { name: 'Phí dịch vụ Grab 04/2026', unit: 'Tháng', qty: 1, price: 2450000, tax: 10 },
      ]},
      { id: '2025/00001223', customer: 'Khách lẻ', mst: '', channel: 'POS', total: 65000, payment: 'paid', cqt: 'accepted', date: '11/05/2026', items: [
        { name: 'Cà phê đen', unit: 'Ly', qty: 1, price: 25000, tax: 10 },
        { name: 'Bánh croissant', unit: 'Cái', qty: 1, price: 35000, tax: 10 },
      ]},
      { id: '2025/00001222', customer: 'CTCP Vingroup (VinMart)', mst: '0100126948', channel: 'Web', total: 9800000, payment: 'paid', cqt: 'accepted', date: '10/05/2026', items: [
        { name: 'Thực phẩm tươi sống tháng 05', unit: 'Lô', qty: 1, price: 9800000, tax: 5 },
      ]},
      { id: '2025/00001221', customer: 'Hộ kinh doanh Trần Văn Bình', mst: '1234567890', channel: 'Shopee', total: 540000, payment: 'paid', cqt: 'pending', date: '10/05/2026', items: [
        { name: 'Ốp điện thoại iPhone 15', unit: 'Cái', qty: 20, price: 27000, tax: 10 },
      ]},
      { id: '2025/00001220', customer: 'Công ty TNHH Samsung Electronics Việt Nam', mst: '0101234567', channel: 'Web', total: 32000000, payment: 'pending', cqt: 'accepted', date: '10/05/2026', items: [
        { name: 'Samsung Galaxy S24 Ultra', unit: 'Cái', qty: 5, price: 6400000, tax: 10 },
      ]},
    ],
    getInvoiceById(id) { return this.invoices.find(inv => inv.id === id) || null; },
    getInvoicesByStatus(status) {
      if (!status || status === 'all') return this.invoices;
      return this.invoices.filter(inv => inv.cqt === status || inv.payment === status);
    },
    searchInvoices(query) {
      if (!query) return this.invoices;
      const q = query.toLowerCase();
      return this.invoices.filter(inv =>
        inv.id.includes(q) || inv.customer.toLowerCase().includes(q) || inv.mst.includes(q)
      );
    },
    paymentMap: {
      paid:    { label: 'Đã thanh toán',    cls: 'hv-badge-success' },
      pending: { label: 'Chờ xử lý',        cls: 'hv-badge-warning' },
      unpaid:  { label: 'Chưa thanh toán',  cls: 'hv-badge-danger'  }
    },
    cqtMap: {
      accepted: { label: 'Chấp nhận',     cls: 'hv-badge-success' },
      pending:  { label: 'Đang chờ',      cls: 'hv-badge-warning' },
      rejected: { label: 'Bị từ chối',     cls: 'hv-badge-danger'  }
    },
    channelMap: {
      POS: { cls: 'channel-pos' }, Web: { cls: 'channel-web' },
      Shopee: { cls: 'channel-shopee' }, Lazada: { cls: 'channel-lazada' },
      Marketplace: { cls: 'channel-marketplace' }
    }
  },

  /* ============================================
     SIDEBAR RENDERER
     ============================================ */
  renderSidebar() {
    const currentId = this.page.id;

    let html = `
      <a class="hv-sidebar-logo" href="dashboard.html">
        <div class="logo-mark"><i class="ti ti-receipt-2"></i></div>
        <span class="logo-text">haravan<span class="logo-dot"></span></span>
      </a>

      <div class="hv-sidebar-search">
        <div class="hv-sidebar-search-wrap">
          <i class="ti ti-search search-icon"></i>
          <input type="text" id="hv-global-search" placeholder="Tìm kiếm" aria-label="Tìm kiếm" />
          <span class="search-shortcut">⌘K</span>
        </div>
      </div>

      <div class="hv-sidebar-body">
    `;

    // Main section
    this.nav.main.forEach(item => {
      const isActive = item.id === currentId;
      const hasActiveChild = item.children && item.children.some(c => c.id === currentId);
      const parentClass = [
        'hv-sidebar-item',
        isActive ? 'hv-sidebar-item-active' : '',
        hasActiveChild ? 'has-active-child' : ''
      ].filter(Boolean).join(' ');
      const countHtml = item.count ? `<span class="count">${item.count}</span>` : '';

      html += `<a href="${item.href}" class="${parentClass}" aria-label="${item.label}">
        <i class="${item.icon}"></i>
        <span class="label">${item.label}</span>
        ${countHtml}
      </a>`;

      // Render children if any (only when parent matches or any child matches)
      if (item.children && (isActive || hasActiveChild)) {
        html += `<div class="hv-sidebar-subitems">`;
        item.children.forEach(child => {
          const childActive = child.id === currentId;
          html += `<a href="${child.href}" class="hv-sidebar-subitem ${childActive ? 'active' : ''}">`;
          if (child.icon) {
            html += `<i class="${child.icon}" style="margin-right: 12px; font-size: 16px; width: 16px; text-align: center;"></i>`;
          }
          html += `${child.label}</a>`;
        });
        html += `</div>`;
      }
    });

    // Config section
    html += `
      <div class="hv-sidebar-section">
        <div class="hv-sidebar-section-title">
          <span>${this.nav.configTitle}</span>
          <i class="ti ti-chevron-down"></i>
        </div>
    `;
    this.nav.config.forEach(item => {
      const isActive = item.id === currentId;
      const activeClass = isActive ? ' hv-sidebar-item-active' : '';
      html += `<a href="${item.href}" class="hv-sidebar-item${activeClass}" aria-label="${item.label}">
        <i class="${item.icon}"></i>
        <span class="label">${item.label}</span>
      </a>`;
    });
    html += `</div>`;

    html += `</div>`; // close .hv-sidebar-body

    // Footer (settings)
    html += `
      <div class="hv-sidebar-footer">
        <a href="#" class="hv-sidebar-item" aria-label="Cấu hình">
          <i class="ti ti-settings"></i>
          <span class="label">Cấu hình</span>
        </a>
      </div>
    `;

    return html;
  },

  /* ============================================
     TOPBAR RENDERER
     ============================================ */
  renderTopbar() {
    const title = this.page.title || '';
    const crumbs = this.page.breadcrumb || this._defaultBreadcrumb();

    let crumbHtml = '<nav class="hv-breadcrumb" aria-label="Breadcrumb">';
    crumbs.forEach((c, i) => {
      const isLast = i === crumbs.length - 1;
      if (i > 0) crumbHtml += `<i class="ti ti-chevron-right crumb-sep" aria-hidden="true"></i>`;
      if (isLast) {
        crumbHtml += `<span class="crumb-current">${c.label}</span>`;
      } else {
        crumbHtml += `<a href="${c.href || '#'}" class="${i < crumbs.length - 2 ? 'crumb-hide-sm' : ''}">${c.label}</a>`;
      }
    });
    if (!crumbs.length && title) {
      crumbHtml += `<span class="crumb-current">${title}</span>`;
    }
    crumbHtml += '</nav>';

    return `
      <div class="hv-topbar-left">
        <button class="hv-sidebar-toggle" aria-label="Mở menu">
          <i class="ti ti-menu-2"></i>
        </button>
        <div class="hv-workspace-pill" title="Cà phê Trung Nguyên Legend">
          <span class="hv-workspace-avatar">HL</span>
          <span style="max-width:160px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">Trung Nguyen Legend</span>
          <span class="hv-workspace-mst">0312345678</span>
          <i class="ti ti-chevron-down" style="font-size:12px;color:var(--hv-text-muted)"></i>
        </div>
        ${crumbHtml}
      </div>
      <div class="hv-topbar-right">
        <button class="hv-topbar-iconbtn hide-sm" aria-label="Đồng bộ" title="Đồng bộ">
          <i class="ti ti-refresh"></i>
        </button>
        <button class="hv-topbar-iconbtn hide-sm" aria-label="Trợ giúp" title="Trợ giúp">
          <i class="ti ti-help-circle"></i>
        </button>
        <button class="hv-topbar-iconbtn" id="hv-notif-btn" aria-label="Thông báo" title="Thông báo">
          <i class="ti ti-bell"></i>
          <span class="notif-dot">8</span>
        </button>
        <button class="hv-topbar-user" aria-label="Tài khoản">
          <span class="user-name">Demo Haravan</span>
          <span class="user-avatar">TL</span>
        </button>
      </div>
    `;
  },

  _defaultBreadcrumb() {
    // Try to infer from nav: find item with matching id or whose children include id
    const id = this.page.id;
    for (const item of this.nav.main) {
      if (item.id === id) return [{ label: item.label }];
      if (item.children) {
        const child = item.children.find(c => c.id === id);
        if (child) {
          return [{ label: item.label, href: item.href }, { label: this.page.title || child.label }];
        }
      }
    }
    for (const ch of this.nav.channels) {
      if (ch.id === id) return [{ label: ch.label }];
    }
    return this.page.title ? [{ label: this.page.title }] : [];
  },

  /* ============================================
     TOAST
     ============================================ */
  _toastContainer: null,
  _ensureToastContainer() {
    if (!this._toastContainer) {
      this._toastContainer = document.createElement('div');
      this._toastContainer.style.cssText = 'position:fixed;top:70px;right:16px;z-index:2000;display:flex;flex-direction:column;gap:8px;pointer-events:none';
      document.body.appendChild(this._toastContainer);
    }
    return this._toastContainer;
  },
  toast(message, type = 'info', duration = 3500) {
    const container = this._ensureToastContainer();
    const colors = {
      success: { border: 'var(--hv-success)', icon: 'ti ti-circle-check-filled', iconColor: 'var(--hv-success)' },
      warning: { border: 'var(--hv-warning)', icon: 'ti ti-alert-triangle-filled', iconColor: 'var(--hv-warning)' },
      danger:  { border: 'var(--hv-danger)',  icon: 'ti ti-circle-x-filled',     iconColor: 'var(--hv-danger)'  },
      info:    { border: 'var(--hv-primary)', icon: 'ti ti-info-circle-filled',  iconColor: 'var(--hv-primary)' },
    };
    const c = colors[type] || colors.info;
    const el = document.createElement('div');
    el.style.cssText = `display:flex;align-items:center;gap:10px;padding:12px 16px;background:var(--hv-bg-surface);border:1px solid var(--hv-border);border-left:4px solid ${c.border};border-radius:var(--hv-radius-lg);box-shadow:var(--hv-shadow-md);font-size:14px;font-family:var(--hv-font-sans);pointer-events:auto;animation:hv-toast-in 200ms ease;max-width:400px`;
    el.innerHTML = `<i class="${c.icon}" style="font-size:18px;color:${c.iconColor};flex-shrink:0"></i><span>${message}</span>`;
    container.appendChild(el);
    setTimeout(() => {
      el.style.animation = 'hv-toast-out 200ms ease forwards';
      setTimeout(() => el.remove(), 200);
    }, duration);
  },

  /* ============================================
     MODAL
     ============================================ */
  modal(options = {}) {
    const { title = '', body = '', actions = [], size = 'md', onClose = null } = options;
    const sizes = { sm: '420px', md: '560px', lg: '800px' };
    const maxWidth = sizes[size] || sizes.md;
    const backdrop = document.createElement('div');
    backdrop.className = 'hv-backdrop';
    backdrop.style.cssText = 'animation:hv-fade-in 150ms ease';

    const actionHtml = actions.map(a => {
      const cls = a.danger ? 'hv-btn hv-btn-danger' : a.primary ? 'hv-btn hv-btn-primary' : 'hv-btn hv-btn-secondary';
      return `<button class="${cls}" data-action="${a.id || ''}">${a.icon ? `<i class="${a.icon}"></i> ` : ''}${a.label}</button>`;
    }).join('');

    backdrop.innerHTML = `
      <div class="hv-modal" style="max-width:${maxWidth}">
        ${title ? `<h2 class="text-h2" style="margin-bottom:12px">${title}</h2>` : ''}
        <div class="hv-modal-body" style="color:var(--hv-text-secondary)">${body}</div>
        ${actionHtml ? `<div class="hv-flex hv-gap-2" style="justify-content:flex-end;margin-top:20px">${actionHtml}</div>` : ''}
      </div>
    `;
    document.body.appendChild(backdrop);
    backdrop.addEventListener('click', (e) => { if (e.target === backdrop) this.closeModal(backdrop, onClose); });
    const escHandler = (e) => {
      if (e.key === 'Escape') { this.closeModal(backdrop, onClose); document.removeEventListener('keydown', escHandler); }
    };
    document.addEventListener('keydown', escHandler);
    backdrop.querySelectorAll('[data-action]').forEach(btn => {
      btn.addEventListener('click', () => {
        const actionId = btn.dataset.action;
        const action = actions.find(a => a.id === actionId);
        if (action && action.onClick) action.onClick(backdrop);
      });
    });
    return backdrop;
  },
  closeModal(backdrop, onClose) {
    if (!backdrop) return;
    backdrop.style.animation = 'hv-fade-out 150ms ease forwards';
    setTimeout(() => { backdrop.remove(); if (onClose) onClose(); }, 150);
  },
  confirm(message, options = {}) {
    return new Promise((resolve) => {
      const { title = 'Xác nhận', confirmLabel = 'Xác nhận', cancelLabel = 'Hủy', type = 'warning' } = options;
      const icons = { warning: 'ti ti-alert-triangle', danger: 'ti ti-trash', info: 'ti ti-info-circle' };
      const iconColors = { warning: 'var(--hv-warning)', danger: 'var(--hv-danger)', info: 'var(--hv-primary)' };
      const bgColors = { warning: 'var(--hv-warning-soft)', danger: 'var(--hv-danger-soft)', info: 'var(--hv-primary-soft)' };
      this.modal({
        title: '',
        body: `
          <div style="text-align:center">
            <div style="width:56px;height:56px;border-radius:50%;background:${bgColors[type]};display:inline-flex;align-items:center;justify-content:center;margin-bottom:12px">
              <i class="${icons[type]}" style="font-size:24px;color:${iconColors[type]}"></i>
            </div>
            <h2 class="text-h2" style="margin-bottom:6px">${title}</h2>
            <p style="color:var(--hv-text-secondary)">${message}</p>
          </div>
        `,
        actions: [
          { id: 'cancel',  label: cancelLabel, onClick: (bd) => { this.closeModal(bd); resolve(false); } },
          { id: 'confirm', label: confirmLabel, primary: type !== 'danger', danger: type === 'danger', onClick: (bd) => { this.closeModal(bd); resolve(true); } },
        ],
        size: 'sm',
      });
    });
  },

  /* ============================================
     UTILITIES
     ============================================ */
  initSearchFilter(inputSelector, tableSelector, columnIndices) {
    const input = typeof inputSelector === 'string' ? document.querySelector(inputSelector) : inputSelector;
    const table = typeof tableSelector === 'string' ? document.querySelector(tableSelector) : tableSelector;
    if (!input || !table) return;
    input.addEventListener('input', () => {
      const query = input.value.toLowerCase().trim();
      const rows = table.querySelectorAll('tbody tr');
      rows.forEach(row => {
        const cells = Array.from(row.cells);
        const match = columnIndices.some(idx => {
          const cell = cells[idx];
          return cell && cell.textContent.toLowerCase().includes(query);
        });
        row.style.display = match ? '' : 'none';
      });
    });
  },
  navigate(url, params = {}) {
    const u = new URL(url, window.location.href);
    Object.entries(params).forEach(([k, v]) => { if (v !== undefined && v !== null) u.searchParams.set(k, v); });
    window.location.href = u.toString();
  },
  getUrlParam(key) { return new URLSearchParams(window.location.search).get(key); },
  showLoading(el) {
    if (typeof el === 'string') el = document.querySelector(el);
    if (!el) return;
    el._originalContent = el.innerHTML;
    el.innerHTML = `<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;padding:48px;color:var(--hv-text-muted)">
      <div style="width:36px;height:36px;border:3px solid var(--hv-border);border-top-color:var(--hv-primary);border-radius:50%;animation:hv-spin 800ms linear infinite;margin-bottom:16px"></div>
      <span style="font-size:14px">Đang tải...</span>
    </div>`;
  },
  hideLoading(el) {
    if (typeof el === 'string') el = document.querySelector(el);
    if (!el || !el._originalContent) return;
    el.innerHTML = el._originalContent;
    delete el._originalContent;
  },
  markError(input, message) {
    input.classList.add('has-error');
    let hint = input.parentElement.querySelector('.hv-field-error');
    if (!hint) {
      hint = document.createElement('div');
      hint.className = 'hv-field-error hv-error-text';
      input.parentElement.appendChild(hint);
    }
    hint.innerHTML = `<i class="ti ti-alert-circle" style="font-size:14px"></i> ${message}`;
  },
  clearError(input) {
    input.classList.remove('has-error');
    const hint = input.parentElement.querySelector('.hv-field-error');
    if (hint) hint.remove();
  },
  formatVND(n) { return new Intl.NumberFormat('vi-VN').format(n) + 'đ'; },
  formatDate(d) { return new Date(d).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }); },
  formatDateTime(d) { return new Date(d).toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }); },
  btnLoading(btn, loading = true) {
    if (typeof btn === 'string') btn = document.querySelector(btn);
    if (!btn) return;
    if (loading) {
      btn._originalHtml = btn.innerHTML;
      btn.disabled = true;
      btn.style.opacity = '0.7';
      btn.innerHTML = `<div style="width:16px;height:16px;border:2px solid currentColor;border-top-color:transparent;border-radius:50%;animation:hv-spin 800ms linear infinite"></div> Đang xử lý...`;
    } else {
      btn.disabled = false;
      btn.style.opacity = '';
      if (btn._originalHtml) btn.innerHTML = btn._originalHtml;
    }
  },

  /* ============================================
     INIT
     ============================================ */
  init() {
    const sidebar = document.querySelector('.hv-sidebar');
    if (sidebar && !sidebar.dataset.hvRendered) {
      sidebar.innerHTML = this.renderSidebar();
      sidebar.dataset.hvRendered = '1';
    }

    const topbar = document.querySelector('.hv-topbar');
    if (topbar && !topbar.dataset.hvRendered) {
      topbar.innerHTML = this.renderTopbar();
      topbar.dataset.hvRendered = '1';
    }

    // Mobile sidebar toggle with backdrop
    const toggle = document.querySelector('.hv-sidebar-toggle');
    const sidebarEl = document.querySelector('.hv-sidebar');
    if (toggle && sidebarEl) {
      let backdrop = document.querySelector('.hv-sidebar-backdrop');
      if (!backdrop) {
        backdrop = document.createElement('div');
        backdrop.className = 'hv-sidebar-backdrop';
        document.body.appendChild(backdrop);
      }
      const openSidebar = () => {
        sidebarEl.classList.add('hv-sidebar-open');
        backdrop.classList.add('hv-sidebar-backdrop-open');
      };
      const closeSidebar = () => {
        sidebarEl.classList.remove('hv-sidebar-open');
        backdrop.classList.remove('hv-sidebar-backdrop-open');
      };
      toggle.addEventListener('click', (e) => {
        e.stopPropagation();
        sidebarEl.classList.contains('hv-sidebar-open') ? closeSidebar() : openSidebar();
      });
      backdrop.addEventListener('click', closeSidebar);
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && sidebarEl.classList.contains('hv-sidebar-open')) closeSidebar();
      });
      // Close on nav click (mobile)
      sidebarEl.querySelectorAll('a.hv-sidebar-item, a.hv-sidebar-subitem').forEach(a => {
        a.addEventListener('click', () => {
          if (window.matchMedia('(max-width: 1023px)').matches) closeSidebar();
        });
      });
    }

    // Global search → invoice list
    const globalSearch = document.getElementById('hv-global-search');
    if (globalSearch) {
      globalSearch.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && globalSearch.value.trim()) {
          this.navigate('invoice-list.html', { q: globalSearch.value.trim() });
        }
      });
      // ⌘K focus shortcut
      document.addEventListener('keydown', (e) => {
        if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
          e.preventDefault();
          globalSearch.focus();
          globalSearch.select();
        }
      });
    }

    // Notification bell
    const notifBtn = document.getElementById('hv-notif-btn');
    if (notifBtn) {
      notifBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleNotifPopover(notifBtn);
      });
    }

    // Close notification popover on outside click
    document.addEventListener('click', (e) => {
      const popover = document.querySelector('.hv-notif-popover');
      if (popover && !popover.contains(e.target) && !e.target.closest('#hv-notif-btn')) {
        popover.remove();
      }
    });

    this._injectAnimations();
    this.initStateToggle();
  },

  /* ============================================
     NOTIFICATION POPOVER
     ============================================ */
  toggleNotifPopover(anchor) {
    const existing = document.querySelector('.hv-notif-popover');
    if (existing) { existing.remove(); return; }

    const popover = document.createElement('div');
    popover.className = 'hv-notif-popover';
    popover.innerHTML = `
      <div class="hv-notif-header">
        <h3>Thông báo <span style="color:var(--hv-text-muted);font-weight:400;font-size:13px">(8 chưa đọc)</span></h3>
        <button class="hv-btn-link" style="font-size:12px" onclick="this.closest('.hv-notif-popover').remove()">Đánh dấu đã đọc</button>
      </div>
      <div class="hv-notif-tabs">
        <button class="hv-notif-tab hv-notif-tab-active">Tất cả 47</button>
        <button class="hv-notif-tab">Chưa đọc 8</button>
        <button class="hv-notif-tab">Tuân thủ 3</button>
        <button class="hv-notif-tab">Tác vụ 5</button>
      </div>
      <div class="hv-notif-list">
        ${this._renderNotifItems()}
      </div>
      <div class="hv-notif-footer">
        <a href="notification-center.html" class="hv-btn-link" style="font-size:13px">Xem tất cả thông báo</a>
      </div>
    `;

    anchor.parentElement.style.position = 'relative';
    anchor.parentElement.appendChild(popover);

    // Tab switching
    popover.querySelectorAll('.hv-notif-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        popover.querySelectorAll('.hv-notif-tab').forEach(t => t.classList.remove('hv-notif-tab-active'));
        tab.classList.add('hv-notif-tab-active');
      });
    });
  },

  _renderNotifItems() {
    const notifs = [
      { icon: 'ti ti-alert-triangle', iconBg: 'var(--hv-warning-soft)', iconColor: 'var(--hv-warning)', title: 'NĐ 70/2025 + TT 32/2025 có hiệu lực', desc: 'Từ 01/06/2025: Bỏ thủ tục hủy hóa đơn, chỉ điều chỉnh/thay thế', time: '2 giờ trước', unread: true, type: 'regulation' },
      { icon: 'ti ti-circle-x', iconBg: 'var(--hv-danger-soft)', iconColor: 'var(--hv-danger)', title: 'CQT từ chối HD-2026-0130', desc: 'Lý do: MST người mua không hợp lệ. Mở wizard xử lý.', time: '3 giờ trước', unread: true, type: 'cqt' },
      { icon: 'ti ti-circle-check', iconBg: 'var(--hv-success-soft)', iconColor: 'var(--hv-success)', title: 'Batch phát hành thành công', desc: '28/30 hóa đơn đã phát hành. 2 lỗi cần xử lý.', time: '5 giờ trước', unread: true, type: 'job' },
      { icon: 'ti ti-user-check', iconBg: 'var(--hv-primary-soft)', iconColor: 'var(--hv-primary)', title: 'Khách hàng mới cập nhật MST', desc: 'Công ty TNHH ABC (0312345678) đã xác thực MST qua CQT', time: 'Hôm qua', unread: true, type: 'customer' },
      { icon: 'ti ti-shield-alert', iconBg: 'var(--hv-danger-soft)', iconColor: 'var(--hv-danger)', title: 'Cảnh báo rủi ro NCC', desc: 'FPT Digital Retail có dấu hiệu rủi ro thuế (AI score: 0.72)', time: 'Hôm qua', unread: true, type: 'risk' },
      { icon: 'ti ti-certificate', iconBg: 'var(--hv-warning-soft)', iconColor: 'var(--hv-warning)', title: 'Chứng thư số sắp hết hạn', desc: 'VTC-Sign CTS-2025-AB12CD hết hạn sau 63 ngày (18/07/2026)', time: '2 ngày trước', unread: true, type: 'settings' },
      { icon: 'ti ti-credit-card', iconBg: 'var(--hv-info-soft)', iconColor: 'var(--hv-info)', title: 'Gói Pro sắp hết hạn', desc: 'Còn 8.234 HD trong tháng. Nâng cấp để tiếp tục sử dụng.', time: '3 ngày trước', unread: true, type: 'plan' },
      { icon: 'ti ti-key', iconBg: 'var(--hv-purple-soft)', iconColor: 'var(--hv-purple)', title: 'Đăng nhập từ thiết bị mới', desc: 'Chrome trên macOS — TP.HCM. Nếu không phải bạn, đổi mật khẩu.', time: '3 ngày trước', unread: true, type: 'security' },
    ];

    return notifs.map(n => `
      <div class="hv-notif-item ${n.unread ? 'unread' : ''}">
        <div class="hv-notif-icon" style="background:${n.iconBg};color:${n.iconColor}">
          <i class="${n.icon}"></i>
        </div>
        <div class="hv-notif-body">
          <div class="hv-notif-title">${n.title}</div>
          <div class="hv-notif-desc">${n.desc}</div>
          <div class="hv-notif-time">${n.time}</div>
        </div>
      </div>
    `).join('');
  },

  /* ============================================
     DRAWER DETAIL
     ============================================ */
  openDrawer(options = {}) {
    const { title = '', tabs = [], sections = [], footer = '' } = options;
    const existing = document.querySelector('.hv-drawer');
    if (existing) existing.remove();

    const drawer = document.createElement('div');
    drawer.className = 'hv-drawer';
    drawer.style.cssText = 'animation:hv-fade-in 150ms ease;display:flex;flex-direction:column';

    const tabHtml = tabs.map((t, i) =>
      `<button class="hv-drawer-tab ${i === 0 ? 'hv-drawer-tab-active' : ''}" data-tab="${t.id}">${t.label}</button>`
    ).join('');

    const sectionHtml = sections.map(s =>
      `<div class="hv-drawer-section" data-section="${s.tab || ''}">
        <div class="hv-drawer-section-title">${s.title}</div>
        ${s.rows.map(r => `<div class="hv-drawer-row"><span class="hv-drawer-label">${r.label}</span><span class="hv-drawer-value ${r.mono ? 'hv-mono' : ''}">${r.value}</span></div>`).join('')}
      </div>`
    ).join('');

    drawer.innerHTML = `
      <div class="hv-drawer-header">
        <div>
          <h3 class="text-h3">${title}</h3>
        </div>
        <button class="hv-topbar-iconbtn" onclick="HV.closeDrawer()" aria-label="Đóng">
          <i class="ti ti-x"></i>
        </button>
      </div>
      ${tabs.length ? `<div class="hv-drawer-tabs">${tabHtml}</div>` : ''}
      <div style="flex:1;overflow-y:auto">${sectionHtml}</div>
      ${footer ? `<div class="hv-drawer-footer">${footer}</div>` : ''}
    `;

    document.body.appendChild(drawer);

    // Backdrop
    const backdrop = document.createElement('div');
    backdrop.className = 'hv-sidebar-backdrop hv-sidebar-backdrop-open';
    backdrop.style.zIndex = '1000';
    backdrop.addEventListener('click', () => this.closeDrawer());
    document.body.appendChild(backdrop);

    // Tab switching
    drawer.querySelectorAll('.hv-drawer-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        drawer.querySelectorAll('.hv-drawer-tab').forEach(t => t.classList.remove('hv-drawer-tab-active'));
        tab.classList.add('hv-drawer-tab-active');
      });
    });
  },

  closeDrawer() {
    const drawer = document.querySelector('.hv-drawer');
    const backdrop = document.querySelector('.hv-drawer ~ .hv-sidebar-backdrop, .hv-sidebar-backdrop[style*="1000"]');
    if (drawer) drawer.remove();
    if (backdrop) backdrop.remove();
  },

  /* ============================================
     TAB SWITCHING UTILITY
     ============================================ */
  initTabs(containerSelector) {
    const container = typeof containerSelector === 'string' ? document.querySelector(containerSelector) : containerSelector;
    if (!container) return;
    const tabs = container.querySelectorAll('.hv-tab');
    const panels = container.querySelectorAll('.hv-tab-panel');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('hv-tab-active'));
        tab.classList.add('hv-tab-active');
        const target = tab.dataset.tab;
        panels.forEach(p => {
          p.style.display = p.dataset.panel === target ? '' : 'none';
        });
      });
    });
  },

  _injectAnimations() {
    if (document.getElementById('hv-anim-styles')) return;
    const style = document.createElement('style');
    style.id = 'hv-anim-styles';
    style.textContent = `
      @keyframes hv-toast-in { from { opacity:0; transform:translateY(-8px); } to { opacity:1; transform:translateY(0); } }
      @keyframes hv-toast-out { from { opacity:1; transform:translateY(0); } to { opacity:0; transform:translateY(-8px); } }
      @keyframes hv-fade-in { from { opacity:0; } to { opacity:1; } }
      @keyframes hv-fade-out { from { opacity:1; } to { opacity:0; } }
      @keyframes hv-spin { to { transform:rotate(360deg); } }
    `;
    document.head.appendChild(style);
  },

  initStateToggle() {
    // Only inject if page declares state hooks
    const hasStates = document.querySelector('.hv-state-default, .hv-state-empty, .hv-state-loading, .hv-state-error');
    if (!hasStates) return;
    const states = ['default', 'empty', 'loading', 'error'];
    const params = new URLSearchParams(window.location.search);
    const currentState = params.get('state') || 'default';
    const toggle = document.createElement('div');
    toggle.className = 'hv-state-tog';
    toggle.style.cssText = 'position:fixed;bottom:16px;right:16px;z-index:1500;display:flex;gap:2px;background:var(--hv-bg-surface);border:1px solid var(--hv-border);border-radius:var(--hv-radius-lg);padding:4px;box-shadow:var(--hv-shadow-md);font-size:11px';
    states.forEach(s => {
      const btn = document.createElement('button');
      btn.textContent = s;
      btn.style.cssText = `padding:4px 10px;font-size:11px;font-weight:500;border-radius:6px;border:none;cursor:pointer;font-family:inherit;${s === currentState ? 'background:var(--hv-primary);color:white' : 'background:transparent;color:var(--hv-text-secondary)'}`;
      btn.addEventListener('click', () => {
        const url = new URL(window.location);
        if (s === 'default') url.searchParams.delete('state');
        else url.searchParams.set('state', s);
        window.location = url;
      });
      toggle.appendChild(btn);
    });
    document.body.appendChild(toggle);
    // Apply state visibility
    document.querySelectorAll('[class*="hv-state-"]').forEach(el => {
      const stateMatch = el.className.match(/hv-state-(default|empty|loading|error)/);
      if (stateMatch) {
        el.style.display = stateMatch[1] === currentState ? '' : 'none';
      }
    });
  }
};

document.addEventListener('DOMContentLoaded', () => HV.init());
