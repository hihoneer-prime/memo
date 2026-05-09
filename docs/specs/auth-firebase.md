# auth-firebase: Firebase Auth Google 로그인 및 계정 기반 메모 관리

## 배경

setup-react 완료 후 앱은 로그인 없이 전체 memos 컬렉션을 공유하는 상태다. 계정 기반으로 전환해 각 사용자가 자신의 메모만 보고 관리할 수 있어야 한다.

## 현재 코드 구조 (setup-react 완료 후 기준)

- `src/lib/firebase.ts`: `db`만 export, Auth 미포함
- `src/services/memoService.ts`: userId 필터 없이 전체 memos 쿼리
- `src/App.tsx`: 인증 상태 무관하게 HomePage 렌더링

## 변경 범위

| 파일 | 변경 유형 | 내용 |
|------|----------|------|
| `src/lib/firebase.ts` | 수정 | `getAuth` 초기화 + `auth` export 추가 |
| `src/services/authService.ts` | 신규 | Google 로그인/로그아웃/상태 감지 |
| `src/hooks/useAuth.ts` | 신규 | Firebase Auth 상태 → React state |
| `src/pages/LoginPage.tsx` | 신규 | Google 로그인 버튼 페이지 |
| `src/services/memoService.ts` | 수정 | userId 파라미터 추가, where 필터, 저장 시 userId 포함 |
| `src/App.tsx` | 수정 | useAuth로 인증 분기 — 미로그인 → LoginPage, 로그인 → HomePage |

## 구현 방향

### src/lib/firebase.ts (after)
```ts
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = { /* 기존 */ };
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
```

### src/services/authService.ts
```ts
import { GoogleAuthProvider, signInWithPopup, signOut as fbSignOut, onAuthStateChanged } from 'firebase/auth';
import type { User } from 'firebase/auth';
import { auth } from '../lib/firebase';

const provider = new GoogleAuthProvider();

export const signInWithGoogle = () => signInWithPopup(auth, provider);
export const signOut = () => fbSignOut(auth);
export const subscribeToAuth = (cb: (user: User | null) => void) => onAuthStateChanged(auth, cb);
```

### src/hooks/useAuth.ts
```ts
import { useState, useEffect } from 'react';
import type { User } from 'firebase/auth';
import { subscribeToAuth } from '../services/authService';

export function useAuth() {
  const [user, setUser] = useState<User | null | undefined>(undefined);
  useEffect(() => subscribeToAuth(setUser), []);
  return user;
}
```

### src/services/memoService.ts (수정 부분)

subscribeToMemos에 userId 필터 추가:
```ts
import { where } from 'firebase/firestore';

export function subscribeToMemos(userId: string, onData: ..., onError: ...) {
  const q = query(memosCol, where('userId', '==', userId), orderBy('createdAt', 'desc'));
  ...
}

export async function addMemo(text: string, userId: string) {
  await addDoc(memosCol, { text, userId, createdAt: serverTimestamp() });
}
```

### src/App.tsx (after)
```tsx
import { useAuth } from './hooks/useAuth';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';

export default function App() {
  const user = useAuth();
  if (user === undefined) return <div>로딩 중…</div>;
  return user ? <HomePage user={user} /> : <LoginPage />;
}
```

### Firestore 보안 규칙 (Firebase 콘솔에서 수동 설정 필요)
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /memos/{memoId} {
      allow read: if resource.data.isPublic == true || request.auth.uid == resource.data.userId;
      allow write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
    }
  }
}
```

## 의존 관계

- `src/App.tsx` → `src/hooks/useAuth.ts`
- `src/hooks/useAuth.ts` → `src/services/authService.ts`
- `src/services/authService.ts` → `src/lib/firebase.ts`
- `src/pages/HomePage.tsx` → props로 user 수신 (userId 사용)

## 수락 조건

tasks.json의 acceptance_criteria와 동일.

## 검증 명령

```bash
npm run build
```
