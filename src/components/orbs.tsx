import { cn } from "@/lib/utils";

/**
 * 파스텔 방사형 분위기 장식.
 *
 * 루트 `design.md`가 파스텔에 허용한 유일한 용도다 — 버튼 채움, 텍스트 색,
 * 카드 배경 채움에는 쓰지 않는다. 순수 장식이므로 보조 기술에서 빼고
 * 포인터 이벤트도 가로채지 않는다(`specs/guide-ui` — 시각 언어 준수).
 */
export function Orbs({
  /** 두 오브의 색. 루트 `design.md`의 5색 중에서 고른다 */
  colors = ["var(--orb-sky)", "var(--orb-peach)"],
  className,
}: {
  colors?: [string, string];
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={cn("pointer-events-none absolute inset-0", className)}
      style={{
        background: [
          `radial-gradient(45% 65% at 18% 25%, ${colors[0]} 0%, transparent 70%)`,
          `radial-gradient(45% 65% at 82% 70%, ${colors[1]} 0%, transparent 70%)`,
        ].join(", "),
        opacity: 0.4,
      }}
    />
  );
}
