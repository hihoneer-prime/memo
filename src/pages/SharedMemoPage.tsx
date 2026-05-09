import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getPublicMemo } from '../services/memoService';
import type { Memo } from '../types';

export default function SharedMemoPage() {
  const { id } = useParams<{ id: string }>();
  const [memo, setMemo] = useState<Memo | null | undefined>(undefined);

  useEffect(() => {
    if (!id) { setMemo(null); return; }
    getPublicMemo(id).then(setMemo).catch(() => setMemo(null));
  }, [id]);

  if (memo === undefined) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <span>불러오는 중...</span>
    </div>
  );

  if (memo === null) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#888' }}>비공개 메모이거나 존재하지 않습니다.</p>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f0', display: 'flex', justifyContent: 'center', padding: '48px 16px' }}>
      <div style={{ width: '100%', maxWidth: 600 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 24 }}>공유된 메모</h2>
        <div style={{ background: '#fff', border: '1.5px solid #ebebeb', borderRadius: 10, padding: '16px 18px' }}>
          <p style={{ fontSize: 14, lineHeight: 1.6, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{memo.text}</p>
        </div>
      </div>
    </div>
  );
}
