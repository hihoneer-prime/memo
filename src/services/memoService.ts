import {
  collection, addDoc, deleteDoc, doc, updateDoc, getDoc,
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
  if (!auth.currentUser) throw new Error('Not authenticated');
  await deleteDoc(doc(db, 'memos', id));
}

export async function updateMemo(id: string, text: string) {
  if (!auth.currentUser) throw new Error('Not authenticated');
  await updateDoc(doc(db, 'memos', id), { text, updatedAt: serverTimestamp() });
}

export async function toggleShare(id: string, isPublic: boolean) {
  if (!auth.currentUser) throw new Error('Not authenticated');
  await updateDoc(doc(db, 'memos', id), { isPublic });
}

export async function getPublicMemo(id: string): Promise<Memo | null> {
  const snap = await getDoc(doc(db, 'memos', id));
  if (!snap.exists()) return null;
  const data = snap.data() as Omit<Memo, 'id'>;
  if (!data.isPublic) return null;
  return { id: snap.id, ...data };
}
