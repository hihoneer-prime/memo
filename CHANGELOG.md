# Changelog

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
