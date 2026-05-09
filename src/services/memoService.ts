import {
  collection, addDoc, deleteDoc, doc,
  onSnapshot, orderBy, query, serverTimestamp
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { Memo } from '../types';

const memosCol = collection(db, 'memos');

export function subscribeToMemos(
  onData: (memos: Memo[]) => void,
  onError: (e: Error) => void
) {
  const q = query(memosCol, orderBy('createdAt', 'desc'));
  return onSnapshot(
    q,
    snap => onData(snap.docs.map(d => ({ id: d.id, ...d.data() } as Memo))),
    onError
  );
}

export async function addMemo(text: string) {
  await addDoc(memosCol, { text, createdAt: serverTimestamp() });
}

export async function deleteMemo(id: string) {
  await deleteDoc(doc(db, 'memos', id));
}
