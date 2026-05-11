# PRD — pinax v2: 기능 확장 + UX 완성

## 개요
- 목표: 실사용성을 높이는 핵심 기능 추가 + 액션 피드백/안전장치로 UX 완성
- 범위: src/components, src/pages, src/hooks, src/services, src/types, src/index.css

---

## Phase 1 — 사용성 핵심 개선

- [ ] toast-feedback: 액션 피드백 토스트 알림 시스템
- [ ] memo-search: 메모 실시간 검색/필터
- [ ] delete-confirm: 삭제 확인 인라인 UX

## Phase 2 — 기능 확장 + 브랜딩

- [ ] memo-pin: 중요 메모 상단 고정
- [ ] share-page-redesign: 공유 페이지 pinax 브랜딩 개선

---

## 의존성 순서

```
toast-feedback     (독립)
memo-search        (독립)
delete-confirm     (독립)
memo-pin           → toast-feedback 완료 후 (토스트 재사용)
share-page-redesign (독립, design)
```

---

## v1 완료 이력

- [x] setup-react: Vanilla JS → React + TypeScript 마이그레이션
- [x] auth-firebase: Firebase Auth Google 로그인
- [x] memo-edit: 메모 인라인 수정
- [x] memo-share: 메모 공유 링크
- [x] ui-redesign: 다크 글래스모피즘 디자인 시스템
