export const testFixtures = {
  buyer: {
    name: 'Công ty TNHH Test',
    mst: '0123456789',
    address: '123 Đường Test, Quận 1, TP.HCM',
    email: 'test@example.com',
    phone: '0901234567',
  },

  items: [
    {
      name: 'Sản phẩm A',
      sku: 'SP001',
      quantity: 10,
      unitPrice: 100000,
      taxRate: 0.1,
      total: 1100000,
    },
    {
      name: 'Sản phẩm B',
      sku: 'SP002',
      quantity: 5,
      unitPrice: 200000,
      taxRate: 0.08,
      total: 1080000,
    },
  ],

  invoice: {
    buyer: {
      name: 'Công ty TNHH Test',
      mst: '0123456789',
    },
    items: [
      {
        name: 'Sản phẩm A',
        sku: 'SP001',
        quantity: 10,
        unitPrice: 100000,
        taxRate: 0.1,
        total: 1100000,
      },
    ],
  },

  customer: {
    name: 'Khách hàng Test',
    mst: '0123456789',
    email: 'customer@example.com',
    phone: '0901234567',
    address: '456 Đường Test, Quận 2, TP.HCM',
  },

  config: {
    companyName: 'Công ty TNHH Test',
    companyMst: '0123456789',
    companyAddress: '123 Đường Test, Quận 1, TP.HCM',
    companyPhone: '0901234567',
    companyEmail: 'test@example.com',
    invoicePrefix: 'INV',
    invoiceSuffix: '2026',
  },

  template: {
    name: 'Mẫu hóa đơn test',
    type: 'standard',
    headerColor: '#1a73e8',
    footerText: 'Cảm ơn quý khách!',
  },

  automation: {
    name: 'Auto send email',
    trigger: 'on_issue',
    action: 'send_email',
    enabled: true,
  },
};

export const invalidMst = '12345';
export const validMst = '0123456789';
