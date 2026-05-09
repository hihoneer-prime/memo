# ui-redesign: 트렌디한 UI 디자인 시스템 전면 적용

## 배경

모든 기능 구현 완료 후 전체 컴포넌트에 감각적인 비주얼 시스템을 적용한다. 다크 배경 + 바이올렛 액센트 + 글래스모피즘 카드 + 스태거 애니메이션으로 트렌디한 아이디어 메모 앱을 완성한다.

## 디자인 방향

- **배경**: `#0f0f13` (딥 다크)
- **액센트**: `#7c3aed` → `#a855f7` (바이올렛 그라디언트)
- **카드**: 반투명 글래스 (`rgba(255,255,255,0.05)`) + `backdrop-filter: blur(12px)` + `border: 1px solid rgba(255,255,255,0.08)`
- **타이포**: Inter (라틴) + Pretendard (한글) 웹폰트
- **애니메이션**: 카드 등장 stagger (0.05s delay씩), hover lift effect

## 변경 범위

| 파일 | 변경 유형 | 내용 |
|------|----------|------|
| `index.html` | 수정 | 웹폰트 link 태그, body 기본 배경색 |
| `src/index.css` | 신규 | 전역 CSS 변수 + 리셋 + 유틸리티 |
| `src/components/Header.tsx` | 수정 | 디자인 시스템 클래스 적용 |
| `src/components/MemoCard.tsx` | 수정 | 글래스 카드, 편집 모드 스타일, 공유 아이콘 버튼 |
| `src/components/MemoInput.tsx` | 수정 | 다크 textarea, 그라디언트 추가 버튼 |
| `src/pages/LoginPage.tsx` | 수정 | 풀스크린 센터, Google 로그인 버튼 스타일 |
| `src/pages/HomePage.tsx` | 수정 | 스태거 애니메이션, Empty State |
| `src/pages/SharedMemoPage.tsx` | 수정 | 공유 메모 전용 심플 레이아웃 |

## 구현 방향

### src/index.css (CSS 변수 정의)

```css
:root {
  --bg: #0f0f13;
  --surface: rgba(255, 255, 255, 0.05);
  --border: rgba(255, 255, 255, 0.08);
  --accent: #7c3aed;
  --accent-light: #a855f7;
  --text: #f0f0f0;
  --text-muted: rgba(255, 255, 255, 0.4);
  --font: 'Inter', 'Pretendard', -apple-system, sans-serif;
  --radius: 14px;
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

body {
  background: var(--bg);
  color: var(--text);
  font-family: var(--font);
  min-height: 100vh;
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}
```

### 카드 글래스 스타일 (MemoCard)

```css
.memo-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 16px 18px;
  backdrop-filter: blur(12px);
  cursor: pointer;
  transition: transform 0.15s, box-shadow 0.15s;
  animation: fadeUp 0.3s ease both;
}
.memo-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 32px rgba(124, 58, 237, 0.15);
}
```

### 스태거 애니메이션 (HomePage)

```tsx
{memos.map((memo, i) => (
  <MemoCard key={memo.id} memo={memo} style={{ animationDelay: `${i * 0.05}s` }} />
))}
```

### Empty State

```tsx
{memos.length === 0 && (
  <div className="empty-state">
    <span>✦</span>
    <p>첫 번째 아이디어를 기록해보세요</p>
  </div>
)}
```

### 로그인 페이지

```tsx
<div className="login-page">
  <div className="login-card">
    <h1>✦ 메모</h1>
    <p>아이디어를 기록하고 공유하세요</p>
    <button onClick={signInWithGoogle} className="google-btn">
      Google로 계속하기
    </button>
  </div>
</div>
```

## 반응형 기준

- 기본: max-width 640px, padding 24px
- 모바일(≤480px): padding 16px, 카드 패딩 축소

## 수락 조건

tasks.json의 acceptance_criteria와 동일.

## 검증 명령

```bash
npm run build
```
