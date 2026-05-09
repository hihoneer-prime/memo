# setup-react: React + TypeScript 마이그레이션 및 프로젝트 구조 분리

## 배경

현재 앱은 `index.html`(CSS 포함 157줄) + `src/main.js`(UI+CRUD 혼합 76줄) + `src/firebase.js`(15줄)로 구성된 단일 파일 구조다. 이후 인증, 수정, 공유, 라우팅 기능을 추가하려면 컴포넌트 분리와 서비스 레이어가 필수다.

## 현재 코드 구조

- `index.html` (157줄): `<style>` 태그에 전체 CSS 포함, `<body>`에 HTML 구조
- `src/main.js` (76줄)
  - 줄 1-12: Firebase import + DOM 요소 참조
  - 줄 14-19: `formatDate(ts)` — Firestore Timestamp → 문자열
  - 줄 21-23: `escapeHtml(str)`
  - 줄 25-43: `render(memos)` — innerHTML로 직접 DOM 조작
  - 줄 46-57: `onSnapshot` 실시간 리스너
  - 줄 59-66: `addMemo()` — addDoc
  - 줄 68-70: `deleteMemo(id)` — deleteDoc
  - 줄 72-75: 이벤트 리스너
- `src/firebase.js` (15줄): Firebase 앱 초기화 + `db` export

## 목표 디렉토리 구조

```
src/
  lib/
    firebase.ts         ← firebase.js 대체 (Auth 추가)
  types/
    index.ts            ← Memo, User 타입
  services/
    memoService.ts      ← Firestore CRUD (addMemo, deleteMemo, updateMemo, subscribeToMemos)
  hooks/
    useMemos.ts         ← onSnapshot → React state 연결
  components/
    Header.tsx          ← 앱 헤더 + 동기화 배지
    MemoInput.tsx       ← textarea + 추가 버튼
    MemoCard.tsx        ← 메모 카드 (텍스트, 날짜, 삭제 버튼)
  pages/
    HomePage.tsx        ← 메인 페이지 조합
  App.tsx               ← 라우터 없이 단순 렌더
  main.tsx              ← ReactDOM.createRoot
index.html              ← CSS 제거, <div id="root"> 만 남김
```

## 변경 범위

| 파일 | 변경 유형 | 내용 |
|------|----------|------|
| `package.json` | 수정 | react, react-dom, react-router-dom 추가; typescript, @types/react 추가 |
| `vite.config.ts` | 신규 | vite.config.js → ts 전환, react 플러그인 추가 |
| `tsconfig.json` | 신규 | TypeScript 설정 |
| `index.html` | 수정 | CSS 제거, `<div id="root">` + `src/main.tsx` 참조로 교체 |
| `src/firebase.js` | 삭제 후 대체 | → `src/lib/firebase.ts` |
| `src/main.js` | 삭제 후 대체 | → `src/main.tsx` + 각 파일로 분리 |
| `src/lib/firebase.ts` | 신규 | Firebase 초기화 (db만, auth는 auth task에서 추가) |
| `src/types/index.ts` | 신규 | Memo 타입 |
| `src/services/memoService.ts` | 신규 | addMemo, deleteMemo, subscribeToMemos |
| `src/hooks/useMemos.ts` | 신규 | useEffect + onSnapshot → memos state |
| `src/components/Header.tsx` | 신규 | |
| `src/components/MemoInput.tsx` | 신규 | |
| `src/components/MemoCard.tsx` | 신규 | |
| `src/pages/HomePage.tsx` | 신규 | |
| `src/App.tsx` | 신규 | |
| `src/main.tsx` | 신규 | |

## 구현 방향

### package.json (after)
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "firebase": "^12.12.1",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.28.0"
  },
  "devDependencies": {
    "@types/react": "^18.3.12",
    "@types/react-dom": "^18.3.1",
    "@vitejs/plugin-react": "^4.3.4",
    "typescript": "^5.6.3",
    "vite": "^8.0.11"
  }
}
```

### src/types/index.ts
```ts
import type { Timestamp } from 'firebase/firestore';

export interface Memo {
  id: string;
  text: string;
  createdAt: Timestamp | null;
  userId?: string;
  isPublic?: boolean;
}
```

### src/lib/firebase.ts
```ts
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = { /* 기존 설정 그대로 */ };

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
```

### src/services/memoService.ts
```ts
import { collection, addDoc, deleteDoc, doc, onSnapshot, orderBy, query, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { Memo } from '../types';

const memosCol = collection(db, 'memos');

export function subscribeToMemos(onData: (memos: Memo[]) => void, onError: (e: Error) => void) {
  const q = query(memosCol, orderBy('createdAt', 'desc'));
  return onSnapshot(q, snap => onData(snap.docs.map(d => ({ id: d.id, ...d.data() } as Memo))), onError);
}

export async function addMemo(text: string) {
  await addDoc(memosCol, { text, createdAt: serverTimestamp() });
}

export async function deleteMemo(id: string) {
  await deleteDoc(doc(db, 'memos', id));
}
```

### src/hooks/useMemos.ts
```ts
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
```

## 의존 관계

- `src/main.tsx` → `src/App.tsx`
- `src/App.tsx` → `src/pages/HomePage.tsx`
- `src/pages/HomePage.tsx` → `src/components/*`, `src/hooks/useMemos.ts`
- `src/hooks/useMemos.ts` → `src/services/memoService.ts`
- `src/services/memoService.ts` → `src/lib/firebase.ts`

## 수락 조건

tasks.json의 acceptance_criteria와 동일.

## 검증 명령

```bash
npm run build
```
