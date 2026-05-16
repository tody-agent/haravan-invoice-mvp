import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const DEMO_ACCOUNTS = [
  { username: 'fnb',         password: 'demo123', label: 'F&B - Chuỗi Coffee & Nhà hàng',  color: '#f59e0b', icon: '☕' },
  { username: 'fashion',     password: 'demo123', label: 'Thời trang E-commerce',          color: '#ec4899', icon: '👗' },
  { username: 'cosmetics',   password: 'demo123', label: 'Mỹ phẩm B2B + B2C',              color: '#8b5cf6', icon: '💄' },
  { username: 'livestream',  password: 'demo123', label: 'Livestream - Sản lượng lớn',     color: '#ef4444', icon: '📹' },
  { username: 'omnichannel', password: 'demo123', label: 'Đa kênh Đa sàn',                 color: '#06b6d4', icon: '🌐' },
  { username: 'retail',      password: 'demo123', label: 'Bán lẻ Chuỗi Mini Mart',         color: '#10b981', icon: '🏪' },
];

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${API_URL}/v1/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const json = await res.json();

      if (json.success) {
        localStorage.setItem('token', json.data.token);
        localStorage.setItem('user', JSON.stringify(json.data.user));
        navigate('/');
      } else {
        setError(json.message || 'Đăng nhập thất bại');
      }
    } catch {
      setError('Không thể kết nối server');
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = async (account: { username: string; password: string }) => {
    setUsername(account.username);
    setPassword(account.password);
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${API_URL}/v1/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(account),
      });
      const json = await res.json();

      if (json.success) {
        localStorage.setItem('token', json.data.token);
        localStorage.setItem('user', JSON.stringify(json.data.user));
        navigate('/');
      } else {
        setError(json.message || 'Đăng nhập thất bại');
      }
    } catch {
      setError('Không thể kết nối server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--hv-bg-app)',
      padding: 'var(--hv-space-4)',
    }}>
      <div style={{ width: '100%', maxWidth: 800 }}>
        <div className="hv-card" style={{ padding: 'var(--hv-space-5)', marginBottom: 'var(--hv-space-4)' }}>
          <div style={{ textAlign: 'center', marginBottom: 'var(--hv-space-5)' }}>
            <div style={{ marginBottom: 'var(--hv-space-3)' }}>
              <i className="ti ti-receipt-2" style={{ fontSize: 40, color: 'var(--hv-primary)' }}></i>
            </div>
            <h1 className="text-h2" style={{ color: 'var(--hv-text-primary)' }}>Haravan Invoice</h1>
            <p className="text-caption" style={{ marginTop: 'var(--hv-space-2)' }}>Đăng nhập để quản lý hóa đơn</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 'var(--hv-space-4)' }}>
              <label className="text-body-strong" style={{ display: 'block', marginBottom: 'var(--hv-space-1)' }}>
                Tên đăng nhập
              </label>
              <input
                type="text"
                className="hv-input"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="Nhập tên đăng nhập"
                required
                style={{ width: '100%' }}
              />
            </div>

            <div style={{ marginBottom: 'var(--hv-space-5)' }}>
              <label className="text-body-strong" style={{ display: 'block', marginBottom: 'var(--hv-space-1)' }}>
                Mật khẩu
              </label>
              <input
                type="password"
                className="hv-input"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Nhập mật khẩu"
                required
                style={{ width: '100%' }}
              />
            </div>

            {error && (
              <div className="hv-alert hv-alert-danger" style={{ marginBottom: 'var(--hv-space-4)' }}>
                <i className="ti ti-alert-circle" aria-hidden="true"></i>
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              className="hv-btn hv-btn-primary"
              disabled={loading}
              style={{ width: '100%', justifyContent: 'center' }}
            >
              {loading ? (
                <><i className="ti ti-loader-2" style={{ animation: 'spin 1s linear infinite' }}></i> Đang đăng nhập...</>
              ) : (
                <><i className="ti ti-login"></i> Đăng nhập</>
              )}
            </button>
          </form>
        </div>

        <div className="hv-card" style={{ padding: 'var(--hv-space-4)' }}>
          <h3 className="text-h3" style={{ marginBottom: 'var(--hv-space-3)', color: 'var(--hv-text-primary)' }}>
            <i className="ti ti-rocket" style={{ marginRight: 'var(--hv-space-2)' }}></i>
            Tài khoản Demo — Nhấn để đăng nhập nhanh
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: 'var(--hv-space-3)' }}>
            {DEMO_ACCOUNTS.map(account => (
              <button
                key={account.username}
                onClick={() => quickLogin(account)}
                disabled={loading}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--hv-space-3)',
                  padding: 'var(--hv-space-3)',
                  border: `1px solid var(--hv-border)`,
                  borderRadius: 'var(--hv-radius-md)',
                  background: 'var(--hv-surface)',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease',
                  opacity: loading ? 0.6 : 1,
                }}
                onMouseEnter={e => {
                  if (!loading) {
                    (e.currentTarget as HTMLButtonElement).style.borderColor = account.color;
                    (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 0 0 2px ${account.color}20`;
                  }
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--hv-border)';
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none';
                }}
              >
                <span style={{ fontSize: 24, width: 36, textAlign: 'center' }}>{account.icon}</span>
                <div>
                  <div className="text-body-strong" style={{ color: 'var(--hv-text-primary)' }}>{account.label}</div>
                  <div className="text-caption" style={{ color: 'var(--hv-text-muted)', fontFamily: 'var(--hv-font-mono)' }}>
                    {account.username} / {account.password}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
