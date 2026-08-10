## 1. lint 체크 워크플로

- [x] 1.1 `.github/workflows/lint.yml` 작성 — `pull_request` 트리거, `actions/checkout` + `actions/setup-node`(npm 캐시) → `npm ci` → `npm run lint`. **빌드는 넣지 않는다** (design.md 결정 1: Vercel이 이미 빌드를 돌린다)
- [x] 1.2 잡 이름을 고정하고, 그 이름이 브랜치 보호의 필수 체크 이름으로 쓰인다는 사실을 파일 주석에 남긴다 (이름을 바꾸면 오지 않는 체크를 기다리게 된다)
- [x] 1.3 로컬에서 `npm run lint`가 통과하는지 확인 — 워크플로가 처음부터 빨갛게 뜨지 않도록
- [x] 1.4 `npm run build` 통과 확인 후 커밋

## 2. README 배포 절

- [x] 2.1 `README.md`에 배포 절 추가 — 프로덕션 주소, `main` 병합 시 자동 배포, 브랜치 push 시 프리뷰 배포
- [x] 2.2 병합을 막는 필수 체크 두 개(`Vercel`, lint 잡 이름)와 그 각각이 무엇을 덮는지 명시. 브랜치 보호는 git에 남지 않으므로 설정값도 함께 적는다 (design.md 결정 3)
- [x] 2.3 create-next-app 보일러플레이트 문구 정리 — 이 저장소가 무엇인지, 어떻게 띄우는지로 교체
- [x] 2.4 `npm run build` 통과 확인 후 커밋

## 3. PR 올리고 체크 확인

- [x] 3.1 PR 생성 후 프리뷰 배포가 만들어지고 `Vercel` 체크가 붙는지 확인 (`gh api repos/:owner/:repo/commits/<sha>/status`)
- [x] 3.2 lint 잡이 체크 목록에 나타나고 통과하는지 확인 (`gh api .../check-runs`)
- [x] 3.3 프리뷰 배포가 Ready이고, 인증 없는 접근이 내용을 보지 못하는지 확인 (`specs/deploy-pipeline` — 권한 없는 접근은 내용을 보지 못한다). 구현 중 드러난 제약이라 스펙·design.md·README를 먼저 고쳤다 (design.md 결정 4)
- [x] 3.4 병합

## 4. 브랜치 보호

파일 변경이 아니라 저장소 설정이다. 워크플로가 `main`에 올라간 뒤에 켠다 — 순서가 반대면 아직 없는 체크를 기다리며 그 PR 자신이 멎는다.

- [x] 4.1 `gh api -X PUT repos/safecorners/readytoship-ccc/branches/main/protection`로 보호 설정. 필수 상태 체크 `Vercel`과 lint 잡 이름, `strict` 여부는 design.md를 따른다
- [x] 4.2 `enforce_admins`는 design.md **Open Question 1**의 초안값(`false`)으로 두고 검토 대상으로 표시
- [x] 4.3 `GET /branches/main/protection`이 404가 아니라 설정값을 돌려주는지 확인

## 5. 게이트 검증

스펙의 병합 게이트 시나리오를 실제로 밟는다. 확인 후 반드시 되돌린다.

- [x] 5.1 린트 규칙을 일부러 위반한 커밋을 PR에 올려 lint 체크가 실패하고 병합이 막히는지 확인 후 되돌리기 (`specs/deploy-pipeline` — 린트 오류가 병합을 막는다)
- [x] 5.2 스텝 식별자를 일부러 중복시킨 커밋으로 Vercel 빌드가 실패하고 병합이 막히는지 확인 후 되돌리기 (— 잘못된 콘텐츠는 프로덕션에 닿지 못한다)
- [x] 5.3 두 체크가 모두 초록일 때 병합이 허용되는지 확인 (— 검증을 모두 통과하면 병합할 수 있다)
- [x] 5.4 병합 후 프로덕션에 반영되는지 확인 — `curl -s -o /dev/null -w "%{http_code}" https://readytoship-ccc.vercel.app/guides/claude-code-basics` → 200
- [x] 5.5 README만 보고 배포 방식을 알 수 있는지 훑어 확인 (— 저장소만 보고 배포 방식을 안다)
- [ ] 5.6 design.md **Open Question 1**(관리자 우회 허용 여부)의 초안을 사용자에게 검토 요청
