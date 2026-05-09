# 메모장

Firebase Firestore + Vite 기반의 실시간 동기화 메모 웹앱.

## 기능

- 메모 작성 / 삭제
- Firebase Firestore 실시간 동기화 (onSnapshot)
- 작성 시각 표시
- Ctrl+Enter 단축키로 메모 추가

## 기술 스택

- **Vite** — 빌드 도구
- **React 18** — UI 프레임워크
- **TypeScript** — 타입 시스템
- **Firebase Firestore** — 실시간 DB

## 프로젝트 구조

```
src/
  lib/firebase.ts       — Firebase 초기화
  types/index.ts        — Memo 인터페이스
  services/memoService.ts — Firestore CRUD 서비스
  hooks/useMemos.ts     — 메모 상태 커스텀 훅
  components/           — Header, MemoInput, MemoCard
  pages/HomePage.tsx    — 메인 페이지
  App.tsx / main.tsx    — 앱 루트 및 진입점
```

## 개발 실행

```bash
npm install
npm run dev
```

## 빌드

```bash
npm run build
```
