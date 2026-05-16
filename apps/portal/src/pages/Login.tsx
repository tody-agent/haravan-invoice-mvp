import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || '/api';

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

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--hv-bg-app)',
    }}>
      <div className="hv-card" style={{ width: 400, padding: 'var(--hv-space-5)' }}>
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

        <p className="text-caption" style={{ textAlign: 'center', marginTop: 'var(--hv-space-4)' }}>
          Demo: nhập bất kỳ username/password
        </p>
      </div>
    </div>
  );
}
