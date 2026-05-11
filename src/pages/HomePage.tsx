import { useState } from 'react';
import type { User } from 'firebase/auth';
import Header from '../components/Header';
import MemoInput from '../components/MemoInput';
import SearchBar from '../components/SearchBar';
import MemoCard from '../components/MemoCard';
import { useMemos } from '../hooks/useMemos';
import { signOut } from '../services/authService';

interface Props { user: User; }

export default function HomePage({ user }: Props) {
  const { memos, status } = useMemos(user.uid);
  const [query, setQuery] = useState('');

  const filteredMemos = query
    ? memos.filter(m => m.text.toLowerCase().includes(query.toLowerCase()))
    : memos;

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
        <SearchBar value={query} onChange={setQuery} />
        <div className="memo-list">
          {filteredMemos.length === 0
            ? query
              ? (
                <div className="empty-state">
                  <p>'{query}'에 맞는 메모가 없습니다</p>
                </div>
              )
              : (
                <div className="empty-state">
                  <span className="icon">&#10022;</span>
                  <p>첫 번째 아이디어를 기록해보세요</p>
                </div>
              )
            : filteredMemos.map((m, i) => (
              <MemoCard key={m.id} memo={m} index={i} />
            ))
          }
        </div>
      </div>
    </div>
  );
}
