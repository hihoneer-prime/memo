# memo-pin: 중요 메모 상단 고정

## 배경
중요한 아이디어를 상단에 고정해두고 싶은 니즈가 있다.
Firestore 쿼리 변경 없이 클라이언트 사이드 정렬로 구현해 복합 인덱스 추가 없이 처리.

## 현재 코드 구조

- `src/types/index.ts` (10줄)
  - 줄 3-10: Memo 인터페이스 — `isPinned` 필드 없음

- `src/services/memoService.ts` (50줄)
  - 줄 10-21: subscribeToMemos — createdAt DESC 쿼리
  - 줄 39-42: toggleShare — 패턴 참고

- `src/hooks/useMemos.ts` (21줄)
  - 줄 12-16: subscribeToMemos 호출, 결과를 setMemos

- `src/components/MemoCard.tsx` (92줄)
  - 줄 62-90: card-actions div — 핀 버튼 추가 위치

## 변경 범위

| 파일 | 변경 유형 | 내용 |
|------|----------|------|
| `src/types/index.ts` | 수정 | `isPinned?: boolean` 추가 |
| `src/services/memoService.ts` | 수정 | `pinMemo(id, isPinned)` 함수 추가 |
| `src/hooks/useMemos.ts` | 수정 | 데이터 수신 후 isPinned 기준 클라이언트 정렬 |
| `src/components/MemoCard.tsx` | 수정 | 핀 버튼 추가, useToast 피드백 |
| `src/index.css` | 수정 | 핀 버튼 스타일, 고정 카드 시각 구분 |

## 구현 방향

### src/types/index.ts
```ts
// After
export interface Memo {
  id: string;
  text: string;
  createdAt: Timestamp | null;
  userId?: string;
  isPublic?: boolean;
  isPinned?: boolean;   // 추가
  updatedAt?: Timestamp | null;
}
```

### src/services/memoService.ts — pinMemo 추가 (toggleShare 패턴 동일)
```ts
export async function pinMemo(id: string, isPinned: boolean) {
  if (!auth.currentUser) throw new Error('Not authenticated');
  await updateDoc(doc(db, 'memos', id), { isPinned });
}
```

### src/hooks/useMemos.ts — 클라이언트 사이드 정렬
```ts
// Before (줄 14)
data => { setMemos(data); setStatus('live'); },

// After
data => {
  const sorted = [...data].sort((a, b) => {
    if (a.isPinned === b.isPinned) return 0;
    return a.isPinned ? -1 : 1;
  });
  setMemos(sorted);
  setStatus('live');
},
```

### src/components/MemoCard.tsx — 핀 버튼 추가
share-btn 앞에 핀 버튼 추가:
```tsx
import { pinMemo, deleteMemo, updateMemo, toggleShare } from '../services/memoService';
import { useToast } from '../hooks/useToast';

// card-actions 내부
<button
  className={`pin-btn ${memo.isPinned ? 'active' : ''}`}
  onClick={async (e) => {
    e.stopPropagation();
    const next = !memo.isPinned;
    try {
      await pinMemo(memo.id, next);
      showToast(next ? '고정됨' : '고정 해제');
    } catch { }
  }}
  title={memo.isPinned ? '고정 해제' : '고정'}
>📌</button>
```

고정 카드 시각 구분 — MemoCard className:
```tsx
className={`memo-card ${memo.isPinned ? 'pinned' : ''}`}
```

### src/index.css 추가
```css
.pin-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 13px;
  padding: 4px 6px;
  border-radius: var(--radius-sm);
  transition: opacity 0.2s, background 0.2s;
  opacity: 0.3;
  line-height: 1;
}

.pin-btn.active { opacity: 1; }
.pin-btn:hover { background: var(--surface-hover); opacity: 0.8; }

.memo-card.pinned {
  border-color: rgba(124, 58, 237, 0.35);
  box-shadow: 0 0 0 1px rgba(124, 58, 237, 0.15);
}
```

## 의존 관계
- `useToast` import → `toast-feedback` task 완료 필요
- Firestore 쿼리 변경 없음 → 새 복합 인덱스 불필요
- `pinMemo`는 `updateDoc`으로 구현 — memoService.ts의 기존 auth guard 패턴 동일

## 수락 조건
- npm run build 성공
- types/index.ts에 isPinned?: boolean 존재
- memoService.ts에 pinMemo 함수 존재
- useMemos에 isPinned 기준 정렬 로직 존재
- MemoCard에 핀 버튼 존재

## 검증 명령
```bash
npm run build
grep -r "isPinned" src/types/index.ts
grep -r "pinMemo" src/services/memoService.ts
grep -r "isPinned" src/hooks/useMemos.ts
```
