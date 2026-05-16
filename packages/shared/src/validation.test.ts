import { describe, it, expect } from 'vitest';
import { validateMST, validateInvoice, validateTaxRate, amountToWords } from './validation';

describe('validateMST', () => {
  it('accepts valid 10-digit MST', () => {
    expect(validateMST('0123456789')).toBeNull();
  });

  it('accepts valid 13-digit MST', () => {
    expect(validateMST('0123456789012')).toBeNull();
  });

  it('rejects MST with wrong length', () => {
    expect(validateMST('12345')).not.toBeNull();
  });

  it('rejects MST with non-numeric chars', () => {
    expect(validateMST('012345678a')).not.toBeNull();
  });

  it('rejects empty MST', () => {
    expect(validateMST('')).not.toBeNull();
  });
});

describe('validateTaxRate', () => {
  it('accepts 0%', () => expect(validateTaxRate(0)).toBeNull());
  it('accepts 5%', () => expect(validateTaxRate(0.05)).toBeNull());
  it('accepts 8%', () => expect(validateTaxRate(0.08)).toBeNull());
  it('accepts 10%', () => expect(validateTaxRate(0.1)).toBeNull());
  it('rejects 15%', () => expect(validateTaxRate(0.15)).not.toBeNull());
  it('rejects negative', () => expect(validateTaxRate(-0.05)).not.toBeNull());
});

describe('amountToWords', () => {
  it('converts 0', () => expect(amountToWords(0)).toBe('Không đồng'));
  it('converts 1000', () => expect(amountToWords(1000)).toContain('một nghìn'));
  it('converts 1000000', () => expect(amountToWords(1000000)).toContain('một triệu'));
  it('converts 1500000', () => expect(amountToWords(1500000)).toContain('một triệu'));
});

describe('validateInvoice', () => {
  const validInvoice = {
    buyer: { name: 'Công ty ABC', mst: '0123456789' },
    seller: { name: 'Công ty XYZ', mst: '9876543210' },
    items: [{ name: 'Sản phẩm A', quantity: 1, unitPrice: 100000, taxRate: 0.1 as const, total: 110000 }],
    totals: { subtotal: 100000, taxAmount: 10000, discount: 0, total: 110000 },
  };

  it('accepts valid invoice', () => {
    expect(validateInvoice(validInvoice)).toEqual([]);
  });

  it('requires buyer name', () => {
    const inv = { ...validInvoice, buyer: { ...validInvoice.buyer, name: '' } };
    expect(validateInvoice(inv).length).toBeGreaterThan(0);
  });

  it('requires at least one item', () => {
    const inv = { ...validInvoice, items: [] };
    expect(validateInvoice(inv).length).toBeGreaterThan(0);
  });

  it('requires total > 0', () => {
    const inv = { ...validInvoice, totals: { ...validInvoice.totals, total: 0 } };
    expect(validateInvoice(inv).length).toBeGreaterThan(0);
  });
});
