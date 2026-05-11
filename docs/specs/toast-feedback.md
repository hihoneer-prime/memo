# toast-feedback: 액션 피드백 토스트 알림 시스템

## 배경
현재 공유 버튼을 눌러도 아무런 시각적 피드백이 없다. 사용자는 링크가 복사됐는지 알 수 없다.
삭제, 수정 완료 시에도 피드백이 없다. 경량 토스트 시스템을 추가한다.

## 현재 코드 구조

- `src/components/MemoCard.tsx` (92줄)
  - 줄 65-77: 공유 버튼 — `toggleShare` 후 `navigator.clipboard.writeText` 호출하지만 피드백 없음
  - 줄 83-88: 삭제 버튼 — `deleteMemo` 즉시 호출, 피드백 없음

- `src/App.tsx` (22줄)
  - 줄 7-22: BrowserRouter + Routes — 여기에 ToastProvider를 감싸야 함

## 변경 범위

| 파일 | 변경 유형 | 내용 |
|------|----------|------|
| `src/contexts/ToastContext.tsx` | 신규 | Toast context + Provider |
| `src/hooks/useToast.ts` | 신규 | useToast 훅 |
| `src/components/Toast.tsx` | 신규 | Toast UI 컴포넌트 |
| `src/App.tsx` | 수정 | ToastProvider로 앱 감싸기 |
| `src/components/MemoCard.tsx` | 수정 | useToast 호출 추가 |
| `src/index.css` | 수정 | 토스트 스타일 추가 |

## 구현 방향

### src/contexts/ToastContext.tsx (신규)
```tsx
import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface ToastState { message: string; id: number; }
interface ToastContextType { showToast: (message: string) => void; }

export const ToastContext = createContext<ToastContextType>({ showToast: () => {} });

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ToastState | null>(null);

  const showToast = useCallback((message: string) => {
    const id = Date.now();
    setToast({ message, id });
    setTimeout(() => setToast(t => t?.id === id ? null : t), 2500);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && <div className="toast" key={toast.id}>{toast.message}</div>}
    </ToastContext.Provider>
  );
}
```

### src/hooks/useToast.ts (신규)
```ts
import { useContext } from 'react';
import { ToastContext } from '../contexts/ToastContext';
export function useToast() { return useContext(ToastContext); }
```

### src/App.tsx 수정 (줄 10 감싸기)
```tsx
// Before
return (
  <BrowserRouter>
    <Routes>...

// After
return (
  <ToastProvider>
    <BrowserRouter>
      <Routes>...
    </BrowserRouter>
  </ToastProvider>
);
```

### src/components/MemoCard.tsx 수정 (줄 65-77 공유 버튼)
```tsx
// Before
onClick={async (e) => {
  e.stopPropagation();
  const nextPublic = !memo.isPublic;
  try {
    await toggleShare(memo.id, nextPublic);
    if (nextPublic) {
      const url = `${window.location.origin}/share/${memo.id}`;
      await navigator.clipboard.writeText(url).catch(() => undefined);
    }
  } catch { }
}}

// After
const { showToast } = useToast();
// ...
onClick={async (e) => {
  e.stopPropagation();
  const nextPublic = !memo.isPublic;
  try {
    await toggleShare(memo.id, nextPublic);
    if (nextPublic) {
      const url = `${window.location.origin}/share/${memo.id}`;
      await navigator.clipboard.writeText(url).catch(() => undefined);
      showToast('링크 복사됨!');
    } else {
      showToast('공유 해제됨');
    }
  } catch { }
}}
```

### src/index.css 추가 (파일 끝에)
```css
/* Toast */
.toast {
  position: fixed;
  bottom: 32px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: var(--text);
  padding: 10px 20px;
  border-radius: 100px;
  font-size: 13px;
  font-weight: 500;
  white-space: nowrap;
  z-index: 9999;
  animation: toastIn 0.2s ease both;
}

@keyframes toastIn {
  from { opacity: 0; transform: translateX(-50%) translateY(8px); }
  to   { opacity: 1; transform: translateX(-50%) translateY(0); }
}
```

## 의존 관계
- `App.tsx`가 ToastProvider를 import → `contexts/ToastContext.tsx` 필요
- `MemoCard.tsx`가 `useToast` import → `hooks/useToast.ts` 필요
- `memo-pin` task가 이 시스템을 재사용

## 수락 조건
- npm run build 성공
- src/components/Toast.tsx 또는 ToastContext.tsx 내 Toast 렌더링 존재
- src/hooks/useToast.ts 존재
- 공유 링크 복사 시 '링크 복사됨!' 토스트 표시
- 토스트는 2.5초 후 자동 사라짐

## 검증 명령
```bash
npm run build
grep -r "useToast" src/components/MemoCard.tsx
grep -r "ToastProvider" src/App.tsx
```
