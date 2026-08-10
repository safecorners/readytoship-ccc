import type { ComponentType } from "react";

import { GUIDE_SLUGS, isGuideSlug, type GuideSlug } from "@/content/registry";
import {
  GuideContentError,
  validateGuideMeta,
  type NormalizedGuide,
} from "@/content/schema";

/**
 * MDX 콘텐츠 로더. 서버에서만 호출한다.
 *
 * 동적 import의 확장자는 리터럴로 남겨야 번들러가 컨텍스트 모듈을 만든다.
 * 경로를 변수로 조립하되 `.mdx`는 항상 문자열에 붙어 있어야 한다는 뜻이다.
 */

type MDXContent = ComponentType<Record<string, unknown>>;

export type LoadedGuide = {
  /** 레지스트리로 좁혀진 slug. `loadUnitBody()`에 그대로 넘길 수 있다 */
  slug: GuideSlug;
  guide: NormalizedGuide;
  /** `guide.mdx`의 본문 — 가이드 인트로 */
  Intro: MDXContent;
};

export async function loadGuide(slug: string): Promise<LoadedGuide> {
  if (!isGuideSlug(slug)) {
    throw new GuideContentError(
      `가이드 "${slug}"는 레지스트리(src/content/registry.ts)에 등록되지 않았습니다`
    );
  }

  const mod = await import(`@/content/guides/${slug}/guide.mdx`);
  const guide = validateGuideMeta(mod.meta, GUIDE_SLUGS);

  // 폴더명과 선언된 slug가 어긋나면 주소와 콘텐츠가 조용히 갈라진다.
  if (guide.slug !== slug) {
    throw new GuideContentError(
      `가이드 "${slug}": 폴더는 "${slug}"인데 meta.slug가 "${guide.slug}"입니다`
    );
  }

  return { slug, guide, Intro: mod.default as MDXContent };
}

/**
 * 체크 단위 하나의 본문을 읽는다. 암묵 체크 단위(스텝 없는 챕터)도 챕터 id를
 * 파일명으로 쓰므로 같은 경로 규칙을 탄다.
 *
 * 구조에는 선언되어 있으나 대응하는 파일이 없으면 모듈을 찾지 못해 실패하는데,
 * 그대로 두면 원인을 알 수 없는 에러가 나므로 가이드·스텝 식별자를 담은
 * 검증 오류로 바꿔 던진다.
 */
export async function loadUnitBody(
  slug: GuideSlug,
  unitId: string
): Promise<MDXContent> {
  try {
    const mod = await import(`@/content/guides/${slug}/steps/${unitId}.mdx`);
    return mod.default as MDXContent;
  } catch (cause) {
    throw new GuideContentError(
      `가이드 "${slug}" · 스텝 "${unitId}": 본문 파일이 없습니다 ` +
        `(src/content/guides/${slug}/steps/${unitId}.mdx)`,
      { cause }
    );
  }
}

/** 레지스트리에 등록된 모든 가이드를 순서대로 읽는다. 학습 경로 화면용. */
export async function loadAllGuides(): Promise<LoadedGuide[]> {
  return Promise.all(GUIDE_SLUGS.map((slug) => loadGuide(slug)));
}
