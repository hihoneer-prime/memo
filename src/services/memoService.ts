import {
  collection, addDoc, deleteDoc, doc,
  onSnapshot, orderBy, query, serverTimestamp, where
} from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import type { Memo } from '../types';

const memosCol = collection(db, 'memos');

export function subscribeToMemos(
  userId: string,
  onData: (memos: Memo[]) => void,
  onError: (e: Error) => void
) {
  const q = query(memosCol, where('userId', '==', userId), orderBy('createdAt', 'desc'));
  return onSnapshot(
    q,
    snap => onData(snap.docs.map(d => ({ id: d.id, ...d.data() } as Memo))),
    onError
  );
}

export async function addMemo(text: string) {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error('Not authenticated');
  await addDoc(memosCol, { text, userId: uid, createdAt: serverTimestamp() });
}

export async function deleteMemo(id: string) {
  await deleteDoc(doc(db, 'memos', id));
}
