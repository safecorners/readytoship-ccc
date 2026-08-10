/**
 * 진행 상태가 저장소·DOM과 만나는 지점의 이름들.
 *
 * 부트 스크립트는 서버 컴포넌트가 문자열로 심고(`design.md` 결정 5), 스토어는
 * 클라이언트에서 돈다. 둘이 같은 이름을 봐야 하는데 `progress.ts`는
 * `useSyncExternalStore`를 import하므로 서버 그래프에서 읽을 수 없다.
 * 그래서 이름만 여기로 뺀다.
 *
 * 부트 스크립트가 손대는 표면은 딱 두 가지다 — `data-done` 속성과
 * `data-counter` 요소의 텍스트. 색·굵기 같은 시각 표현은 전부 CSS의
 * `[data-done="true"]` 선택자에서 나오므로 스크립트는 클래스 이름을 모른다.
 */

/** `v1` 접두사는 이후 구조 변경 시 구분자 역할을 한다 */
export const PROGRESS_STORAGE_KEY = "mts:progress:v1";

/** 완료 여부를 표시할 요소가 어느 가이드에 속하는지 */
export const GUIDE_ATTR = "data-guide";

/**
 * 이 요소가 대신 말하는 체크 단위 id 목록(쉼표 구분).
 *
 * 체크 원은 자기 단위 하나만, 챕터 카운터·챕터 카드는 챕터의 전체 단위를
 * 담는다. 부트 스크립트는 이 목록만 보고 `data-done`을 세우므로 요소의
 * 역할을 따로 알 필요가 없다.
 */
export const UNITS_ATTR = "data-units";

/** 나열된 단위가 전부 완료면 `"true"` */
export const DONE_ATTR = "data-done";

/** 이 속성이 있으면 텍스트도 `완료수/전체수`로 고쳐 쓴다 */
export const COUNTER_ATTR = "data-counter";

/** 카운터 텍스트 형식. 부트 스크립트도 같은 형식을 만들어야 한다 */
export function formatCounter(done: number, total: number): string {
  return `${done}/${total}`;
}

/** `data-units`에 넣을 문자열. 파싱은 부트 스크립트가 같은 구분자로 한다 */
export function serializeUnits(unitIds: readonly string[]): string {
  return unitIds.join(",");
}
