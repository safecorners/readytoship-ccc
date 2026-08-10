import { CopyButton } from "@/components/copy-button";
import type { GuideCommand } from "@/content/schema";

/**
 * 터미널에 그대로 붙여 넣을 명령어 한 줄.
 *
 * 레퍼런스의 연보라 프롬프트 패널을 옮긴 자리다(`design.md` 결정 8) —
 * 채도는 방사형 분위기로만 남기고 본문은 고정폭 잉크다.
 *
 * 복사되는 문자열은 화면에 보이는 것과 같은 `command.command`다. 두 곳이
 * 갈라지지 않도록 한 값에서 나온다(`specs/guide-ui` — 명령어 복사).
 */
export function CommandCard({ command }: { command: GuideCommand }) {
  return (
    <div className="relative min-w-0 overflow-hidden rounded-xl border border-border bg-canvas-soft">
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(70% 130% at 0% 0%, var(--orb-lavender) 0%, transparent 65%)",
        }}
      />
      <div className="relative flex items-center gap-2 py-2 pr-2 pl-4">
        <pre className="min-w-0 flex-1 overflow-x-auto py-1.5 font-mono text-sm text-foreground">
          <code>{command.command}</code>
        </pre>
        <CopyButton
          value={command.command}
          label={`${command.command} 명령어`}
          className="shrink-0"
        />
      </div>
      {command.description === undefined ? null : (
        <p className="relative border-t border-hairline-soft px-4 py-2.5 text-sm text-muted-foreground">
          {command.description}
        </p>
      )}
    </div>
  );
}
