## Context

동기와 범위는 `proposal.md`를, 행위 계약은 `specs/`의 네 파일을 참조한다. 이 문서는 그 요구를 어떤 구조로 만족시킬지만 다룬다.

설계를 제약하는 현재 상태:

- 레포는 create-next-app 보일러플레이트다. Next.js 16.3.0 / React 19.2.8 / TypeScript 5.9.3 / Tailwind CSS v4.3.3 / React Compiler 활성. `src/app/`에 `layout.tsx`, `page.tsx`, `globals.css`뿐이고 `components/`·`lib/`·테스트 설정이 없다.
- Tailwind는 v4의 CSS-first 방식이라 `tailwind.config.*` 파일이 없다. 모든 토큰은 `globals.css`의 `@theme`에 들어가야 한다.
- Next.js 16은 학습 데이터와 API·규약이 다르다. MDX 설정과 hydration 처리는 `node_modules/next/dist/docs/`의 번들 문서를 근거로 삼는다.
- **레포 루트 `design.md`는 ElevenLabs 디자인 시스템 원본이다.** 이 문서(`openspec/changes/add-tutorial-site/design.md`)와 파일명이 같지만 별개이며, 루트 쪽은 읽기 전용 참조다.
- 참조한 레퍼런스 사이트(`docs/reference/`의 스크린샷 3장)는 보라·민트 채도의 볼드 프로덕트 UI다. 루트 `design.md`는 잉크 단색·weight 300 에디토리얼을 강제한다. 둘은 양립하지 않는다.

## Goals / Non-Goals

**Goals**

- 콘텐츠 추가가 화면 코드 수정 없이 이뤄지는 구조
- 진행률 집계가 본문 파싱 결과에 의존하지 않는 단일 출처를 갖는 구조
- shadcn 컴포넌트를 기본값 그대로 썼을 때 자동으로 루트 `design.md` 룩이 나오는 토큰 배치
- 클라이언트 경계를 잎 컴포넌트로 최소화

**Non-Goals**

- 콘텐츠 편집 UI, 콘텐츠 CMS 연동
- 여러 가이드를 전제한 검색·필터·태그 (가이드는 현재 1개)
- 테스트 프레임워크 도입 — 이번 change는 빌드 검증과 수동 확인으로 검수한다
- 애니메이션 체계 수립 (루트 `design.md`도 모션 타이밍을 범위 밖으로 둔다)

## Decisions

### 1. 콘텐츠 구조는 MDX의 ESM export, 본문은 스텝별 파일

`guide.mdx` 상단에 `export const meta = defineGuideMeta({...})`로 챕터·스텝·명령어 트리를 선언하고, 각 스텝 본문은 `steps/<step-id>.mdx`에 둔다.

```
src/content/
  schema.ts                    타입 + defineGuideMeta() + 검증 + 정규화
  registry.ts                  가이드 순서
  guides/claude-code-basics/
    guide.mdx                  export const meta / 본문: 인트로
    steps/<step-id>.mdx        스텝 본문
```

**왜 ESM export인가.** `@next/mdx`는 YAML frontmatter를 지원하지 않지만 ESM export는 네이티브로 지원하며 `import Body, { meta } from '...mdx'`로 외부에서 읽을 수 있다(Next 16 `02-guides/mdx.md`). 대안이던 `remark-frontmatter`/`gray-matter`는 의존성이 늘고, YAML은 중첩 트리 표현이 JS 객체 리터럴보다 나쁘다.

**왜 스텝 본문을 분리하는가.** 스텝이 체크 단위이므로 본문도 스텝 단위로 주소 지정돼야 한다. 한 파일에 몰면 스텝 경계를 찾기 위해 MDX AST를 파싱해야 하고, 그 순간 진행률 집계가 파싱 결과에 의존해 깨지기 쉬워진다. 지금 배치에서는 **집계와 목차가 오직 `meta`에서 나오고 본문은 렌더링 전용**이라 둘이 독립적이다. 대가는 파일 수 증가인데, 스텝당 한 파일은 문서 사이트의 통상적 형태이고 콘텐츠 추가 절차를 단순하게 만든다.

**로딩.** `await import(\`@/content/guides/${slug}/guide.mdx\`)` 형태의 동적 import를 쓴다. Next 16이 App Router용으로 공식 문서화한 패턴이며, `generateStaticParams` + `dynamicParams = false`와 함께 쓴다. 확장자는 리터럴로 남겨야 번들러가 컨텍스트 모듈을 만든다.

### 2. 타입 안전성은 런타임 validator가 담당

