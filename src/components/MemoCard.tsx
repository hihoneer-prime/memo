import { useState } from 'react';
import type { Memo } from '../types';
import { deleteMemo, updateMemo, toggleShare } from '../services/memoService';

interface Props { memo: Memo; }

function formatDate(ts: Memo['createdAt']): string {
  if (!ts) return '방금 전';
  const d = ts.toDate();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function MemoCard({ memo }: Props) {
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
      className="memo-item"
      onClick={() => { if (!editing) setEditing(true); }}
      style={{ cursor: editing ? 'default' : 'pointer' }}
    >
      <div style={{ flex: 1 }}>
        {editing ? (
          <textarea
            autoFocus
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleSave}
            style={{ width: '100%', border: 'none', background: 'transparent', resize: 'none', outline: 'none', fontFamily: 'inherit', fontSize: 14, lineHeight: 1.6, color: '#222' }}
          />
        ) : (
          <div className="memo-text">{memo.text}</div>
        )}
        <div className="memo-meta">{formatDate(memo.createdAt)}</div>
      </div>
      <button
        className="share-btn"
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
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          fontSize: 16,
          padding: '2px 6px',
          opacity: memo.isPublic ? 1 : 0.4,
          color: memo.isPublic ? '#2563eb' : '#888',
        }}
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
  );
}
