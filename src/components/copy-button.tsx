"use client";

import { CheckIcon, CopyIcon, XIcon } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * 클립보드 복사 컨트롤.
 *
 * 실패를 성공처럼 보이게 하지 않는 것이 요구다(`specs/guide-ui` — 명령어 복사).
 * 그래서 상태를 성공/실패로 나눠 서로 다른 아이콘과 문구를 내보내고, 스크린리더에는
 * 라이브 리전으로 알린다.
 */

type CopyStatus = "idle" | "copied" | "failed";

/** 확인 표시가 원래대로 돌아가기까지 */
const RESET_MS = 2000;

const FACE: Record<CopyStatus, { icon: typeof CopyIcon; text: string }> = {
  idle: { icon: CopyIcon, text: "복사" },
  copied: { icon: CheckIcon, text: "복사됨" },
  failed: { icon: XIcon, text: "복사 실패" },
};

const ANNOUNCEMENT: Record<CopyStatus, string> = {
  idle: "",
  copied: "클립보드에 복사했습니다",
  failed: "클립보드에 복사하지 못했습니다",
};

export function CopyButton({
  value,
  label,
  className,
}: {
  /** 클립보드에 들어갈 문자열. 화면에 보이는 것과 정확히 같아야 한다 */
  value: string;
  /** 무엇을 복사하는지 — 같은 화면에 복사 버튼이 여럿이라 이름이 필요하다 */
  label: string;
  className?: string;
}) {
  const [status, setStatus] = useState<CopyStatus>("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current !== null) clearTimeout(timer.current);
    };
  }, []);

  const copy = useCallback(async () => {
    if (timer.current !== null) clearTimeout(timer.current);

    let next: CopyStatus = "copied";
    try {
      // 보안 컨텍스트가 아니면 navigator.clipboard 자체가 없다. 속성 접근에서
      // 나는 TypeError도 여기서 함께 걸린다.
      await navigator.clipboard.writeText(value);
    } catch {
      next = "failed";
    }

    setStatus(next);
    timer.current = setTimeout(() => setStatus("idle"), RESET_MS);
  }, [value]);

  const { icon: Icon, text } = FACE[status];

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size="xs"
        onClick={copy}
        data-status={status}
        aria-label={`${label} ${text}`}
        className={cn(
          "text-muted-foreground hover:text-foreground data-[status=failed]:text-destructive",
          className
        )}
      >
        <Icon aria-hidden />
        <span aria-hidden>{text}</span>
      </Button>
      <span role="status" className="sr-only">
        {ANNOUNCEMENT[status]}
      </span>
    </>
  );
}
