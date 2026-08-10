"use client";

import { ChevronDownIcon } from "lucide-react";
import type { ReactNode } from "react";

import { CheckCircle } from "@/components/guide/check-circle";
import { CommandCard } from "@/components/guide/command-card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import type { CheckUnit } from "@/content/schema";

/**
 * 챕터 안의 스텝 한 줄 — 완료 체크 + 펼치면 나오는 본문.
 *
 * 체크 컨트롤은 펼침 트리거 **밖에** 둔다. 안에 넣으면 버튼 속 버튼이 되어
 * 키보드·보조 기술 양쪽에서 깨진다.
 *
 * 접힌 본문은 Radix가 DOM에서 아예 들어내므로 Tab이 닿지 않는다
 * (`specs/guide-ui` — 접힌 영역의 요소는 포커스를 받지 않는다).
 */
export function StepRow({
  guideSlug,
  unit,
  children,
}: {
  guideSlug: string;
  unit: CheckUnit;
  /** 스텝 본문 — 서버에서 렌더한 MDX가 넘어온다 */
  children: ReactNode;
}) {
  return (
    <li className="border-t border-hairline-soft first:border-t-0">
      <Collapsible>
        <div className="flex items-center gap-1">
          <CheckCircle
            guideSlug={guideSlug}
            unitId={unit.id}
            label={unit.title}
          />
          <CollapsibleTrigger className="group/step flex min-w-0 flex-1 items-center gap-2 rounded-lg py-3 pr-2 text-left transition-colors hover:text-foreground">
            <span className="min-w-0 flex-1 text-foreground">{unit.title}</span>
            <ChevronDownIcon
              aria-hidden
              className="size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-aria-expanded/step:rotate-180"
            />
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent className="overflow-hidden data-open:animate-collapsible-down data-closed:animate-collapsible-up">
          <StepBody unit={unit}>{children}</StepBody>
        </CollapsibleContent>
      </Collapsible>
    </li>
  );
}

/**
 * 스텝 본문과 명령어. 암묵 체크 단위(스텝 없는 챕터)는 접히지 않고 챕터 본문
 * 자리에 그대로 놓이므로 여기만 따로 쓴다.
 */
export function StepBody({
  unit,
  className,
  children,
}: {
  unit: CheckUnit;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={className ?? "min-w-0 pt-1 pr-2 pb-6 pl-11"}>
      {children}
      {unit.commands.length === 0 ? null : (
        <div className="mt-5 flex flex-col gap-3">
          {unit.commands.map((command) => (
            <CommandCard key={command.command} command={command} />
          ))}
        </div>
      )}
    </div>
  );
}
