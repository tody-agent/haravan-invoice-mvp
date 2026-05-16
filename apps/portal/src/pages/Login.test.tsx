import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from './Login';

describe('Login', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renders login form', () => {
    render(<BrowserRouter><Login /></BrowserRouter>);
    expect(screen.getByPlaceholderText(/Nhập tên đăng nhập/i)).toBeTruthy();
    expect(screen.getByPlaceholderText(/Nhập mật khẩu/i)).toBeTruthy();
    expect(screen.getByRole('button', { name: /Đăng nhập/i })).toBeTruthy();
  });

  it('renders Haravan Invoice title', () => {
    render(<BrowserRouter><Login /></BrowserRouter>);
    expect(screen.getByText('Haravan Invoice')).toBeTruthy();
  });
});
