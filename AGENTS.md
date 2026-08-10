<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Project Guidelines

- 한국어로 말해주세요.

## OpenSpec

이 레포는 **OpenSpec**(schema: `spec-driven`)으로 변경을 관리한다. 기능 작업은 코드를 먼저 쓰지 말고 `openspec/changes/<change-name>/`의 명세를 먼저 세운다.

**구조**

```
openspec/
  config.yaml              프로젝트 컨텍스트 — 아티팩트 생성 시 AI에게 주어진다
  specs/                   확정된 capability 명세 (아카이브된 change가 여기로 합류)
  changes/<name>/
    proposal.md            왜 / 무엇이 바뀌나 / 영향 범위
    design.md              어떤 구조로 만족시킬지. 결정과 그 근거, 리스크
    specs/<capability>/spec.md   행위 계약 (Requirement + Scenario)
    tasks.md               페이즈별 체크리스트. 구현의 단일 진행 상태
```

**작업 흐름** — 슬래시 커맨드로 진입한다.

| 커맨드 | 언제 |
|---|---|
| `/opsx:explore` | 아이디어를 정리하고 요구를 밝힐 때 |
| `/opsx:propose` | 새 change의 아티팩트 4종을 한 번에 만들 때 |
| `/opsx:update` | 기존 change의 계획을 수정하고 아티팩트 간 정합을 맞출 때 |
| `/opsx:apply` | `tasks.md`를 따라 구현할 때 |
| `/opsx:sync` | delta 스펙을 `openspec/specs/`에 반영할 때 |
| `/opsx:archive` | 구현이 끝난 change를 마무리할 때 |

**규칙**

- `tasks.md`가 진행 상태의 유일한 출처다. 태스크를 끝낼 때마다 그 자리에서 `- [ ]` → `- [x]`로 바꾼다. 나중에 몰아서 하지 않는다.
- 구현 중 설계 문제가 드러나면 코드로 우회하지 말고 멈춘다. `design.md`·`spec.md`를 먼저 고치고 이어간다.
- 스펙의 시나리오는 검수 기준이다. 시나리오가 못박은 수치(예: "체크 단위 6개")를 바꾸려면 스펙을 함께 고쳐야 한다.
- `design.md`의 Open Question은 초안을 쓰고 **검토 대상으로 표시**한 뒤 사용자에게 확인받는다. 임의로 확정하지 않는다.
- 레포 루트 `design.md`는 ElevenLabs 디자인 시스템 원본이다. change 폴더의 `design.md`와 파일명이 같으나 별개 문서이며, 루트 쪽은 **읽기 전용**으로 다룬다. 참조할 때는 항상 전체 경로로 구분한다.

## Commit & PR

- 한국어로 커밋메시지와 PR을 작성해주세요.
- **`tasks.md`의 페이즈 하나가 끝날 때마다 커밋한다.** 여러 페이즈를 한 커밋에 몰지 않는다. 되돌릴 지점을 페이즈 경계에 두기 위한 것이므로, 각 커밋은 그 시점에서 `npm run build`가 통과해야 한다.
- 커밋에는 해당 페이즈의 파일과 그 페이즈까지 체크된 `tasks.md`만 담는다.
- 커밋 메시지 본문에는 무엇을 했는지보다 **왜 그렇게 했는지**를 적는다. 특히 `design.md`의 결정과 다르게 간 부분, 계획에 없던 판단은 근거를 남긴다.
