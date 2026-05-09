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
    <div className="app-container">
      <div className="app-content">
        <div className="header">
          <Header status={status} />
          <button className="logout-btn" onClick={() => signOut()}>
            로그아웃
          </button>
        </div>
        <MemoInput />
        <div className="memo-list">
          {memos.length === 0
            ? (
              <div className="empty-state">
                <span className="icon">&#10022;</span>
                <p>첫 번째 아이디어를 기록해보세요</p>
              </div>
            )
            : memos.map((m, i) => (
              <MemoCard key={m.id} memo={m} index={i} />
            ))
          }
        </div>
      </div>
    </div>
  );
}
