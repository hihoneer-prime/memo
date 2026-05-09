import Header from '../components/Header';
import MemoInput from '../components/MemoInput';
import MemoCard from '../components/MemoCard';
import { useMemos } from '../hooks/useMemos';

export default function HomePage() {
  const { memos, status } = useMemos();

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f0', display: 'flex', justifyContent: 'center', padding: '48px 16px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
      <div style={{ width: '100%', maxWidth: 600 }}>
        <Header status={status} />
        <MemoInput />
        <div className="memo-list">
          {memos.length === 0
            ? <p className="empty">메모가 없습니다.</p>
            : memos.map(m => <MemoCard key={m.id} memo={m} />)
          }
        </div>
      </div>
    </div>
  );
}
