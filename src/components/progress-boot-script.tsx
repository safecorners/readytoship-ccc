import {
  COUNTER_ATTR,
  DONE_ATTR,
  GUIDE_ATTR,
  PROGRESS_STORAGE_KEY,
  UNITS_ATTR,
  UNITS_SEPARATOR,
} from "@/lib/progress-keys";

/**
 * 첫 페인트 전에 저장된 진행 상황을 화면에 반영한다.
 *
 * 서버는 브라우저 저장소를 볼 수 없어 항상 `0/N`으로 렌더한다. 그대로 두면
 * 하이드레이션 뒤에 값이 튀어 `0/6 → 3/6` 깜빡임이 남는다. Next가 권장하는
 * 방식(`02-guides/preventing-flash-before-hydration.md`)대로 인라인 스크립트를
 * 심어 브라우저가 HTML을 파싱하는 동안 동기 실행시킨다.
 *
 * 이 스크립트가 손대는 것은 두 가지뿐이다 — `data-done` 속성과 `data-counter`
 * 요소의 텍스트. 시각 표현은 전부 CSS의 `[data-done="true"]`에서 나오므로
 * 스타일이 바뀌어도 여기를 따라 고칠 일이 없다(`design.md` 결정 5).
 *
 * 본문 뒤에 놓아야 한다. 실행 시점에 대상 요소가 이미 파싱돼 있어야 한다.
 */

// 규칙은 하나다: `data-units`를 가진 모든 요소에 대해 나열된 체크 단위 중 몇
// 개가 완료됐는지 세고, 전부면 `data-done="true"`. 요소가 체크 원인지 카운터인지
// 스크립트는 알 필요가 없다.
const BOOT_SCRIPT = `(function(){try{
var raw=localStorage.getItem(${JSON.stringify(PROGRESS_STORAGE_KEY)});
if(!raw)return;
var state=JSON.parse(raw);
if(!state||typeof state!=="object")return;
var nodes=document.querySelectorAll("[${UNITS_ATTR}]");
for(var i=0;i<nodes.length;i++){
var el=nodes[i];
var ids=el.getAttribute("${UNITS_ATTR}").split(${JSON.stringify(UNITS_SEPARATOR)});
var done=state[el.getAttribute("${GUIDE_ATTR}")];
if(!Array.isArray(done))done=[];
var n=0;
for(var j=0;j<ids.length;j++)if(done.indexOf(ids[j])!==-1)n++;
el.setAttribute("${DONE_ATTR}",n===ids.length?"true":"false");
if(el.hasAttribute("${COUNTER_ATTR}"))el.textContent=n+"/"+ids.length;
}
}catch(e){}})()`;

export function ProgressBootScript() {
  return <script dangerouslySetInnerHTML={{ __html: BOOT_SCRIPT }} />;
}
