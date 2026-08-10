## Why

Vercel 연동은 이미 동작 중이다 — `main`에 병합하면 프로덕션에 배포되고, 브랜치를 push하면 프리뷰 주소가 생긴다. 그런데 이 규칙이 저장소 어디에도 적혀 있지 않다. 대시보드 설정으로만 존재하므로 누가 꺼도 알아챌 방법이 없고, 새로 합류한 사람은 배포가 어떻게 일어나는지 코드에서 읽어낼 수 없다.

기록하려고 들여다보니 구멍이 하나 드러났다. `main`에 브랜치 보호가 없다. 지금까지 병합된 두 PR은 필수 체크 없이 들어갔고, 빌드가 깨진 상태로도 병합이 가능하다. 콘텐츠 검증이 빌드 시점에 돌도록 만들어 뒀는데(`guide-content` — 콘텐츠 검증), 그 검증이 실패해도 병합을 막지 못하면 잘못된 가이드가 프로덕션까지 간다.

## What Changes

- **배포 규칙을 capability 스펙으로 고정** — 프로덕션 배포, 프리뷰 배포, 병합 게이트를 행위 계약으로 남긴다. 이미 동작하는 것도 포함한다. 계약이 있어야 설정이 바뀌었을 때 무엇이 어긋났는지 말할 수 있다.
- **병합 게이트 도입** — `main` 브랜치 보호를 켜고 필수 체크 두 개를 건다. Vercel 배포 상태(빌드·콘텐츠 검증)와 lint 결과다.
- **lint 워크플로 추가** — `next build`는 ESLint를 돌리지 않으므로 Vercel 체크만으로는 lint가 검사되지 않는다. PR에서 lint만 돌리는 가벼운 GitHub Actions 잡을 둔다.
- **README에 배포 절 추가** — 프로덕션 주소, 배포가 언제 일어나는지, 병합을 막는 체크가 무엇인지. create-next-app 보일러플레이트 문구도 함께 정리한다.

기존 동작을 바꾸지 않는다. 배포 파이프라인은 지금 그대로 돌고, 달라지는 것은 병합 전에 통과해야 할 조건이 생긴다는 점뿐이다.

## Capabilities

### New Capabilities

- `deploy-pipeline`: 저장소의 변경이 배포에 도달하는 경로. 프로덕션·프리뷰 배포가 언제 일어나는지, 그리고 검증에 실패한 변경이 `main`에 들어가지 못하게 막는 규칙을 담는다.

### Modified Capabilities

없음. 기존 네 capability(`guide-content`, `guide-progress`, `guide-ui`, `site-pages`)의 요구는 그대로다. 콘텐츠 검증이 병합을 막는다는 규칙은 `guide-content`의 빌드 실패 요구를 배포 경로에서 이어받는 것이라 `deploy-pipeline` 쪽에 둔다.

## Impact

**신규 파일**
- `.github/workflows/lint.yml` — PR에서 `npm ci && npm run lint`

**수정**
- `README.md` — 배포 절 추가, 보일러플레이트 정리

**저장소 설정** (파일 아님)
- `main` 브랜치 보호 — 필수 상태 체크 `Vercel`, lint 잡

**건드리지 않는 것**
- `next.config.ts`, `package.json`, Vercel 대시보드의 빌드 설정. 빌드 설정을 `vercel.ts`로 옮기는 일은 이번 범위 밖이다(근거는 design.md의 Non-Goals).
