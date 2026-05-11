import { useState, useEffect } from 'react';
import { subscribeToMemos } from '../services/memoService';
import type { Memo } from '../types';

export type SyncStatus = 'connecting' | 'live' | 'error';

export function useMemos(userId: string) {
  const [memos, setMemos] = useState<Memo[]>([]);
  const [status, setStatus] = useState<SyncStatus>('connecting');

  useEffect(() => {
    const unsub = subscribeToMemos(
      userId,
      data => {
        const sorted = [...data].sort((a, b) => {
          if (!!a.isPinned === !!b.isPinned) return 0;
          return a.isPinned ? -1 : 1;
        });
        setMemos(sorted);
        setStatus('live');
      },
      (e) => { console.error('[useMemos]', e); setStatus('error'); }
    );
    return unsub;
  }, [userId]);

  return { memos, status };
}
