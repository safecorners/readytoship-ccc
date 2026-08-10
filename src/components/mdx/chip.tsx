import { FolderIcon } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * 본문 안에 박히는 짧은 고정폭 조각 — 버튼 이름, 메뉴 항목, 짧은 값.
 *
 * 루트 `design.md`의 `{rounded.xs}` 4px이 인라인 태그의 자리다. 폰트 크기는
 * `em`이라 놓이는 문단의 크기를 따라간다.
 */
export function Chip({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <code
      className={cn(
        "rounded-xs bg-secondary px-1.5 py-0.5 font-mono text-[0.875em] text-foreground",
        className
      )}
    >
      {children}
    </code>
  );
}

/**
 * 파일·폴더 경로.
 *
 * 경로는 좁은 화면에서 한 단어처럼 붙어 다녀 레이아웃을 밀어내기 쉬우므로
 * `break-all`로 끊는다.
 */
export function ChipPath({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex max-w-full items-center gap-1 rounded-xs border border-border bg-canvas-soft px-1.5 py-0.5 font-mono text-[0.875em] break-all text-body",
        className
      )}
    >
      <FolderIcon aria-hidden className="size-3 shrink-0 text-muted-soft" />
      {children}
    </span>
  );
}
