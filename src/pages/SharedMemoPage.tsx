import { useEffect, useState, type ReactNode } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPublicMemo } from '../services/memoService';
import type { Memo } from '../types';

function formatDate(ts: Memo['createdAt']): string {
  if (!ts) return '';
  const d = ts.toDate();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())}`;
}

function SharedLayout({ children }: { children: ReactNode }) {
  return (
    <div className="shared-page">
      <div className="shared-content">
        <div className="shared-brand">
          <Link to="/" className="shared-logo brand">pinax</Link>
        </div>
        {children}
        <div className="shared-cta">
          <Link to="/" className="shared-cta-link">
            pinax로 아이디어 기록하기 →
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function SharedMemoPage() {
  const { id } = useParams<{ id: string }>();
  const [memo, setMemo] = useState<Memo | null | undefined>(undefined);

  useEffect(() => {
    if (!id) { setMemo(null); return; }
    getPublicMemo(id).then(setMemo).catch(() => setMemo(null));
  }, [id]);

  if (memo === undefined) return (
    <SharedLayout>
      <div className="shared-loading">불러오는 중...</div>
    </SharedLayout>
  );

  if (memo === null) return (
    <SharedLayout>
      <div className="shared-not-found-msg">
        비공개 메모이거나 존재하지 않습니다.
      </div>
    </SharedLayout>
  );

  return (
    <SharedLayout>
      <div className="shared-card">
        <p className="shared-memo-text">{memo.text}</p>
        {memo.createdAt && (
          <p className="shared-memo-date">{formatDate(memo.createdAt)}</p>
        )}
      </div>
    </SharedLayout>
  );
}
