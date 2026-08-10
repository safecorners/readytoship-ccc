# 밀크티쉐이크

클로드 코드 입문 튜토리얼 사이트. 설치부터 첫 프로젝트를 열어보는 순간까지를 여덟 단계로 쪼개고, 하나 끝낼 때마다 체크해 나가는 형태다. 진행 상황은 브라우저에 남아 다음에 와도 하던 자리부터 이어갈 수 있다.

프로덕션: **https://readytoship-ccc.vercel.app**

## 개발

```bash
npm install
npm run dev
```

http://localhost:3000 을 연다.

```bash
npm run build   # 프로덕션 빌드. 튜토리얼 콘텐츠 검증도 여기서 돈다
npm run lint    # ESLint. `next build`는 린트를 돌리지 않으므로 따로 실행한다
```

## 구조

| 경로 | 내용 |
|---|---|
| `src/app/` | App Router — 랜딩 `/`, 학습 경로 `/guides`, 가이드 상세 `/guides/[slug]` |
| `src/content/` | 튜토리얼 콘텐츠. `schema.ts`(구조·검증), `registry.ts`(가이드 순서), `guides/<slug>/` |
| `src/components/` | `ui/`(shadcn), `guide/`(체크리스트), `mdx/`(본문 렌더링) |
| `src/lib/` | 콘텐츠 로더, 진행률 스토어 |
| `design.md` | 시각 언어 원본. UI 작업 시 참조하며 읽기 전용으로 다룬다 |
| `openspec/` | 확정 스펙(`specs/`)과 변경 이력(`changes/archive/`) |

콘텐츠를 추가할 때는 `src/content/guides/<slug>/`를 만들고 `registry.ts`에 slug를 더한다. 화면 코드는 건드리지 않는다.

## 배포

Vercel Git 연동으로 자동 배포된다. 수동으로 배포 명령을 실행할 일은 없다.

| 언제 | 무엇이 |
|---|---|
| `main`에 병합 | 프로덕션 배포 → https://readytoship-ccc.vercel.app |
| 브랜치 push | 그 브랜치만의 프리뷰 주소로 배포. PR에 링크가 붙는다 |

빌드 설정(Next.js 프리셋, `npm run build`, Node 24.x)은 Vercel 프로젝트 설정에 있다. 저장소에는 `vercel.json`/`vercel.ts`를 두지 않는다 — 근거는 `openspec/specs/deploy-pipeline/spec.md`와 해당 change의 design.md에 있다.

### 병합을 막는 검증

`main`은 브랜치 보호가 걸려 있고, 아래 두 체크가 모두 통과해야 병합할 수 있다.

| 필수 체크 | 출처 | 덮는 것 |
|---|---|---|
| `Vercel` | Vercel Git 연동이 자동으로 올림 | 프로덕션 빌드, 튜토리얼 콘텐츠 검증 |
| `lint` | `.github/workflows/lint.yml` | ESLint |

둘로 나눈 이유는 `next build`가 ESLint를 돌리지 않기 때문이다. Vercel 체크만으로는 린트 오류가 그대로 통과한다.

브랜치 보호는 저장소 설정이라 git 히스토리에 남지 않는다. 현재 값:

- 필수 상태 체크: `Vercel`, `lint`
- 병합 전 최신 `main` 반영 강제(`strict`): 끔
- 관리자 우회(`enforce_admins`): 허용

확인하려면:

```bash
gh api repos/safecorners/readytoship-ccc/branches/main/protection
```

## 작업 규약

기능 작업은 코드보다 명세가 먼저다. `AGENTS.md`와 `openspec/`의 OpenSpec 워크플로를 따른다.
