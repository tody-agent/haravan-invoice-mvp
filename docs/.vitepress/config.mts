import { defineConfig } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'

export default withMermaid(defineConfig({
  title: 'Haravan Invoice',
  description: 'Tài liệu hướng dẫn hệ thống quản lý hóa đơn điện tử Haravan Invoice MVP',
  srcDir: '../docs',
  outDir: '../docs-site',
  lastUpdated: true,
  cleanUrls: true,

  head: [
    ['meta', { name: 'robots', content: 'index, follow' }],
    ['meta', { name: 'viewport', content: 'width=device-width, initial-scale=1' }],
    ['link', { rel: 'icon', href: '/favicon.ico' }],
  ],

  themeConfig: {
    siteTitle: 'Haravan Invoice',
    logo: { text: '🧾 Haravan Invoice' },

    nav: [
      { text: 'Trang chủ', link: '/' },
      { text: 'Kiến trúc', link: '/tech/architecture' },
      { text: 'Hướng dẫn', link: '/sop/getting-started' },
      { text: 'API', link: '/api/overview' },
    ],

    sidebar: {
      '/': [
        {
          text: 'Tổng quan',
          items: [
            { text: 'Giới thiệu', link: '/' },
            { text: 'Persona người dùng', link: '/knowledge/personas' },
            { text: 'Phân tích JTBD', link: '/knowledge/jtbd' },
          ],
        },
        {
          text: 'Kiến trúc kỹ thuật',
          items: [
            { text: 'Tổng quan kiến trúc', link: '/tech/architecture' },
            { text: 'Cơ sở dữ liệu', link: '/tech/database' },
            { text: 'Luồng dữ liệu', link: '/tech/data-flow' },
            { text: 'Triển khai', link: '/tech/deployment' },
          ],
        },
        {
          text: 'Hướng dẫn sử dụng',
          items: [
            { text: 'Bắt đầu nhanh', link: '/sop/getting-started' },
            { text: 'Đăng nhập', link: '/sop/login' },
            { text: 'Tổng quan Dashboard', link: '/sop/dashboard' },
            { text: 'Tạo hóa đơn', link: '/sop/create-invoice' },
            { text: 'Quản lý hóa đơn', link: '/sop/manage-invoices' },
            { text: 'Xử lý sai sót', link: '/sop/correct-invoice' },
            { text: 'Quản lý khách hàng', link: '/sop/customers' },
            { text: 'Quản lý sản phẩm', link: '/sop/products' },
            { text: 'Phân tích', link: '/sop/analytics' },
            { text: 'Báo cáo', link: '/sop/reports' },
            { text: 'Gộp hóa đơn cuối ngày', link: '/sop/daily-aggregate' },
            { text: 'Thông báo', link: '/sop/notifications' },
            { text: 'Compliance Center', link: '/sop/compliance' },
            { text: 'Cấu hình mẫu hóa đơn', link: '/sop/settings-templates' },
            { text: 'Cấu hình tự động hóa', link: '/sop/settings-automation' },
            { text: 'Gói dịch vụ', link: '/sop/settings-plan' },
          ],
        },
        {
          text: 'Tài liệu API',
          items: [
            { text: 'Tổng quan API', link: '/api/overview' },
            { text: 'Auth', link: '/api/auth' },
            { text: 'Invoices', link: '/api/invoices' },
            { text: 'Customers', link: '/api/customers' },
            { text: 'Products', link: '/api/products' },
            { text: 'Reports', link: '/api/reports' },
            { text: 'Analytics', link: '/api/analytics' },
            { text: 'Settings', link: '/api/settings' },
            { text: 'Notifications', link: '/api/notifications' },
            { text: 'Aggregate', link: '/api/aggregate' },
            { text: 'MST Lookup', link: '/api/mst-lookup' },
            { text: 'One-Click Issue', link: '/api/one-click' },
            { text: 'PDF', link: '/api/pdf' },
            { text: 'Health & Config', link: '/api/health-config' },
          ],
        },
      ],
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/haravan/invoice-mvp' },
    ],

    search: {
      provider: 'local',
    },

    footer: {
      message: 'Phát hành theo giấy phép MIT.',
      copyright: 'Copyright © 2026 Haravan',
    },
  },

  markdown: {
    theme: {
      light: 'github-light',
      dark: 'github-dark',
    },
  },

  ignoreDeadLinks: true,

  sitemap: {
    hostname: 'https://invoice.haravan.com',
  },
}))
