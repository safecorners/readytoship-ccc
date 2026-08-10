import Link from "next/link";

import { Button } from "@/components/ui/button";

/**
 * 가이드 끝에 놓이는 마무리 영역.
 *
 * 이어질 가이드가 없어도 깨진 링크나 빈 카드가 아니라 끝났다는 말이 놓여야
 * 한다(`specs/site-pages` — 다음 단계 유도). 가이드가 하나뿐인 지금은 이쪽이
 * 기본 경로다.
 */
export function NextStepCard({
  next,
}: {
  next?: { slug: string; title: string; summary: string };
}) {
  if (next === undefined) {
    return (
      <section className="rounded-2xl border border-border bg-card px-6 py-10 text-center">
        <p className="caption-upper text-muted-foreground">여기까지</p>
        <p className="display-sm mt-3 text-foreground">
          이어지는 가이드는 아직 없습니다
        </p>
        <p className="mx-auto mt-3 max-w-md text-body">
          다음 편이 준비되면 학습 경로에 올라옵니다. 그때까지는 방금 연 프로젝트에
          클로드 코드로 이것저것 물어보는 것이 가장 좋은 연습입니다.
        </p>
        <Button asChild variant="outline" className="mt-6">
          <Link href="/guides">학습 경로 다시 보기</Link>
        </Button>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-border bg-card px-6 py-10 text-center">
      <p className="caption-upper text-muted-foreground">다음 가이드</p>
      <p className="display-sm mt-3 text-foreground">{next.title}</p>
      <p className="mx-auto mt-3 max-w-md text-body">{next.summary}</p>
      <Button asChild className="mt-6">
        <Link href={`/guides/${next.slug}`}>이어서 시작하기</Link>
      </Button>
    </section>
  );
}
