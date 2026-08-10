## 1. 기반 설정

- [x] 1.1 `npx shadcn@latest init` 실행 — Tailwind v4 / React 19를 올바르게 감지하는지 확인하고 `components.json`, `src/lib/utils.ts`(`cn()`) 생성
- [x] 1.2 `npx shadcn@latest add accordion collapsible button badge card separator` 실행 — Radix 프리미티브 동반 설치 확인
- [x] 1.3 MDX 의존성 설치 (`@next/mdx`, `@mdx-js/loader`, `@mdx-js/react`, `@types/mdx`)
- [x] 1.4 `pretendard` 설치 후 variable woff2 실제 경로 확인 (설치본 기준으로 확인, 경로를 추측하지 말 것)
- [x] 1.5 `next.config.ts` — `createMDX()` 래핑 + `pageExtensions`에 `mdx` 추가. 기존 `reactCompiler: true` 유지
- [x] 1.6 `src/mdx-components.tsx` 생성 — Next 16 시그니처는 `export function useMDXComponents(): MDXComponents`로 **인자를 받지 않음**. 작성 전 `node_modules/next/dist/docs/01-app/02-guides/mdx.md` 확인
- [x] 1.7 `src/app/layout.tsx` — `lang="ko"`, Pretendard(`next/font/local`) + JetBrains Mono(`next/font/google`), 한국어 메타데이터. Next 16 `LayoutProps<"/">` 시그니처 유지
- [x] 1.8 `npm run dev`로 기존 페이지가 여전히 뜨는지 확인 후 다음 단계로

## 2. 디자인 토큰

- [x] 2.1 `src/app/globals.css` — shadcn 시맨틱 변수에 루트 `design.md` 값 주입 (design.md 결정 6의 매핑 표)
- [x] 2.2 `globals.css` — shadcn에 대응 없는 토큰 추가 (canvas-soft, body, hairline-strong, 파스텔 오브 5색) 및 `@theme inline` 매핑
- [x] 2.3 `globals.css` — 디스플레이 스케일을 `@utility` 묶음으로 정의 (display-mega/xl/lg/md/sm, caption-upper)
- [x] 2.4 `globals.css` — 보일러플레이트의 `body { font-family: Arial }` 하드코딩 제거, 폰트 변수 연결
- [x] 2.5 `src/components/ui/button.tsx` — 기본 `rounded-md`를 `rounded-full`로 교체 (루트 design.md는 모든 CTA를 pill로 규정)
- [x] 2.6 `src/components/ui/badge.tsx` — pill + 대문자 캡션 스케일 적용
- [x] 2.7 shadcn 컴포넌트 전반에서 다단계 그림자 유틸 제거하고 단일 그림자 단계만 사용

## 3. 콘텐츠 계층

- [x] 3.1 `src/content/schema.ts` — 가이드/챕터/스텝/명령어 타입과 `defineGuideMeta()` 작성
- [x] 3.2 `src/content/schema.ts` — 런타임 검증 작성: 식별자 중복, 빈 명령어, 잘못된 가이드 참조. 오류 메시지에 가이드·스텝 식별자 포함
- [x] 3.3 `src/content/schema.ts` — 정규화 작성: `steps`가 빈 챕터에 암묵 체크 단위 1건 생성 (`implicit: true`)
- [x] 3.4 `src/content/registry.ts` — 가이드 순서 정의
- [x] 3.5 `src/lib/guides.ts` — 동적 import 로더 작성. 확장자를 리터럴로 유지. 스텝 본문 부재를 검증 오류로 처리
- [x] 3.6 `src/content/guides/claude-code-basics/guide.mdx` — 챕터 3개 / 체크 단위 6개 구조 선언 및 인트로 본문
- [x] 3.7 스텝 본문 작성: 클로드 데스크탑 설치하기
- [x] 3.8 스텝 본문 작성: Git 설치하기 (git-scm.com 링크 + `git --version`)
- [x] 3.9 스텝 본문 작성: Node.js 설치하기 (`node --version`, `npm --version`, 권한 관련 명령). **design.md Open Question 1** — 권한 명령의 의미를 OS 분기 초안으로 작성하고 검토 대상으로 표시
- [x] 3.10 스텝 본문 작성: 깃허브 저장소 만들기
- [x] 3.11 스텝 본문 작성: 깃허브 저장소 클론하기 (`git clone`)
- [x] 3.12 챕터 3 본문 작성: 클로드 코드에서 프로젝트 열어보기. **design.md Open Question 2** — 초안으로 작성하고 검토 대상으로 표시

## 4. 진행률 상태

- [x] 4.1 `src/lib/progress.ts` — `useSyncExternalStore` 스토어 작성. `getSnapshot()`이 캐시된 참조를 반환하는지 확인 (매번 새 객체 반환 시 무한 렌더)
- [x] 4.2 `progress.ts` — `getServerSnapshot()`이 빈 상태를 반환하도록 작성
- [x] 4.3 `progress.ts` — `storage` 이벤트 구독으로 탭 간 동기화, 내부 emitter로 같은 탭 전파
- [x] 4.4 `progress.ts` — 읽기·쓰기를 try/catch로 감싸 저장소 장애 시에도 화면이 동작하도록 처리
- [x] 4.5 `progress.ts` — 챕터별·전체 진행률 집계 헬퍼 작성

## 5. MDX 렌더링 컴포넌트

