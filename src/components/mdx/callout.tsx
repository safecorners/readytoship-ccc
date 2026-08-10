import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * 본문 흐름에서 한 번 멈춰 세우는 상자.
 *
 * 레퍼런스의 민트 강조 카드를 잉크 단색으로 옮긴 것이다(`design.md` 결정 8).
 * 파스텔은 방사형 분위기로만 깔리고 배경 채움에는 쓰지 않는다.
 */
export function Callout({
  title,
  children,
  className,
}: {
  title?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <aside
      className={cn(
        "relative my-6 min-w-0 overflow-hidden rounded-xl border border-border bg-canvas-soft p-5",
        className
      )}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-45"
        style={{
          background:
            "radial-gradient(70% 120% at 100% 0%, var(--orb-mint) 0%, transparent 70%)",
        }}
      />
      <div className="relative">
        {title === undefined ? null : (
          <p className="caption-upper mb-2 text-muted-foreground">{title}</p>
        )}
        <div className="text-body [&>*:last-child]:mb-0">{children}</div>
      </div>
    </aside>
  );
}
