import { useState, useEffect } from 'react';
import { subscribeToMemos } from '../services/memoService';
import type { Memo } from '../types';

export type SyncStatus = 'connecting' | 'live' | 'error';

export function useMemos() {
  const [memos, setMemos] = useState<Memo[]>([]);
  const [status, setStatus] = useState<SyncStatus>('connecting');

  useEffect(() => {
    const unsub = subscribeToMemos(
      data => { setMemos(data); setStatus('live'); },
      () => setStatus('error')
    );
    return unsub;
  }, []);

  return { memos, status };
}
