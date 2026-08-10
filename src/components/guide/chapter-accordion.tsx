"use client";

import { CheckIcon } from "lucide-react";
import { useCallback, useEffect, useState, type ReactNode } from "react";

import { ChapterCounter } from "@/components/guide/chapter-counter";
import { CheckCircle } from "@/components/guide/check-circle";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { CheckUnit, NormalizedChapter } from "@/content/schema";
import {
  chapterAnchorId,
  chapterIdFromHash,
  OPEN_CHAPTER_EVENT,
} from "@/lib/chapter-anchor";
import { useDoneCount } from "@/lib/progress";
import { progressAttrs } from "@/lib/progress-keys";

/**
 * 챕터 목록을 담는 아코디언.
 *
 * `type="multiple"` — 한 챕터를 펼친 채 다른 챕터를 펼칠 수 있어야 한다
 * (`specs/site-pages` — 여러 챕터를 동시에 펼친다).
 *
 * 열린 챕터를 상태로 들고 있는 이유는 딥링크 때문이다. 주소의 해시로 들어오거나
 * 목차를 누르면 해당 챕터를 펼쳐야 하는데, 비제어 아코디언으로는 밖에서
 * 열 수가 없다.
 */
export function ChapterAccordion({ children }: { children: ReactNode }) {
  const [openIds, setOpenIds] = useState<string[]>([]);

  const open = useCallback((chapterId: string) => {
    setOpenIds((prev) =>
      prev.includes(chapterId) ? prev : [...prev, chapterId]
    );
    // 펼치면서 아래 내용이 밀려나므로 레이아웃이 잡힌 다음 프레임에 위치를 잡는다.
    requestAnimationFrame(() => {
      document
        .getElementById(chapterAnchorId(chapterId))
        ?.scrollIntoView({ block: "start", behavior: "smooth" });
    });
  }, []);

  useEffect(() => {
    const fromHash = () => {
      const chapterId = chapterIdFromHash(window.location.hash);
      if (chapterId !== null) open(chapterId);
    };
    // 다른 화면에서 넘어온 경우 — 마운트 시점의 해시가 목적지다.
    fromHash();

    const onRequest = (event: Event) => {
      open((event as CustomEvent<string>).detail);
    };

    window.addEventListener("hashchange", fromHash);
    window.addEventListener(OPEN_CHAPTER_EVENT, onRequest);
    return () => {
      window.removeEventListener("hashchange", fromHash);
      window.removeEventListener(OPEN_CHAPTER_EVENT, onRequest);
    };
  }, [open]);

  return (
    <Accordion
      type="multiple"
      value={openIds}
      onValueChange={setOpenIds}
      className="gap-3"
    >
      {children}
    </Accordion>
  );
}

/**
 * 챕터 카드 하나.
 *
 * 레퍼런스의 채도 높은 좌측 레일과 원형 번호 배지를 잉크 단색으로 옮겼다
 * (`design.md` 결정 8). 완료·열림 여부는 색 말고도 레일 밝기와 배지 안의
 * 숫자→체크 전환으로 함께 전해진다.
 */
export function ChapterItem({
  guideSlug,
  chapter,
  children,
}: {
  guideSlug: string;
  chapter: NormalizedChapter;
  /** 스텝 목록 또는 암묵 체크 단위의 본문 */
  children: ReactNode;
}) {
  const unitIds = chapter.units.map((unit) => unit.id);
  const complete = useDoneCount(guideSlug, unitIds) === unitIds.length;

  // 스텝이 없는 챕터는 챕터 자체가 체크 단위다. 컨트롤을 중첩 목록 대신
  // 헤더에 놓는다(`design.md` 결정 3).
  const implicitUnit: CheckUnit | undefined = chapter.units[0]?.implicit
    ? chapter.units[0]
    : undefined;

  return (
    <AccordionItem
      value={chapter.id}
      id={chapterAnchorId(chapter.id)}
      {...progressAttrs(guideSlug, unitIds, complete)}
      className="group/chapter relative scroll-mt-20 overflow-hidden rounded-xl border border-border bg-card"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 w-1 bg-hairline-strong transition-colors group-data-[state=open]/chapter:bg-foreground group-data-[done=true]/chapter:bg-foreground"
      />
      <div className="flex items-center gap-1 pr-3 pl-4">
        <AccordionTrigger className="min-w-0 flex-1 items-center py-4 pr-2 text-base hover:no-underline">
          <span className="flex min-w-0 flex-1 items-center gap-3">
            <ChapterNumber order={chapter.order} />
            <span className="display-sm min-w-0 text-foreground">
              {chapter.title}
            </span>
            <ChapterCounter
              guideSlug={guideSlug}
              unitIds={unitIds}
              className="ml-auto"
            />
          </span>
        </AccordionTrigger>
        {implicitUnit === undefined ? null : (
          <CheckCircle
            guideSlug={guideSlug}
            unitId={implicitUnit.id}
            label={chapter.title}
          />
        )}
      </div>
      <AccordionContent className="h-auto px-4 pb-5 pl-4">
        {chapter.summary === undefined ? null : (
          <p className="mb-4 pl-11 text-body">{chapter.summary}</p>
        )}
        {children}
      </AccordionContent>
    </AccordionItem>
  );
}

/** 원형 번호 배지. 챕터가 완료되면 숫자가 체크로 바뀐다 */
function ChapterNumber({ order }: { order: number }) {
  return (
    <span
      aria-hidden
      className="relative grid size-8 shrink-0 place-items-center rounded-full bg-secondary text-sm text-foreground transition-colors group-data-[done=true]/chapter:bg-foreground group-data-[done=true]/chapter:text-background"
    >
      <span className="group-data-[done=true]/chapter:invisible">{order}</span>
      <CheckIcon
        strokeWidth={2.5}
        className="invisible absolute size-4 group-data-[done=true]/chapter:visible"
      />
    </span>
  );
}
