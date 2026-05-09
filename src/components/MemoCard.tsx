import { useState } from 'react';
import type { Memo } from '../types';
import { deleteMemo, updateMemo, toggleShare } from '../services/memoService';

interface Props {
  memo: Memo;
  index: number;
}

function formatDate(ts: Memo['createdAt']): string {
  if (!ts) return '방금 전';
  const d = ts.toDate();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function MemoCard({ memo, index }: Props) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(memo.text);

  function handleSave() {
    const trimmed = draft.trim();
    if (trimmed && trimmed !== memo.text) updateMemo(memo.id, trimmed);
    setDraft(trimmed || memo.text);
    setEditing(false);
  }

  function handleCancel() {
    setDraft(memo.text);
    setEditing(false);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleSave();
    if (e.key === 'Escape') handleCancel();
  }

  return (
    <div
      className="memo-card"
      onClick={() => { if (!editing) setEditing(true); }}
      style={{
        cursor: editing ? 'default' : 'pointer',
        animationDelay: `${index * 0.05}s`,
      }}
    >
      <div className="memo-card-body">
        {editing ? (
          <textarea
            className="memo-edit-textarea"
            autoFocus
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleSave}
          />
        ) : (
          <div className="memo-text">{memo.text}</div>
        )}
        <div className="memo-meta">{formatDate(memo.createdAt)}</div>
      </div>
      <div className="card-actions">
        <button
          className={`share-btn ${memo.isPublic ? 'active' : 'inactive'}`}
          onClick={async (e) => {
            e.stopPropagation();
            const nextPublic = !memo.isPublic;
            try {
              await toggleShare(memo.id, nextPublic);
              if (nextPublic) {
                const url = `${window.location.origin}/share/${memo.id}`;
                await navigator.clipboard.writeText(url).catch(() => undefined);
              }
            } catch {
              // toggleShare 실패는 Firestore 에러 — 무시하고 UI 상태 유지
            }
          }}
          title={memo.isPublic ? '공유 해제' : '공유'}
        >
          🔗
        </button>
        <button
          className="del-btn"
          onClick={e => { e.stopPropagation(); deleteMemo(memo.id); }}
          title="삭제"
        >
          ×
        </button>
      </div>
    </div>
  );
}
