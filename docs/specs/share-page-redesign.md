# share-page-redesign: 공유 페이지 pinax 브랜딩 개선

## 배경
현재 공유 페이지(/share/:id)는 "공유된 메모"라는 텍스트만 있고 pinax 브랜딩이 없다.
외부에서 공유 링크를 받아 처음 접속하는 사용자가 보는 첫 화면이라 중요하다.

## 현재 코드 구조

- `src/pages/SharedMemoPage.tsx` (37줄)
  - 줄 27-36: 성공 렌더링 — "공유된 메모" h2 + shared-card
  - 줄 21-25: null 렌더링 — 단순 텍스트만
  - 줄 15-19: undefined(로딩) — 단순 텍스트

- `src/index.css`
  - 줄 443-490: `.shared-page`, `.shared-content`, `.shared-heading`, `.shared-card`, `.shared-not-found` 스타일

## 변경 범위

| 파일 | 변경 유형 | 내용 |
|------|----------|------|
| `src/pages/SharedMemoPage.tsx` | 수정 | 전체 — pinax 로고, 날짜, CTA 추가 |
| `src/index.css` | 수정 | 공유 페이지 스타일 개선, CTA 버튼 추가 |

## 구현 방향

### SharedMemoPage.tsx 전체 재작성

```tsx
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPublicMemo } from '../services/memoService';
import type { Memo } from '../types';

function formatDate(ts: Memo['createdAt']): string {
  if (!ts) return '';
  const d = ts.toDate();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())}`;
}

function SharedLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="shared-page">
      <div className="shared-content">
        <div className="shared-brand">
          <Link to="/" className="shared-logo brand">pinax</Link>
        </div>
        {children}
        <div className="shared-cta">
          <Link to="/" className="shared-cta-link">
            pinax로 아이디어 기록하기 →
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function SharedMemoPage() {
  const { id } = useParams<{ id: string }>();
  const [memo, setMemo] = useState<Memo | null | undefined>(undefined);

  useEffect(() => {
    if (!id) { setMemo(null); return; }
    getPublicMemo(id).then(setMemo).catch(() => setMemo(null));
  }, [id]);

  if (memo === undefined) return (
    <SharedLayout>
      <div className="shared-loading">불러오는 중...</div>
    </SharedLayout>
  );

  if (memo === null) return (
    <SharedLayout>
      <div className="shared-not-found-msg">
        비공개 메모이거나 존재하지 않습니다.
      </div>
    </SharedLayout>
  );

  return (
    <SharedLayout>
      <div className="shared-card">
        <p className="shared-memo-text">{memo.text}</p>
        <div className="shared-memo-date">{formatDate(memo.createdAt)}</div>
      </div>
    </SharedLayout>
  );
}
```

### src/index.css — 공유 페이지 스타일 교체/추가

기존 `.shared-*` 클래스들을 유지하면서 새 클래스 추가:
```css
.shared-brand {
  margin-bottom: 32px;
}

.shared-logo {
  font-size: 20px;
  color: var(--text);
  text-decoration: none;
  letter-spacing: -0.5px;
}

.shared-memo-text {
  font-size: 15px;
  line-height: 1.7;
  white-space: pre-wrap;
  word-break: break-word;
  color: var(--text);
}

.shared-memo-date {
  font-size: 11px;
  color: var(--text-muted);
  margin-top: 12px;
}

.shared-cta {
  margin-top: 40px;
  text-align: center;
}

.shared-cta-link {
  font-size: 13px;
  color: var(--accent-light);
  text-decoration: none;
  opacity: 0.8;
  transition: opacity 0.2s;
}

.shared-cta-link:hover { opacity: 1; }

.shared-loading,
.shared-not-found-msg {
  color: var(--text-muted);
  font-size: 14px;
  padding: 48px 0;
}
```

## 의존 관계
- `react-router-dom`의 `Link` 사용 (이미 설치됨)
- `Space Grotesk` 폰트 — `.brand` 클래스 (이미 정의됨)
- 독립 task, 의존성 없음

## 수락 조건
- npm run build 성공
- SharedMemoPage에 pinax 로고(Link to="/") 표시
- 메모 날짜 표시
- CTA 링크 존재

## 검증 명령
```bash
npm run build
grep -r "shared-logo" src/pages/SharedMemoPage.tsx
grep -r "shared-cta" src/pages/SharedMemoPage.tsx
```
