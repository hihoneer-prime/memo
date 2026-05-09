# 메모장

Firebase Firestore + React 기반의 실시간 동기화 아이디어 메모 웹앱.

## 기능

- Google 계정 로그인 (Firebase Auth)
- 메모 작성 / 수정 / 삭제 (계정별 분리)
- 메모 공유 링크 생성 (공개/비공개 토글)
- Firebase Firestore 실시간 동기화 (onSnapshot)
- 다크 글래스모피즘 UI + 카드 스태거 애니메이션
- Ctrl+Enter 단축키로 메모 추가
- 모바일 반응형 (375px 이상)

## 기술 스택

- **Vite** — 빌드 도구
- **React 18** — UI 프레임워크
- **TypeScript** — 타입 시스템
- **Firebase Firestore** — 실시간 DB
- **Firebase Auth** — Google 로그인
- **React Router v6** — 클라이언트 라우팅

## 프로젝트 구조

```
src/
  lib/firebase.ts           — Firebase 초기화
  types/index.ts            — Memo 인터페이스
  services/
    memoService.ts          — Firestore CRUD + 공유 서비스
    authService.ts          — Google 로그인/로그아웃
  hooks/
    useMemos.ts             — 메모 상태 커스텀 훅
    useAuth.ts              — 인증 상태 커스텀 훅
  components/               — Header, MemoInput, MemoCard
  pages/
    HomePage.tsx            — 메인 페이지
    LoginPage.tsx           — 로그인 페이지
    SharedMemoPage.tsx      — 공유 메모 공개 페이지
  App.tsx / main.tsx        — 앱 루트 및 진입점
firestore.rules             — Firestore 보안 규칙
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
