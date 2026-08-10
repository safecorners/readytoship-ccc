import { CopyButton } from "@/components/copy-button";
import { cn } from "@/lib/utils";

/**
 * 본문 안의 코드 블록.
 *
 * 스크롤은 `<pre>`가 자기 안에서만 처리한다. 긴 명령어가 페이지 전체를 가로로
 * 밀지 않아야 한다는 요구(`specs/guide-ui` — 반응형 레이아웃) 때문이며,
 * 바깥 컨테이너가 `min-w-0`이어야 실제로 동작한다.
 */
export function CodeBlock({
  code,
  label,
  className,
}: {
  code: string;
  /** 복사 버튼이 스크린리더에 자기를 소개할 이름 */
  label?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative my-4 min-w-0 rounded-lg border border-border bg-canvas-soft",
        className
      )}
    >
      <pre className="overflow-x-auto py-3.5 pr-20 pl-4 font-mono text-sm leading-relaxed text-foreground">
        <code>{code}</code>
      </pre>
      <CopyButton
        value={code}
        label={label ?? "코드"}
        className="absolute top-2 right-2 bg-canvas-soft"
      />
    </div>
  );
}
