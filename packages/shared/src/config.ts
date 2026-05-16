export const TAX_RATES = [0, 0.05, 0.08, 0.1] as const;

export const STATUS_LABELS: Record<string, string> = {
  draft: 'Nháp',
  pending: 'Chờ xử lý',
  issued: 'Đã phát hành',
  cqt_accepted: 'CQT chấp nhận',
  cqt_rejected: 'CQT từ chối',
  adjusted: 'Đã điều chỉnh',
  replaced: 'Đã thay thế',
};

export const STATUS_COLORS: Record<string, string> = {
  draft: 'gray',
  pending: 'yellow',
  issued: 'blue',
  cqt_accepted: 'green',
  cqt_rejected: 'red',
  adjusted: 'purple',
  replaced: 'orange',
};
