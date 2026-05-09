# Changelog

## 2026-05-10

- Google 로그인 및 계정별 메모 분리 (task: auth-firebase)
  - Firebase Auth Google 팝업 로그인
  - useAuth 훅 — 3-state (undefined/null/User) 인증 상태 관리
  - Firestore 보안 규칙 — userId 기반 소유권, 불변 필드 보호

- 메모 인라인 수정 기능 (task: memo-edit)
  - 카드 클릭 → textarea 편집 모드 전환
  - Ctrl+Enter 저장 / Escape 취소
  - updateMemo 서비스 + updatedAt 타임스탬프

- 메모 공유 링크 (task: memo-share)
  - 🔗 토글 버튼으로 공개/비공개 전환
  - 공개 시 /share/:id URL 클립보드 자동 복사
  - SharedMemoPage — 비로그인 접근 가능

- 다크 글래스모피즘 UI 디자인 (task: ui-redesign)
  - Inter 웹폰트 + CSS 디자인 토큰 21개
  - 카드 fadeUp 스태거 애니메이션
  - 로그인 풀스크린 레이아웃, 빈 상태 아이콘
  - focus-visible 키보드 접근성, prefers-reduced-motion 지원
  - 모바일 반응형 (375px 이상)

## 2026-05-09

- React + TypeScript 전환 (task: setup-react)
  - Vanilla JS → React 18 + TypeScript 마이그레이션
  - src/lib/firebase.ts — Firebase 초기화
  - src/types/index.ts — Memo 인터페이스 정의
  - src/services/memoService.ts — Firestore 서비스 레이어 분리
  - src/hooks/useMemos.ts — 메모 상태 커스텀 훅
  - src/components/ — Header, MemoInput, MemoCard 컴포넌트
  - src/pages/HomePage.tsx — 메인 페이지
  - tsconfig.json, vite.config.ts 추가
  - src/main.js, src/firebase.js 제거

- README, CHANGELOG 추가
- Firebase Firestore 실시간 동기화 메모장 초기 구현
  - 메모 추가 / 삭제
  - onSnapshot 실시간 리스너
  - Ctrl+Enter 단축키 지원
  - 작성 시각 포맷 표시
