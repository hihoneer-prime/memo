import type { Memo } from '../types';
import { deleteMemo } from '../services/memoService';

interface Props { memo: Memo; }

function formatDate(ts: Memo['createdAt']): string {
  if (!ts) return '방금 전';
  const d = ts.toDate();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function MemoCard({ memo }: Props) {
  return (
    <div className="memo-item">
      <div style={{ flex: 1 }}>
        <div className="memo-text">{memo.text}</div>
        <div className="memo-meta">{formatDate(memo.createdAt)}</div>
      </div>
      <button className="del-btn" onClick={() => deleteMemo(memo.id)} title="삭제">x</button>
    </div>
  );
}