MDX 파일은 `tsc`가 검사하지 않는다 — `@types/mdx`가 export를 `any`로 준다. 따라서 `defineGuideMeta()`는 작성 시 IDE 힌트만 제공하고, 실제 보증은 로더가 호출하는 검증 함수가 한다. 검증은 빌드 중 서버에서 실행되므로 위반 시 빌드가 실패한다(`specs/guide-content` — 콘텐츠 검증).

zod 같은 스키마 라이브러리 대신 손으로 작성한다. 검증 대상이 고정된 소수의 규칙(식별자 중복, 본문 부재, 빈 명령어, 잘못된 참조)이고, 의존성을 하나 덜 늘리는 편이 낫다.

### 3. 스텝 없는 챕터는 로딩 시 암묵 스텝으로 정규화

`steps`가 비어 있는 챕터에는 로더가 `{ id: chapterId, title: chapter.title, implicit: true }` 한 건을 만들어 넣는다. 덕분에 집계·저장·토글 로직이 "체크 단위" 하나의 개념만 다루면 되고, 화면만 `implicit`일 때 중첩 목록 대신 챕터 헤더에 컨트롤을 놓는다.

대안은 챕터와 스텝을 각각 체크 가능하게 만드는 것이었는데, 집계 규칙이 두 갈래가 되고 저장 키도 이원화된다.

### 4. 진행률 공유는 `useSyncExternalStore`

완료 상태를 구독하는 지점은 스텝 체크 원, 챕터 카운터, 학습 경로 항목, 가이드 목차로 서로 멀리 떨어져 있다. Context Provider로 감싸면 가이드 상세의 트리 대부분이 클라이언트 경계로 끌려온다. 외부 스토어를 쓰면 **구독하는 잎 컴포넌트만** 클라이언트로 남는다.

- 저장 키 `mts:progress:v1`, 값 `{ [guideSlug]: string[] }`. 버전 접두사로 이후 마이그레이션 여지를 남긴다
- `getSnapshot()`은 캐시된 참조를 돌려준다. 매번 새 객체를 만들면 무한 렌더 루프에 빠진다
- `getServerSnapshot()`은 항상 빈 상태를 돌려준다
- 탭 간 동기화는 `storage` 이벤트로, 같은 탭 안의 전파는 내부 emitter로 처리한다
- 읽기·쓰기는 전부 try/catch로 감싼다(`specs/guide-progress` — 저장소 장애 시 동작 유지)

### 5. 깜빡임 제거는 인라인 부트 스크립트

서버는 항상 `0/N`으로 렌더하므로 그대로 두면 hydration 후 값이 튄다. Next 16이 권장하는 방식(`02-guides/preventing-flash-before-hydration.md`)을 따른다.

1. 체크 요소에 `data-item-id`, 카운터에 `data-counter`를 부여한다
2. 서버 컴포넌트가 `dangerouslySetInnerHTML`로 인라인 스크립트를 심고, 브라우저가 HTML을 파싱하며 **첫 페인트 전에** 동기 실행해 `data-done`과 카운터 텍스트를 고친다
3. 해당 요소에 `suppressHydrationWarning`을 단다
4. 시각 표현은 전부 `[data-done="true"]` CSS 선택자에서 나오게 해서, 스크립트가 클래스 이름을 알 필요가 없게 한다

4번이 핵심이다. 스크립트가 클래스를 조작하면 스타일이 바뀔 때마다 스크립트를 따라 고쳐야 하지만, 속성 하나만 세우면 스타일은 CSS에만 산다.

`useEffect`로 미루는 대안은 hydration 오류는 피하지만 깜빡임이 남아 요구를 만족하지 못한다. 서버 쿠키로 옮기는 대안은 요구에 없는 서버 상태를 도입한다.

**단계 분리**: 스토어만으로도 기능은 완전하고 깜빡임만 남는다. 따라서 스토어를 먼저 완성하고 부트 스크립트는 마지막 폴리시 단계로 뺀다.

### 6. shadcn 시맨틱 변수에 루트 `design.md` 값을 주입

shadcn 컴포넌트는 `--background`, `--primary`, `--border` 같은 시맨틱 변수를 읽는다. 이 변수들에 루트 `design.md` 값을 꽂으면 shadcn 컴포넌트가 **기본값 그대로도** 원하는 룩을 낸다. 별도 토큰 체계를 병행하고 컴포넌트마다 클래스를 덮어쓰는 대안보다 누수가 적다.

