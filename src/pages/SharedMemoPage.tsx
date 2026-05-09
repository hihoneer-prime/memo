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
    <div className="loading-screen">
      <span>불러오는 중...</span>
    </div>
  );

  if (memo === null) return (
    <div className="shared-not-found">
      <p>비공개 메모이거나 존재하지 않습니다.</p>
    </div>
  );

  return (
    <div className="shared-page">
      <div className="shared-content">
        <h2 className="shared-heading">공유된 메모</h2>
        <div className="shared-card">
          <p>{memo.text}</p>
        </div>
      </div>
    </div>
  );
}
