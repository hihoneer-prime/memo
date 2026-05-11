# Changelog

## 2026-05-11

- 서비스명 pinax로 변경, Space Grotesk 브랜드 폰트 적용

- 토스트 알림 시스템 (task: toast-feedback)
  - 공유 ON → '링크 복사됨!', 공유 OFF → '공유 해제됨' 토스트
  - 2.5초 자동 소멸, 슬라이드인 애니메이션

- 메모 실시간 검색 (task: memo-search)
  - 검색어 입력 시 즉시 클라이언트 사이드 필터링
  - × 버튼으로 초기화, 결과 없을 때 안내 메시지

- 삭제 확인 인라인 UX (task: delete-confirm)
  - × 클릭 → 삭제/취소 버튼 인라인 표시
  - 1.5초 경과 또는 카드 외부 클릭 시 자동 취소

- 메모 고정 기능 (task: memo-pin)
  - 📌 버튼으로 중요 메모 상단 고정
  - 고정 카드 보라색 테두리 시각 구분
  - '고정됨' / '고정 해제' 토스트 피드백

- 공유 페이지 pinax 브랜딩 (task: share-page-redesign)
  - 상단 pinax 로고 (Space Grotesk)
  - 메모 작성 날짜 표시
  - 'pinax로 아이디어 기록하기 →' CTA

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
