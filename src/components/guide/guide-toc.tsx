"use client";

import { ChapterCounter } from "@/components/guide/chapter-counter";
import type { NormalizedChapter } from "@/content/schema";
import { chapterAnchorId, requestOpenChapter } from "@/lib/chapter-anchor";

/**
 * 가이드 안의 보조 목차.
 *
 * 항목을 누르면 해당 챕터가 펼쳐지고 그 위치로 이동한다
 * (`specs/site-pages` — 가이드 내 목차).
 *
 * 같은 페이지 안의 링크라 이미 그 해시에 있을 때는 `hashchange`가 뜨지 않는다.
 * 그래서 주소를 남기는 일은 앵커에 맡기고, 펼치는 일은 이벤트로 따로 알린다.
 */
export function GuideToc({
  guideSlug,
  chapters,
}: {
  guideSlug: string;
  chapters: readonly NormalizedChapter[];
}) {
  return (
    <nav
      aria-label="가이드 목차"
      className="rounded-2xl border border-border bg-card p-5"
    >
      <p className="caption-upper text-muted-foreground">목차</p>
      <ol className="mt-3 flex flex-col">
        {chapters.map((chapter) => (
          <li key={chapter.id}>
            <a
              href={`#${chapterAnchorId(chapter.id)}`}
              onClick={() => requestOpenChapter(chapter.id)}
              className="flex items-center gap-3 rounded-lg py-2.5 transition-colors hover:text-foreground"
            >
              <span
                aria-hidden
                className="w-4 shrink-0 text-right text-sm text-muted-soft tabular-nums"
              >
                {chapter.order}
              </span>
              <span className="min-w-0 flex-1 text-body">{chapter.title}</span>
              <ChapterCounter
                guideSlug={guideSlug}
                unitIds={chapter.units.map((unit) => unit.id)}
              />
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
