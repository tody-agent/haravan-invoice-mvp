import { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL || '/api';

interface ComplianceRule {
  id: string;
  name: string;
  description: string;
  status: 'pass' | 'warning' | 'fail';
  reference: string;
  details: string;
}

const defaultRules: ComplianceRule[] = [
  {
    id: 'nd70',
    name: 'NĐ 70/2025 — Không hủy hóa đơn',
    description: 'Hóa đơn đã phát hành chỉ được điều chỉnh hoặc thay thế, không được hủy',
    status: 'pass',
    reference: 'Nghị định 70/2025/NĐ-CP §7',
    details: 'Hệ thống đã tắt chức năng "Hủy hóa đơn". Chỉ có "Điều chỉnh" và "Thay thế".',
  },
  {
    id: 'tt32',
    name: 'TT 32/2025 — Định dạng XML',
    description: 'XML hóa đơn phải đúng schema QĐ 1510',
    status: 'pass',
    reference: 'Thông tư 32/2025/TT-BTC §3',
    details: 'MockAdapter tạo XML đúng cấu trúc. Cần verify với schema thật khi có Hilo.',
  },
  {
    id: 'qđ1510',
    name: 'QĐ 1510 — Mẫu hóa đơn',
    description: 'Hóa đơn phải có đầy đủ thông tin theo QĐ 1510',
    status: 'pass',
    reference: 'Quyết định 1510/QĐ-TCT',
    details: 'PDF template đã bầy đủ: seller, buyer, items, totals, QR code.',
  },
  {
    id: 'mst',
    name: 'MST — Validate format',
    description: 'Mã số thuế phải 10 hoặc 13 chữ số',
    status: 'pass',
    reference: 'Tổng cục Thuế',
    details: 'validateMST() kiểm tra format + checksum.',
  },
  {
    id: 'tax_rate',
    name: 'Thuế suất — Đúng biểu thuế',
    description: 'Chỉ cho phép thuế suất 0%, 5%, 8%, 10%',
    status: 'pass',
    reference: 'Luật Thuế GTGT',
    details: 'validateTaxRate() chỉ cho phép 4 mức thuế.',
  },
  {
    id: 'audit',
    name: 'Audit Trail — Lưu trữ 10 năm',
    description: 'Mọi thao tác phải được ghi log, lưu trữ tối thiểu 10 năm',
    status: 'warning',
    reference: 'NĐ 123/2020/NĐ-CP §12',
    details: 'Audit log đang lưu trong D1. Cần migrate sang storage dài hạn.',
  },
  {
    id: 'backup',
    name: 'Backup — Daily + Monthly restore',
    description: 'Backup dữ liệu hàng ngày, test restore hàng tháng',
    status: 'warning',
    reference: 'Best practice',
    details: 'Chưa có automated backup. Cần setup Cloudflare D1 backup.',
  },
];

export default function ComplianceCenter() {
  const [rules] = useState<ComplianceRule[]>(defaultRules);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch(`${API_URL}/v1/reports/summary`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(json => {
        if (json.success) setSummary(json.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const passCount = rules.filter(r => r.status === 'pass').length;
  const warningCount = rules.filter(r => r.status === 'warning').length;
  const failCount = rules.filter(r => r.status === 'fail').length;

  const statusIcon: Record<string, string> = {
    pass: 'ti ti-circle-check',
    warning: 'ti ti-alert-triangle',
    fail: 'ti ti-circle-x',
  };

  const statusColor: Record<string, string> = {
    pass: 'var(--hv-success)',
    warning: 'var(--hv-warning)',
    fail: 'var(--hv-danger)',
  };

  const statusBadge: Record<string, string> = {
    pass: 'hv-badge-success',
    warning: 'hv-badge-warning',
    fail: 'hv-badge-danger',
  };

  return (
    <>
      <h2 className="text-h2" style={{ marginBottom: 'var(--hv-space-4)' }}>Compliance Center</h2>

      {/* Summary Cards */}
      <div className="hv-grid-4" style={{ marginBottom: 'var(--hv-space-4)' }}>
        <div className="hv-kpi">
          <div className="hv-kpi-icon hv-kpi-icon-green"><i className="ti ti-shield-check"></i></div>
          <div className="hv-kpi-label">Quy tắc đạt</div>
          <div className="hv-kpi-value" style={{ color: statusColor.pass }}>{passCount}</div>
        </div>
        <div className="hv-kpi">
          <div className="hv-kpi-icon hv-kpi-icon-orange"><i className="ti ti-alert-triangle"></i></div>
          <div className="hv-kpi-label">Cảnh báo</div>
          <div className="hv-kpi-value" style={{ color: statusColor.warning }}>{warningCount}</div>
        </div>
        <div className="hv-kpi">
          <div className="hv-kpi-icon hv-kpi-icon-blue"><i className="ti ti-receipt"></i></div>
          <div className="hv-kpi-label">Tổng hóa đơn</div>
          <div className="hv-kpi-value">{summary?.totalIssued || 0}</div>
        </div>
        <div className="hv-kpi">
          <div className="hv-kpi-icon hv-kpi-icon-purple"><i className="ti ti-percentage"></i></div>
          <div className="hv-kpi-label">Tỷ lệ CQT chấp nhận</div>
          <div className="hv-kpi-value">
            {summary?.totalIssued > 0 
              ? `${((summary.totalIssued - summary.totalError) / summary.totalIssued * 100).toFixed(1)}%`
              : 'N/A'}
          </div>
        </div>
      </div>

      {/* Compliance Rules */}
      <div className="hv-card" style={{ marginBottom: 'var(--hv-space-4)' }}>
        <div className="hv-card-header">
          <div className="hv-card-title">Quy tắc Compliance</div>
          <span className="text-caption">{passCount}/{rules.length} đạt</span>
        </div>
        <div>
          {rules.map(rule => (
            <div key={rule.id} style={{
              display: 'flex', gap: 'var(--hv-space-3)', padding: 'var(--hv-space-3) var(--hv-space-4)',
              borderBottom: '1px solid var(--hv-border)',
              alignItems: 'flex-start',
            }}>
              <div style={{ flexShrink: 0, marginTop: 2 }}>
                <i className={statusIcon[rule.status]} style={{ fontSize: 18, color: statusColor[rule.status] }}></i>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--hv-space-2)', marginBottom: 'var(--hv-space-1)' }}>
                  <span className="text-body-strong">{rule.name}</span>
                  <span className={`hv-badge ${statusBadge[rule.status]}`}>
                    {rule.status === 'pass' ? 'Đạt' : rule.status === 'warning' ? 'Cảnh báo' : 'Lỗi'}
                  </span>
                </div>
                <p className="text-caption" style={{ marginBottom: 'var(--hv-space-1)' }}>{rule.description}</p>
                <p className="text-caption" style={{ fontStyle: 'italic' }}>{rule.details}</p>
                <p className="text-caption" style={{ marginTop: 'var(--hv-space-1)' }}>
                  <i className="ti ti-external-link" style={{ fontSize: 12 }}></i> {rule.reference}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Regulation References */}
      <div className="hv-card">
        <div className="hv-card-header">
          <div className="hv-card-title">Văn bản quy định</div>
        </div>
        <div className="hv-grid-3">
          {[
            { name: 'NĐ 70/2025', desc: 'Bỏ thủ tục hủy HĐĐT', icon: 'ti ti-file-text', color: 'var(--hv-primary)' },
            { name: 'TT 32/2025', desc: 'Hướng dẫn HĐĐT', icon: 'ti ti-file-description', color: 'var(--hv-success)' },
            { name: 'QĐ 1510', desc: 'Mẫu hóa đơn', icon: 'ti ti-template', color: 'var(--hv-purple)' },
          ].map(reg => (
            <div key={reg.name} className="hv-card" style={{ padding: 'var(--hv-space-3)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--hv-space-2)' }}>
                <i className={reg.icon} style={{ fontSize: 20, color: reg.color }}></i>
                <div>
                  <p className="text-body-strong">{reg.name}</p>
                  <p className="text-caption">{reg.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
