"use client";

import { CheckIcon } from "lucide-react";
import Link from "next/link";

import { ChapterCounter } from "@/components/guide/chapter-counter";
import type { NormalizedChapter } from "@/content/schema";
import { chapterHref } from "@/lib/chapter-anchor";
import { useDoneCount } from "@/lib/progress";
import { progressAttrs } from "@/lib/progress-keys";

/**
 * 학습 경로 화면의 단계 하나.
 *
 * 챕터를 순서 있는 수직 목록의 한 칸으로 보여주고, 누르면 가이드 상세의 해당
 * 챕터로 간다(`specs/site-pages` — 학습 경로 화면).
 */
export function PathStep({
  guideSlug,
  chapter,
  /** 마지막 단계는 아래로 이어지는 연결선을 그리지 않는다 */
  last,
}: {
  guideSlug: string;
  chapter: NormalizedChapter;
  last: boolean;
}) {
  const unitIds = chapter.units.map((unit) => unit.id);
  const complete = useDoneCount(guideSlug, unitIds) === unitIds.length;

  return (
    <li
      {...progressAttrs(guideSlug, unitIds, complete)}
      className="group/path relative"
    >
      {last ? null : (
        <span
          aria-hidden
          className="pointer-events-none absolute top-14 bottom-0 left-[2.25rem] w-px bg-border"
        />
      )}
      <Link
        href={chapterHref(guideSlug, chapter.id)}
        className="relative flex gap-4 rounded-xl p-4 transition-colors hover:bg-secondary/60"
      >
        <span
          aria-hidden
          className="relative grid size-10 shrink-0 place-items-center rounded-full border border-border bg-card text-foreground transition-colors group-data-[done=true]/path:border-foreground group-data-[done=true]/path:bg-foreground group-data-[done=true]/path:text-background"
        >
          <span className="group-data-[done=true]/path:invisible">
            {chapter.order}
          </span>
          <CheckIcon
            strokeWidth={2.5}
            className="invisible absolute size-4 group-data-[done=true]/path:visible"
          />
        </span>
        <span className="flex min-w-0 flex-1 flex-col gap-1.5">
          <span className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
            <span className="display-sm text-foreground">{chapter.title}</span>
            <ChapterCounter guideSlug={guideSlug} unitIds={unitIds} />
          </span>
          {chapter.summary === undefined ? null : (
            <span className="text-body">{chapter.summary}</span>
          )}
        </span>
      </Link>
    </li>
  );
}