- [x] 5.1 `src/components/mdx/` — `CodeBlock`(복사 포함), `Callout`, `ExternalLink`, `Chip`/`ChipPath` 작성
- [x] 5.2 `src/mdx-components.tsx` — h2~h4/p/ul/ol/li/a/code/pre 기본 매핑을 디자인 토큰에 맞춰 연결
- [x] 5.3 긴 명령어·코드가 자체 영역에서만 스크롤되고 페이지를 가로로 밀지 않는지 확인

## 6. 가이드 컴포넌트

- [x] 6.1 `SiteHeader` — 브랜드 워드마크 "밀크티쉐이크" + 학습 경로 링크
- [x] 6.2 `GuideHero` — 제목·요약 + 파스텔 오브 장식(`aria-hidden`, `pointer-events: none`)
- [x] 6.3 `CheckCircle` — `role="checkbox"` + `aria-checked` + 스크린리더 라벨. 스텝과 암묵 챕터가 공용. 터치 대상 44px 확보
- [x] 6.4 `ChapterCounter` — 스토어 구독, `aria-live="polite"`, 전부 완료 시 반전 표현
- [x] 6.5 `ChapterAccordion` — Radix Accordion `type="multiple"`. 좌측 4px 레일(미완료 hairline-strong / 열림·완료 ink), 원형 번호 배지
- [x] 6.6 `StepRow` — Radix Collapsible. 접힌 상태에서 내부 컨트롤이 포커스를 받지 않는지 확인
- [x] 6.7 `CommandCard` — 명령어 + 복사 컨트롤 + 성공 후 원복. 클립보드 실패 시 조용히 성공으로 보이지 않게 처리
- [x] 6.8 `GuideToc` — 챕터 목록 + 진행 표시. 클릭 시 해당 챕터 펼침 + 스크롤
- [x] 6.9 `NextStepCard` — 이어질 가이드가 없을 때의 마무리 표현 포함
- [x] 6.10 `PathStep` — 학습 경로 화면의 단계 항목 (진행 표시 + 상세 챕터로 이동)

## 7. 페이지

- [ ] 7.1 `src/app/page.tsx` — 랜딩. 보일러플레이트 전면 교체. 워드마크·헤드라인·한 문단·학습 경로 CTA
- [ ] 7.2 `src/app/guides/page.tsx` — 학습 경로. 챕터를 단계형 수직 목록으로, 각 단계는 상세의 해당 챕터로 이동
- [ ] 7.3 `src/app/guides/[slug]/page.tsx` — 가이드 상세. `generateStaticParams` + `dynamicParams = false`
- [ ] 7.4 챕터 딥링크 — 해시가 있는 주소로 진입 시 해당 챕터가 펼쳐지고 그 위치로 스크롤되도록 처리
- [ ] 7.5 등록되지 않은 slug 접근 시 404 확인

## 8. 폴리시

- [ ] 8.1 `ProgressBootScript` — 인라인 스크립트로 첫 페인트 전 `data-done`과 카운터 텍스트 반영. 작성 전 `node_modules/next/dist/docs/01-app/02-guides/preventing-flash-before-hydration.md` 확인
- [ ] 8.2 완료 상태의 시각 표현을 전부 `[data-done="true"]` CSS 선택자로 옮겨 스크립트가 클래스를 몰라도 되게 처리
- [ ] 8.3 대상 요소에 `suppressHydrationWarning` 부여
- [ ] 8.4 `prefers-reduced-motion`에서 펼침·접힘 애니메이션 제거
- [ ] 8.5 포커스 링 — `:focus-visible`에서만, 잉크 색 + offset 적용

## 9. 검증

- [ ] 9.1 `npm run build` 성공 및 `/guides/claude-code-basics`가 정적 렌더(SSG)로 표시되는지 빌드 로그 확인
- [ ] 9.2 콘텐츠 검증 확인 — 스텝 식별자를 일부러 중복시키고 빌드가 실패하는지, 오류 메시지가 원인을 짚는지 확인 후 되돌리기
- [ ] 9.3 콘텐츠 검증 확인 — 스텝 본문 파일을 일시 제거하고 빌드가 실패하는지 확인 후 되돌리기
- [ ] 9.4 `npm run lint` 통과
- [ ] 9.5 스텝 체크 → 챕터 카운터 즉시 증가, 새로고침 후 유지
- [ ] 9.6 스텝 없는 챕터가 자체로 체크되고 전체가 6개로 집계되는지 확인
- [ ] 9.7 진행 이력이 있는 상태로 새로고침 시 `0/6 → 3/6` 깜빡임이 없는지 확인
- [ ] 9.8 브라우저 콘솔에 hydration 경고가 없는지 확인
- [ ] 9.9 두 탭에서 한쪽 체크 시 다른 탭에 반영되는지 확인
- [ ] 9.10 저장된 값을 일부러 손상시킨 뒤 페이지가 정상 렌더되는지 확인
- [ ] 9.11 명령어 복사 → 붙여넣기 결과가 표시된 문자열과 일치하는지 확인
- [ ] 9.12 학습 경로의 단계 클릭 → 상세의 해당 챕터가 펼쳐진 상태로 이동하는지 확인
- [ ] 9.13 키보드만으로 전체 순회, 포커스 링이 항상 보이는지 확인
- [ ] 9.14 375 / 768 / 1280px 폭에서 가로 스크롤이 없는지 확인
- [ ] 9.15 시각 언어 점검 — 볼드 디스플레이, 채도 높은 버튼 채움, 파스텔의 비장식 용도가 어디에도 없는지 확인
- [ ] 9.16 Open Question 2건(권한 명령의 의미, 챕터 3 본문)의 초안을 사용자에게 검토 요청