| shadcn 변수 | 값 | 루트 design.md 대응 |
|---|---|---|
| `--background` | `#f5f5f5` | canvas |
| `--foreground` | `#0c0a09` | ink |
| `--card` | `#ffffff` | surface-card |
| `--primary` | `#292524` | primary (잉크 pill) |
| `--secondary` / `--muted` / `--accent` | `#f0efed` | surface-strong |
| `--muted-foreground` | `#777169` | muted |
| `--border` | `#e7e5e4` | hairline |
| `--input` | `#d6d3d1` | hairline-strong |
| `--ring` | `#0c0a09` | ink |

여기에 shadcn에 대응이 없는 토큰(canvas-soft, body, 파스텔 오브 5색)을 별도 변수로 추가한다.

**반드시 덮어쓸 shadcn 기본값** — 컴포넌트 소스가 레포에 복사되므로 직접 편집이 정상 워크플로우다.
- `button` — 기본 `rounded-md` → `rounded-full`. 루트 `design.md`는 모든 CTA를 pill로 못박는다
- `badge` — pill + 대문자 캡션 스케일
- `accordion` — 기본 `border-b` 행 스타일을 카드 + 좌측 레일 구조로 교체
- 그림자 — shadcn의 다단계 그림자 유틸을 걷어내고 단일 단계만 남긴다

### 7. 디스플레이 스케일은 `@utility` 묶음으로 노출

루트 `design.md`의 디스플레이 5단계는 크기·weight·행간·자간이 한 묶음이다. `text-[64px] font-light tracking-[-1.92px] leading-[1.05]`처럼 유틸리티를 조합하게 두면 weight 300 규칙이 언젠가 새어나간다. `@utility display-mega` 같은 묶음 유틸로 정의해 한 클래스가 네 속성을 함께 강제하게 한다.

### 8. 레퍼런스 채도 → 잉크 단색 번역

`specs/guide-ui`의 "시각 언어 준수"와 "색에 의존하지 않는 상태 구분"을 만족시키는 구체적 매핑이다.

| 레퍼런스 | 이 사이트 |
|---|---|
| 챕터 좌측 보라·파랑 4px 레일 | 레일 유지. 미완료 hairline-strong, 열림·완료 ink |
| 원형 번호 배지 | surface-strong 배경 + ink 숫자. 완료 시 ink 배경 + 흰 체크 |
| 진행률 pill | surface-strong + 대문자 캡션. 전부 완료 시 ink 반전 |
| 연보라 프롬프트 패널 | 명령어 카드: canvas-soft + hairline + lavender 오브 옅은 방사형, 본문은 고정폭 |
| 민트 강조 카드 | canvas-soft + hairline + mint 오브 옅은 방사형 |
| 스텝 체크 빈 원 | hairline-strong 링 → 완료 시 ink 채움 + 흰 체크 |
| 보라 아웃라인 pill | 투명 + hairline-strong 보더 + ink 텍스트 |
| 히어로 배경 | sky·peach 오브 두 개를 낮은 투명도로 |

파스텔은 방사형 그라디언트 분위기로만 등장한다. 버튼 채움·텍스트 색·카드 배경 채움에는 쓰지 않는다.

### 9. 폰트는 Pretendard 단일 자체 호스팅

루트 `design.md`가 지정한 Waldenburg와 Inter는 둘 다 한글 글리프가 없다. 한국어 전용 사이트이므로 한·영을 모두 감당하면서 weight 300이 존재하는 Pretendard로 대체한다 — weight 300이 있어야 에디토리얼 시그니처가 유지된다. npm 패키지를 자체 호스팅해 외부 요청과 CSP 문제를 피한다. 코드는 JetBrains Mono.

### 10. Radix 기반 접힘 컴포넌트

아코디언·콜랩서블을 손으로 만들면 `aria-expanded`/`aria-controls`/키보드 처리를 직접 관리해야 하고 접힌 영역의 포커스 처리에서 실수하기 쉽다. shadcn이 감싼 Radix 프리미티브를 쓰고, 남는 부분(체크 컨트롤의 `role="checkbox"`, 진행률의 라이브 리전, 포커스 링)만 직접 처리한다.

## Risks / Trade-offs

**동적 import가 컨텍스트 모듈에 의존한다** → 경로에 변수 구간이 두 곳(`${slug}`, `${stepId}`) 있어 번들러가 넓은 글롭 컨텍스트를 만든다. 매칭되는 MDX가 전부 번들에 포함되지만, 콘텐츠가 이번 change 기준 7개 파일이라 실질 비용이 없다. 문제가 되면 가이드별 정적 import 레지스트리로 전환한다 — 로더 인터페이스는 그대로 두므로 화면 코드는 영향이 없다.

