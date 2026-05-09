# memo-share: 메모 공유 링크 생성

## 배경

다른 사람과 아이디어를 공유할 수 있어야 한다. Firestore 문서에 `isPublic` 필드를 추가하고 공개 설정된 메모는 `/share/:id` URL로 비로그인 사용자도 열람 가능하게 한다.

## 현재 코드 구조 (auth-firebase 완료 후 기준)

- `src/services/memoService.ts`: `updateMemo` 있으나 `isPublic` 토글 없음
- `src/components/MemoCard.tsx`: 공유 버튼 없음
- `src/App.tsx`: 단일 라우트, 공유 페이지 없음
- `src/types/index.ts`: `isPublic?: boolean` 필드는 타입에 있으나 미사용

## 변경 범위

| 파일 | 변경 유형 | 내용 |
|------|----------|------|
| `src/services/memoService.ts` | 수정 | `toggleShare(id, isPublic)` 추가, `getPublicMemo(id)` 추가 |
| `src/components/MemoCard.tsx` | 수정 | 공유 토글 버튼 + 공유 URL 클립보드 복사 |
| `src/pages/SharedMemoPage.tsx` | 신규 | 공개 메모 열람 페이지 (비로그인 접근 가능) |
| `src/App.tsx` | 수정 | React Router 라우팅 추가: `/` → HomePage, `/share/:id` → SharedMemoPage |

## 구현 방향

### src/services/memoService.ts 추가 함수

```ts
import { getDoc } from 'firebase/firestore';

export async function toggleShare(id: string, isPublic: boolean) {
  await updateDoc(doc(db, 'memos', id), { isPublic });
}

export async function getPublicMemo(id: string): Promise<Memo | null> {
  const snap = await getDoc(doc(db, 'memos', id));
  if (!snap.exists()) return null;
  const data = snap.data() as Omit<Memo, 'id'>;
  if (!data.isPublic) return null;
  return { id: snap.id, ...data };
}
```

### src/App.tsx (라우팅 추가)

```tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SharedMemoPage from './pages/SharedMemoPage';

export default function App() {
  const user = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/share/:id" element={<SharedMemoPage />} />
        <Route path="*" element={
          user === undefined ? <div>로딩 중…</div> :
          user ? <HomePage user={user} /> : <LoginPage />
        } />
      </Routes>
    </BrowserRouter>
  );
}
```

### src/pages/SharedMemoPage.tsx

```tsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getPublicMemo } from '../services/memoService';
import type { Memo } from '../types';

export default function SharedMemoPage() {
  const { id } = useParams<{ id: string }>();
  const [memo, setMemo] = useState<Memo | null | undefined>(undefined);

  useEffect(() => {
    if (!id) return;
    getPublicMemo(id).then(setMemo);
  }, [id]);

  if (memo === undefined) return <div>불러오는 중…</div>;
  if (memo === null) return <div>비공개 메모이거나 존재하지 않습니다.</div>;
  return <div className="shared-memo">{memo.text}</div>;
}
```

## 의존 관계

- `src/App.tsx` → `react-router-dom`
- `src/pages/SharedMemoPage.tsx` → `src/services/memoService.ts` (getPublicMemo)
- Firestore 보안 규칙: `isPublic == true`인 문서 read 허용 (auth-firebase spec 참조)

## 수락 조건

tasks.json의 acceptance_criteria와 동일.

## 검증 명령

```bash
npm run build
```
