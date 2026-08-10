## Why

현재 레포는 create-next-app 보일러플레이트 상태로, `src/app/`의 세 파일 외에는 아무 기능이 없다. "밀크티쉐이크" 브랜드로 Claude Code 입문 튜토리얼을 제공하려면 사이트 전체를 처음부터 세워야 한다.

입문자가 겪는 실제 문제는 정보 부족이 아니라 **어디까지 했는지 잃어버리는 것**이다. 클로드 데스크탑·Git·Node.js 설치는 여러 세션에 걸쳐 진행되고, 중간에 이탈했다가 돌아오면 처음부터 다시 읽게 된다. 따라서 읽는 문서가 아니라 **체크해 나가는 체크리스트**로 만들고, 진행 상황이 브라우저에 남게 한다.

## What Changes

- **랜딩 페이지(`/`)** 신설 — 헤드라인 + 한 문단 + 학습 경로로 유도하는 미니멀 진입점
- **학습 경로 페이지(`/guides`)** 신설 — 튜토리얼의 챕터를 단계형 수직 리스트로 나열하고 각 단계의 완료 여부를 표시
- **가이드 상세 페이지(`/guides/[slug]`)** 신설 — 챕터 아코디언 + 스텝 체크리스트 + 명령어 복사 카드 + 사이드 목차 + 다음 단계 카드
- **MDX 콘텐츠 파이프라인** 도입 — 챕터/스텝 구조는 `export const meta`로, 본문은 스텝별 MDX 파일로 관리. 빌드 시 런타임 검증
- **localStorage 진행률 추적** 도입 — 로그인 없이 체크 상태를 브라우저에 보존하고 탭 간 동기화
- **디자인 시스템 구현** — 레포 루트 `design.md`(ElevenLabs)의 토큰을 Tailwind v4 `@theme`에 매핑하고, shadcn/ui 컴포넌트가 이를 상속하도록 정합화
- **첫 튜토리얼 콘텐츠** 작성 — "클로드 코드 시작하기" 가이드 1개(3개 챕터, 체크 단위 8개)
- 신규 의존성 추가 — shadcn/ui(Radix), `@next/mdx` 계열, `lucide-react`, Pretendard, JetBrains Mono

의도적으로 **범위에서 제외**한 것: 영상 임베드·유튜브 연동, 로그인/계정, 다국어, 다크 모드, 프롬프트 변수 치환 카드. 레퍼런스 사이트에는 있으나 이번 튜토리얼의 성격(설치 중심, 한국어 전용)에 맞지 않아 뺀다.

## Capabilities

### New Capabilities

- `guide-content`: MDX 기반 튜토리얼 콘텐츠의 구조 정의, 로딩, 런타임 검증. 챕터·스텝·명령어의 데이터 모델과 하위 스텝이 없는 챕터의 정규화 규칙을 포함한다.
- `guide-progress`: 학습자의 완료 상태를 localStorage에 보존하고 여러 화면에 일관되게 노출한다. 탭 간 동기화와 서버 렌더 후 첫 페인트 전 반영을 포함한다.
- `guide-ui`: `design.md` 토큰의 구현과 체크리스트 UI 컴포넌트. 레퍼런스의 채도 높은 색을 잉크 단색 시각 언어로 번역하는 규칙과 접근성 요구사항을 포함한다.
- `site-pages`: 랜딩·학습 경로·가이드 상세 세 라우트의 구성과 상호 이동 규칙.

### Modified Capabilities

없음. `openspec/specs/`가 비어 있어 기존 capability가 존재하지 않는다.

## Impact

**신규 코드**
- `src/content/` — 스키마, 레지스트리, 가이드 MDX
- `src/lib/` — 콘텐츠 로더, 진행률 스토어, `cn()` 유틸
- `src/components/ui/` — shadcn 컴포넌트
- `src/components/guide/`, `src/components/mdx/` — 도메인 컴포넌트
- `src/app/guides/` — 두 라우트
- `src/mdx-components.tsx` — App Router에서 `@next/mdx` 사용 시 필수 파일

**수정**
- `next.config.ts` — MDX 플러그인 래핑, `pageExtensions` 추가 (`reactCompiler: true` 유지)
- `src/app/globals.css` — 디자인 토큰으로 전면 교체
- `src/app/layout.tsx` — `lang="ko"`, 폰트, 메타데이터
- `src/app/page.tsx` — 보일러플레이트를 랜딩으로 교체

**의존성** — `@next/mdx`, `@mdx-js/loader`, `@mdx-js/react`, `@types/mdx`, `lucide-react`, `class-variance-authority`, `clsx`, `tailwind-merge`, `tw-animate-css`, Radix 프리미티브(shadcn 설치분), `pretendard`

**참조하되 수정하지 않는 것** — 레포 루트 `design.md`는 ElevenLabs 디자인 시스템 원본이다. 이 change의 `design.md`와 파일명이 같으나 별개 문서이며, 루트 쪽은 읽기 전용으로 다룬다.

**제약** — Next.js 16은 학습 데이터와 API·규약이 다르다. MDX 설정, `useMDXComponents` 시그니처, hydration 처리는 `node_modules/next/dist/docs/`의 해당 가이드를 확인한 뒤 작성한다.
