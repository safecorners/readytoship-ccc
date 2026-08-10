/**
 * 챕터 딥링크.
 *
 * 학습 경로의 단계와 가이드 목차는 둘 다 "상세의 이 챕터"를 가리켜야 한다.
 * 주소로 가리킬 수 있어야 한다는 요구(`specs/site-pages` — 챕터 딥링크)라
 * 해시를 쓰고, 아코디언이 해시를 읽어 해당 챕터를 펼친다.
 */

const ANCHOR_PREFIX = "chapter-";

/** 챕터 카드의 DOM id */
export function chapterAnchorId(chapterId: string): string {
  return `${ANCHOR_PREFIX}${chapterId}`;
}

/** 상세 화면의 특정 챕터를 가리키는 주소 */
export function chapterHref(guideSlug: string, chapterId: string): string {
  return `/guides/${guideSlug}#${chapterAnchorId(chapterId)}`;
}

/** 주소의 해시에서 챕터 id를 되찾는다. 챕터를 가리키지 않으면 `null` */
export function chapterIdFromHash(hash: string): string | null {
  const raw = decodeURIComponent(hash.replace(/^#/, ""));
  return raw.startsWith(ANCHOR_PREFIX) ? raw.slice(ANCHOR_PREFIX.length) : null;
}

/**
 * 이미 열려 있는 상세 화면 안에서 챕터를 펼쳐 달라는 요청.
 *
 * 목차는 같은 페이지 안의 링크라 해시가 같으면 `hashchange`가 뜨지 않는다.
 * 아코디언과 목차가 서로를 import하지 않고 만나도록 이벤트로 붙인다.
 */
export const OPEN_CHAPTER_EVENT = "mts:open-chapter";

export function requestOpenChapter(chapterId: string): void {
  window.dispatchEvent(
    new CustomEvent(OPEN_CHAPTER_EVENT, { detail: chapterId })
  );
}
