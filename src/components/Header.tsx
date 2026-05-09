import type { SyncStatus } from '../hooks/useMemos';

interface Props { status: SyncStatus; }

const labels: Record<SyncStatus, string> = {
  connecting: '연결 중...',
  live: '실시간 동기화',
  error: 'Firebase 연결 오류',
};

export default function Header({ status }: Props) {
  return (
    <div className="header-left">
      <h1 className="brand">pinax</h1>
      <span className={`sync-badge ${status}`}>{labels[status]}</span>
    </div>
  );
}
