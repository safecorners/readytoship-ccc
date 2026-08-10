"use client";

import { Badge } from "@/components/ui/badge";
import { useDoneCount } from "@/lib/progress";
import { counterAttrs, formatCounter } from "@/lib/progress-keys";
import { cn } from "@/lib/utils";

/**
 * `완료수/전체수` 진행률 pill.
 *
 * 전부 완료하면 잉크 반전으로 바뀐다 — 색만이 아니라 명도 대비가 뒤집히므로
 * 색을 구분하지 못해도 상태가 읽힌다(`specs/guide-ui` — 색에 의존하지 않는
 * 상태 구분).
 *
 * 텍스트는 반드시 템플릿 문자열 하나로 낸다. `{done}/{total}`처럼 쓰면 서버가
 * 텍스트 노드를 여러 개로 쪼개 내보내서 부트 스크립트의 `textContent` 교체와
 * 어긋난다.
 */
export function ChapterCounter({
  guideSlug,
  unitIds,
  className,
}: {
  guideSlug: string;
  unitIds: readonly string[];
  className?: string;
}) {
  const done = useDoneCount(guideSlug, unitIds);
  const total = unitIds.length;

  return (
    <span className="inline-flex items-center" aria-live="polite">
      <span className="sr-only">완료 </span>
      <Badge
        {...counterAttrs(guideSlug, unitIds, done === total)}
        className={cn(
          "tabular-nums transition-colors data-[done=true]:bg-primary data-[done=true]:text-primary-foreground",
          className
        )}
      >
        {formatCounter(done, total)}
      </Badge>
    </span>
  );
}
