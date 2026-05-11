# delete-confirm: 삭제 확인 인라인 UX

## 배경
현재 × 버튼을 누르면 즉시 deleteMemo가 호출된다. 실수로 눌렀을 때 복구 불가.
인라인 확인 UI를 추가해 실수 방지. 모달 없이 카드 내부에서 처리.

## 현재 코드 구조

- `src/components/MemoCard.tsx` (92줄)
  - 줄 17-26: useState(editing, draft) 선언부
  - 줄 83-88: 삭제 버튼 — 클릭 즉시 `deleteMemo(memo.id)` 호출
    ```tsx
    <button
      className="del-btn"
      onClick={e => { e.stopPropagation(); deleteMemo(memo.id); }}
      title="삭제"
    >
      ×
    </button>
    ```
  - 줄 62-90: card-actions div 전체

## 변경 범위

| 파일 | 변경 유형 | 줄 범위 | 내용 |
|------|----------|---------|------|
| `src/components/MemoCard.tsx` | 수정 | 17-20, 83-88 | confirmDelete state 추가, 삭제 버튼 로직 변경 |
| `src/index.css` | 수정 | 끝에 추가 | confirm UI 스타일 |

## 구현 방향

### MemoCard.tsx — state 추가 (줄 17 근처)
```tsx
// Before
const [editing, setEditing] = useState(false);
const [draft, setDraft] = useState(memo.text);

// After
const [editing, setEditing] = useState(false);
const [draft, setDraft] = useState(memo.text);
const [confirmDelete, setConfirmDelete] = useState(false);
```

useEffect로 1.5초 자동 취소:
```tsx
useEffect(() => {
  if (!confirmDelete) return;
  const t = setTimeout(() => setConfirmDelete(false), 1500);
  return () => clearTimeout(t);
}, [confirmDelete]);
```

### MemoCard.tsx — 삭제 버튼 교체 (줄 83-88)
```tsx
// Before
<button
  className="del-btn"
  onClick={e => { e.stopPropagation(); deleteMemo(memo.id); }}
  title="삭제"
>×</button>

// After
{confirmDelete ? (
  <div className="delete-confirm" onClick={e => e.stopPropagation()}>
    <button className="confirm-yes" onClick={() => deleteMemo(memo.id)}>삭제</button>
    <button className="confirm-no" onClick={() => setConfirmDelete(false)}>취소</button>
  </div>
) : (
  <button
    className="del-btn"
    onClick={e => { e.stopPropagation(); setConfirmDelete(true); }}
    title="삭제"
  >×</button>
)}
```

카드 외부 클릭으로 취소 — MemoCard의 onClick에 조건 추가:
```tsx
onClick={() => { if (confirmDelete) { setConfirmDelete(false); return; } if (!editing) setEditing(true); }}
```

### src/index.css 추가
```css
.delete-confirm {
  display: flex;
  gap: 4px;
  align-items: center;
}

.confirm-yes {
  padding: 3px 8px;
  font-size: 11px;
  font-weight: 600;
  font-family: var(--font);
  background: var(--danger);
  color: #fff;
  border: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
}

.confirm-no {
  padding: 3px 8px;
  font-size: 11px;
  font-weight: 500;
  font-family: var(--font);
  background: var(--surface-hover);
  color: var(--text-muted);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  cursor: pointer;
}
```

## 의존 관계
- MemoCard.tsx만 수정 (독립 task)
- editing 상태와 공존 — confirmDelete와 editing은 독립 상태

## 수락 조건
- npm run build 성공
- × 버튼 클릭 시 즉시 삭제하지 않음
- confirmDelete state가 MemoCard에 존재
- 1.5초 자동 취소 타이머 존재

## 검증 명령
```bash
npm run build
grep -r "confirmDelete" src/components/MemoCard.tsx
```
