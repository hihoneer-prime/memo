import { useState, useEffect } from 'react';
import type { Memo } from '../types';
import { deleteMemo, updateMemo, toggleShare } from '../services/memoService';
import { useToast } from '../hooks/useToast';

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
  const { showToast } = useToast();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(memo.text);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (!confirmDelete) return;
    const t = setTimeout(() => setConfirmDelete(false), 1500);
    return () => clearTimeout(t);
  }, [confirmDelete]);

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
      onClick={() => {
        if (confirmDelete) { setConfirmDelete(false); return; }
        if (!editing) setEditing(true);
      }}
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
                showToast('링크 복사됨!');
              } else {
                showToast('공유 해제됨');
              }
            } catch {
              // toggleShare 실패는 Firestore 에러 — 무시하고 UI 상태 유지
            }
          }}
          title={memo.isPublic ? '공유 해제' : '공유'}
        >
          🔗
        </button>
        {confirmDelete ? (
          <div className="delete-confirm" onClick={e => e.stopPropagation()}>
            <button className="confirm-yes" onClick={() => deleteMemo(memo.id)}>삭제</button>
            <button className="confirm-no" onClick={() => setConfirmDelete(false)}>취소</button>
          </div>
        ) : (
          <button
            className="del-btn"
            onClick={e => { e.stopPropagation(); setConfirmDelete(true); }}
            title="삭제"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
}
