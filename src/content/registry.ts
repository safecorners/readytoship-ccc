/**
 * 등록된 가이드와 그 순서. 배열 순서가 곧 학습 경로의 순서다.
 *
 * 가이드를 추가하려면 `src/content/guides/<slug>/`를 만들고 여기에 slug를
 * 더한다. 화면 코드는 건드리지 않는다.
 */
export const GUIDE_SLUGS = ["claude-code-basics"] as const;

export type GuideSlug = (typeof GUIDE_SLUGS)[number];

export function isGuideSlug(value: string): value is GuideSlug {
  return (GUIDE_SLUGS as readonly string[]).includes(value);
}
