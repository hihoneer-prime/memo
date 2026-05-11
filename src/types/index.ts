import type { Timestamp } from 'firebase/firestore';

export interface Memo {
  id: string;
  text: string;
  createdAt: Timestamp | null;
  userId?: string;
  isPublic?: boolean;
  isPinned?: boolean;
  updatedAt?: Timestamp | null;
}
