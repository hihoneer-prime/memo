# memo-search: 메모 실시간 검색/필터

## 배경
메모가 쌓일수록 원하는 내용을 찾기 어렵다. 클라이언트 사이드 텍스트 검색을 추가해
즉각적인 필터링을 제공한다.

## 현재 코드 구조

- `src/pages/HomePage.tsx` (39줄)
  - 줄 11: `const { memos, status } = useMemos(user.uid);`
  - 줄 23-36: `memos.map((m, i) => <MemoCard ...>)` — 필터링 없이 전체 렌더링

- `src/components/MemoInput.tsx` (39줄)
  - 줄 26-38: textarea + 추가 버튼 — SearchBar는 이 아래, MemoInput 위에 위치

## 변경 범위

| 파일 | 변경 유형 | 내용 |
|------|----------|------|
| `src/components/SearchBar.tsx` | 신규 | 검색 입력 컴포넌트 |
| `src/pages/HomePage.tsx` | 수정 | query 상태 + filteredMemos 도출 + SearchBar 추가 |
| `src/index.css` | 수정 | 검색바 스타일 추가 |

## 구현 방향

### src/components/SearchBar.tsx (신규)
```tsx
interface Props {
  value: string;
  onChange: (v: string) => void;
}

export default function SearchBar({ value, onChange }: Props) {
  return (
    <div className="search-bar">
      <input
        type="text"
        className="search-input"
        placeholder="메모 검색..."
        value={value}
        onChange={e => onChange(e.target.value)}
      />
      {value && (
        <button className="search-clear" onClick={() => onChange('')} aria-label="검색 초기화">
          ×
        </button>
      )}
    </div>
  );
}
```

### src/pages/HomePage.tsx 수정

```tsx
// Before (줄 11)
const { memos, status } = useMemos(user.uid);

// After
const { memos, status } = useMemos(user.uid);
const [query, setQuery] = useState('');
const filteredMemos = query.trim()
  ? memos.filter(m => m.text.toLowerCase().includes(query.toLowerCase()))
  : memos;
```

```tsx
// Before (줄 21-22, MemoInput 아래)
<MemoInput />
<div className="memo-list">

// After
<MemoInput />
<SearchBar value={query} onChange={setQuery} />
<div className="memo-list">
```

```tsx
// Before (줄 24-35)
{memos.length === 0 ? <empty-state> : memos.map(...)}

// After
{filteredMemos.length === 0 ? (
  query ? (
    <div className="empty-state">
      <p>'{query}'에 맞는 메모가 없습니다</p>
    </div>
  ) : (
    <div className="empty-state">
      <span className="icon">&#10022;</span>
      <p>첫 번째 아이디어를 기록해보세요</p>
    </div>
  )
) : filteredMemos.map((m, i) => <MemoCard key={m.id} memo={m} index={i} />)}
```

### src/index.css 추가
```css
/* Search Bar */
.search-bar {
  position: relative;
  margin-bottom: 16px;
}

.search-input {
  width: 100%;
  padding: 10px 36px 10px 14px;
  font-size: 13px;
  font-family: var(--font);
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  color: var(--text);
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.search-input:focus {
  border-color: var(--border-focus);
  box-shadow: 0 0 0 3px var(--accent-glow);
}

.search-input::placeholder { color: var(--text-placeholder); }

.search-clear {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--text-muted);
  font-size: 16px;
  cursor: pointer;
  line-height: 1;
  padding: 2px;
}
```

## 의존 관계
- `HomePage.tsx`가 `SearchBar` import
- `useMemos`에서 오는 `memos` 배열을 클라이언트 사이드 필터링 (Firestore 쿼리 변경 없음)

## 수락 조건
- npm run build 성공
- src/components/SearchBar.tsx 존재
- HomePage에 query 상태 + filteredMemos 도출 로직 존재
- 검색어 입력 시 memo.text 기준 필터링

## 검증 명령
```bash
npm run build
grep -r "SearchBar" src/pages/HomePage.tsx
grep -r "filteredMemos" src/pages/HomePage.tsx
```
