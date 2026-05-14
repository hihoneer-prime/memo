import type { SyncStatus } from '../hooks/useMemos';
import { useWeather } from '../hooks/useWeather';

interface Props { status: SyncStatus; }

const labels: Record<SyncStatus, string> = {
  connecting: '연결 중...',
  live: '실시간 동기화',
  error: 'Firebase 연결 오류',
};

export default function Header({ status }: Props) {
  const weather = useWeather();

  return (
    <div className="header-left">
      <h1 className="brand">pinax</h1>
      <span className={`sync-badge ${status}`}>{labels[status]}</span>
      {weather.status === 'success' && (
        <span className="weather-badge">
          {weather.data.emoji} {weather.data.temp}&deg;
        </span>
      )}
    </div>
  );
}
