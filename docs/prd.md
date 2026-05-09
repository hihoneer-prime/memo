# PRD — 메모장 v2: 아이디어 메모 앱 리부트

## 개요
- **목표**: Vanilla JS 단일 파일 메모장을 React + TypeScript 기반의 트렌디한 아이디어 관리 앱으로 전환
- **범위**: 프로젝트 전체 재구성 (프론트엔드/서비스 레이어 분리, 인증, 수정, 공유)

---

## Phase 1 — 기반 전환

- [ ] setup-react: Vanilla JS → React + TypeScript + Vite 마이그레이션, 프론트엔드/서비스 레이어 디렉토리 구조 구성
- [ ] auth-firebase: Firebase Auth Google 로그인, 계정 기반 메모 소유권

## Phase 2 — 핵심 기능

- [ ] memo-edit: 메모 인라인 수정 기능 (기존 추가/삭제에 편집 추가)
- [ ] memo-share: 메모 공유 링크 생성 (공개/비공개 토글 + 공유 URL)

## Phase 3 — 디자인 완성

- [ ] ui-redesign: 트렌디한 UI 디자인 시스템 — 감각적인 레이아웃, 애니메이션, 타이포그래피

---

## 의존성 순서

```
setup-react → auth-firebase → memo-edit ┐
                            → memo-share ┘ → ui-redesign
```

## 목표 아키텍처

```
src/
  components/     ← 프론트엔드: 순수 UI
  pages/          ← 프론트엔드: 페이지 단위
  hooks/          ← 프론트엔드: React 상태 훅
  services/       ← 백엔드 레이어: Firebase 호출 추상화
  types/          ← 공유 타입 정의
  lib/            ← Firebase 초기화
  App.tsx
  main.tsx
```
