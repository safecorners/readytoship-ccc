import { ArrowUpRightIcon } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * 사이트 밖으로 나가는 링크.
 *
 * 설치 가이드는 대부분의 링크가 외부 다운로드 페이지다. 새 창에서 열리면
 * 읽던 자리를 잃지 않는데, 그 사실을 시각적으로도(화살표) 보조 기술에도
 * (숨은 안내) 함께 알린다.
 */
export function ExternalLink({
  href,
  children,
  className,
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      className={cn(
        "font-medium text-foreground underline decoration-hairline-strong underline-offset-4 transition-colors hover:decoration-foreground",
        className
      )}
    >
      {children}
      <ArrowUpRightIcon
        aria-hidden
        className="ml-0.5 inline size-3.5 shrink-0 align-[-0.1em] text-muted-foreground"
      />
      <span className="sr-only"> (새 창에서 열림)</span>
    </a>
  );
}
