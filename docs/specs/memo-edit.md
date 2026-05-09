# memo-edit: 메모 인라인 수정 기능

## 배경

현재 MemoCard는 추가/삭제만 가능하다. 번뜩이는 아이디어를 저장 후 다듬을 수 있어야 하므로 인라인 편집 기능이 필요하다.

## 현재 코드 구조 (setup-react 완료 후 기준)

- `src/services/memoService.ts`: `addMemo`, `deleteMemo`, `subscribeToMemos`만 존재. `updateMemo` 없음
- `src/components/MemoCard.tsx`: 텍스트 표시 + 삭제 버튼만 있음. 편집 상태 없음

## 변경 범위

| 파일 | 변경 유형 | 내용 |
|------|----------|------|
| `src/services/memoService.ts` | 수정 | `updateMemo(id, text)` 함수 추가 |
| `src/components/MemoCard.tsx` | 수정 | 편집 모드 상태 + textarea 전환 + 저장/취소 로직 |

## 구현 방향

### src/services/memoService.ts 추가 함수

```ts
import { updateDoc } from 'firebase/firestore';

export async function updateMemo(id: string, text: string) {
  await updateDoc(doc(db, 'memos', id), { text, updatedAt: serverTimestamp() });
}
```

### src/components/MemoCard.tsx (편집 모드 포함)

```tsx
import { useState } from 'react';
import { deleteMemo, updateMemo } from '../services/memoService';
import type { Memo } from '../types';

interface Props { memo: Memo; }

export default function MemoCard({ memo }: Props) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(memo.text);

  function handleSave() {
    if (draft.trim() && draft !== memo.text) updateMemo(memo.id, draft.trim());
    setEditing(false);
  }

  function handleCancel() {
    setDraft(memo.text);
    setEditing(false);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleSave();
    if (e.key === 'Escape') handleCancel();
  }

  return (
    <div className="memo-item" onClick={() => !editing && setEditing(true)}>
      {editing ? (
        <textarea
          autoFocus
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleSave}
        />
      ) : (
        <div className="memo-text">{memo.text}</div>
      )}
      <div className="memo-meta">{formatDate(memo.createdAt)}</div>
      <button onClick={e => { e.stopPropagation(); deleteMemo(memo.id); }}>×</button>
    </div>
  );
}
```

## 의존 관계

- `src/components/MemoCard.tsx` → `src/services/memoService.ts` (updateMemo)
- `src/services/memoService.ts` → `src/lib/firebase.ts`

## 수락 조건

tasks.json의 acceptance_criteria와 동일.

## 검증 명령

```bash
npm run build
```
