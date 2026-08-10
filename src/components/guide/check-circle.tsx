"use client";

import { CheckIcon } from "lucide-react";

import { progressAttrs } from "@/lib/progress-keys";
import { toggleUnit, useUnitDone } from "@/lib/progress";
import { cn } from "@/lib/utils";

/**
 * 체크 단위 하나의 완료 표시 컨트롤.
 *
 * 스텝과 암묵 체크 단위(스텝 없는 챕터)가 공용으로 쓴다 — 스토어는 둘을
 * 구분하지 않으므로 화면 컨트롤도 하나면 된다(`design.md` 결정 3).
 *
 * 시각 표현은 전부 `[data-done="true"]` 선택자에서 나온다. 부트 스크립트가
 * 첫 페인트 전에 세우는 것이 그 속성 하나뿐이라, 스타일이 바뀌어도 스크립트를
 * 따라 고칠 일이 없다(`design.md` 결정 5).
 */
export function CheckCircle({
  guideSlug,
  unitId,
  label,
  className,
}: {
  guideSlug: string;
  unitId: string;
  /** 무엇에 대한 컨트롤인지 — 스크린리더가 읽는다 */
  label: string;
  className?: string;
}) {
  const done = useUnitDone(guideSlug, unitId);

  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={done}
      aria-label={`${label} 완료`}
      onClick={() => toggleUnit(guideSlug, unitId)}
      {...progressAttrs(guideSlug, [unitId], done)}
      className={cn(
        // 44px — 안쪽 원은 24px이고 나머지는 터치 여유다
        "group/check grid size-11 shrink-0 place-items-center rounded-full",
        className
      )}
    >
      <span
        aria-hidden
        className="grid size-6 place-items-center rounded-full border-2 border-hairline-strong text-transparent transition-colors group-hover/check:border-muted group-data-[done=true]/check:border-foreground group-data-[done=true]/check:bg-foreground group-data-[done=true]/check:text-background"
      >
        <CheckIcon className="size-3.5" strokeWidth={3} />
      </span>
    </button>
  );
}
