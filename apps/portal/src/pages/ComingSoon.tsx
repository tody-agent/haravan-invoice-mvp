import { Link } from 'react-router-dom';

export default function ComingSoon({ title }: { title: string }) {
  return (
    <div className="hv-empty-state" style={{ display: 'flex', minHeight: 400 }}>
      <i className="ti ti-tool hv-empty-state-icon" aria-hidden="true"></i>
      <div className="hv-empty-state-title">{title}</div>
      <div className="hv-empty-state-desc">Tính năng này đang được phát triển và sẽ sớm ra mắt.</div>
      <Link to="/" className="hv-btn hv-btn-primary" style={{ marginTop: 'var(--hv-space-4)' }}>
        <i className="ti ti-home"></i> Về trang chủ
      </Link>
    </div>
  );
}
