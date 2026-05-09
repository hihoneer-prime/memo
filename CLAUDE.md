# 프로젝트 지도

## 개요

Firebase Firestore + Vite 기반 실시간 동기화 메모 웹앱.

## 기술 스택

- **Vite** — 빌드 도구
- **React 18** — UI 프레임워크
- **TypeScript** — 타입 시스템
- **Firebase Firestore** — 실시간 DB (onSnapshot)

## 디렉토리 구조

```
src/
  lib/
    firebase.ts       — Firebase 초기화
  types/
    index.ts          — Memo 인터페이스
  services/
    memoService.ts    — Firestore CRUD 서비스 레이어
  hooks/
    useMemos.ts       — 메모 상태 커스텀 훅
  components/
    Header.tsx        — 헤더 컴포넌트
    MemoInput.tsx     — 메모 입력 컴포넌트
    MemoCard.tsx      — 메모 카드 컴포넌트
  pages/
    HomePage.tsx      — 메인 페이지
  App.tsx             — 앱 루트 컴포넌트
  main.tsx            — 진입점
  index.css           — 전역 스타일
index.html            — HTML 진입점
tsconfig.json         — TypeScript 설정
vite.config.ts        — Vite 설정
docs/                 — 비즈니스 문서
.dev/                 — AI 작업 흔적 (tasks.json, journal/, state/)
```

## 주요 규칙

- 빌드: `npm run build` — 변경 후 반드시 실행
- 파일 300줄 / 함수 20줄 제한
- `.dev/` 는 gitignore 추가 권장

## 참고

- Firebase 프로젝트: `my-memo-6517d`
- Vercel 자동 배포 연결됨
