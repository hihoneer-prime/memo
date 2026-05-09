import type { User } from 'firebase/auth';
import Header from '../components/Header';
import MemoInput from '../components/MemoInput';
import MemoCard from '../components/MemoCard';
import { useMemos } from '../hooks/useMemos';
import { signOut } from '../services/authService';

interface Props { user: User; }

export default function HomePage({ user }: Props) {
  const { memos, status } = useMemos(user.uid);

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f0', display: 'flex', justifyContent: 'center', padding: '48px 16px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
      <div style={{ width: '100%', maxWidth: 600 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Header status={status} />
          <button
            onClick={() => signOut()}
            style={{ padding: '6px 14px', background: 'transparent', border: '1px solid #ccc', borderRadius: 6, fontSize: 13, cursor: 'pointer', color: '#666' }}
          >
            로그아웃
          </button>
        </div>
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