**MDX가 타입 검사 밖에 있다** → `defineGuideMeta()`의 힌트만 믿으면 오타가 런타임까지 간다. 완화: 로더의 검증을 빌드 경로에 두어 잘못된 콘텐츠가 배포되지 않게 하고, 검증 실패 메시지에 가이드·스텝 식별자를 포함해 원인을 바로 짚게 한다.

**색 없이 상태를 구분하면 스캔 속도가 떨어진다** → 레퍼런스가 색으로 즉시 전달하던 완료 여부를 형태로만 전달하게 된다. 완화: 형태(빈 링 vs 채운 원), 체크 아이콘, 레일 굵기, 카운터 반전 네 신호를 겹친다. 실제로 보고 부족하면 체크 아이콘에만 시맨틱 success 색을 도입하는 것이 최소 개입 탈출구다 — 루트 `design.md`가 정의해 둔 토큰이라 시각 언어를 깨지 않는다.

**부트 스크립트와 `suppressHydrationWarning`은 조합이 깨지기 쉽다** → 서버 마크업과 스크립트가 같은 속성·같은 텍스트 형식을 가정한다. 한쪽만 바뀌면 조용히 어긋난다. 완화: 스크립트가 만지는 표면을 `data-done` 속성과 카운터 텍스트 두 가지로만 한정하고, 시각 표현은 CSS에 둔다. 검수 항목에 hydration 경고 부재를 명시했다.

**shadcn 컴포넌트를 수정한 뒤 재설치하면 덮어쓰인다** → `button`, `badge`, `accordion`은 기본값을 크게 벗어난다. 완화: 어떤 파일의 어떤 기본값을 왜 바꿨는지 위 6번에 기록해 두고, 재설치가 필요하면 이 목록을 기준으로 다시 적용한다.

**두 개의 `design.md`** → 루트 것은 시각 언어 원본, 이 문서는 change 설계다. 완화: 참조할 때 항상 전체 경로로 구분하고, 루트 파일은 이번 change에서 읽기 전용으로 다룬다.

**진행 상황이 기기 간 공유되지 않는다** → 브라우저 로컬 저장의 필연적 결과다. 로그인 없는 사이트라는 선택의 대가이며 `specs/guide-progress`에 의도된 제약으로 명시했다.

## Migration Plan

기존 기능이 없는 신규 구축이라 데이터 마이그레이션이 없다. 배포는 Vercel 기본 흐름을 따른다.

되돌리기: 이번 change는 보일러플레이트를 교체하므로, 문제가 생기면 배포를 이전 커밋으로 롤백한다. 학습자 진행 데이터는 브라우저에만 있어 롤백으로 유실되지 않으며, 저장 키에 붙인 `v1` 접두사가 이후 구조 변경 시 구분자 역할을 한다.

## Open Questions

콘텐츠 세부 사항 두 가지였다. 둘 다 검토를 받아 확정했다.

1. **"권한 인증 커맨드"의 정확한 의미** — 사용자가 준 목차에서 Node.js 설치 스텝에 딸린 항목이었다. **확정: 윈도우 PowerShell 실행 정책 오류 해결.** `Set-ExecutionPolicy RemoteSigned -Scope CurrentUser`를 "오류가 났을 때만 치는 명령"으로 두고, 왜 막히는지와 적용 범위가 현재 사용자 계정뿐이라는 점을 함께 적은 초안을 그대로 간다. 맥의 npm 전역 설치 권한(EACCES)은 이번 범위에 넣지 않는다.
2. **챕터 3 "클로드 코드에서 프로젝트 열어보기"의 본문** — 하위 스텝 없이 챕터 제목만 주어졌었다. **확정: 흐름은 초안대로 두되 세 개의 스텝으로 쪼갠다** — 프로젝트 폴더 열기 / 폴더 접근 권한 승인하기 / 첫 질문 던지기. 설치 단계와 마찬가지로 중간에 멈췄다 돌아오는 지점이 세 곳이라, 챕터 하나를 통째로 체크하게 두면 어디까지 했는지가 남지 않는다.

   그 결과 전체 체크 단위가 6개에서 8개로 늘었다. `proposal.md`와 `specs/guide-progress`의 수치를 함께 고쳤다.

   **결정 3(스텝 없는 챕터의 암묵 정규화)은 그대로 둔다.** 첫 가이드가 더 이상 그 경로를 타지 않지만, 규칙을 걷어내면 스텝을 나눌 만큼 길지 않은 챕터가 나올 때 집계 로직이 다시 두 갈래가 된다. 계층의 계약으로 남기고 `specs/guide-content`에 그 사실을 적었다.
