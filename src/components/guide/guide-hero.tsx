import type { ReactNode } from "react";

import { Orbs } from "@/components/orbs";
import { Badge } from "@/components/ui/badge";

/**
 * 가이드 상세와 학습 경로의 머리말.
 *
 * 루트 `design.md`의 `hero-band` — 디스플레이 헤드라인은 weight 300이고,
 * 배경에는 sky·peach 오브가 낮은 투명도로 깔린다(`design.md` 결정 8).
 */
export function GuideHero({
  eyebrow,
  title,
  summary,
  children,
}: {
  eyebrow?: string;
  title: string;
  summary: string;
  /** CTA나 진행률 같은 부속 — 없으면 헤드라인과 요약만 나온다 */
  children?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-canvas-soft px-6 py-16 sm:px-12 sm:py-20">
      <Orbs />
      <div className="relative mx-auto flex max-w-2xl flex-col items-center gap-5 text-center">
        {eyebrow === undefined ? null : <Badge>{eyebrow}</Badge>}
        <h1 className="display-mega text-foreground">{title}</h1>
        <p className="text-body">{summary}</p>
        {children}
      </div>
    </section>
  );
}
