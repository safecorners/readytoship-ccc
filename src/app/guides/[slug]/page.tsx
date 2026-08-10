import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  ChapterAccordion,
  ChapterItem,
} from "@/components/guide/chapter-accordion";
import { GuideHero } from "@/components/guide/guide-hero";
import { GuideToc } from "@/components/guide/guide-toc";
import { NextStepCard } from "@/components/guide/next-step-card";
import { StepBody, StepRow } from "@/components/guide/step-row";
import { GUIDE_SLUGS, isGuideSlug } from "@/content/registry";
import { loadGuide, loadUnitBody } from "@/lib/guides";

/**
 * 가이드 상세.
 *
 * 등록된 slug만 빌드 시점에 정적으로 만들고, 그 밖의 주소는 404다
 * (`dynamicParams = false`). 콘텐츠 검증이 빌드 중 서버에서 돌기 때문에
 * 잘못된 콘텐츠는 배포까지 가지 못한다(`design.md` 결정 2).
 */
export const dynamicParams = false;

export function generateStaticParams() {
  return GUIDE_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/guides/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  if (!isGuideSlug(slug)) return {};

  const { guide } = await loadGuide(slug);
  return { title: guide.title, description: guide.summary };
}

export default async function GuidePage({
  params,
}: PageProps<"/guides/[slug]">) {
  const { slug } = await params;
  if (!isGuideSlug(slug)) notFound();

  const { guide, Intro } = await loadGuide(slug);

  // 본문은 서버에서 읽어 엘리먼트로 넘긴다. 아코디언·스텝 행은 클라이언트지만
  // MDX는 그 경계를 넘지 않는다.
  const bodies = new Map(
    await Promise.all(
      guide.chapters
        .flatMap((chapter) => chapter.units)
        .map(
          async (unit) => [unit.id, await loadUnitBody(slug, unit.id)] as const
        )
    )
  );

  const nextGuide = guide.next === undefined ? undefined : await loadGuide(guide.next);

  return (
    <main className="mx-auto w-full max-w-[1200px] flex-1 px-5 py-10 sm:px-6 sm:py-14">
      <GuideHero eyebrow="가이드" title={guide.title} summary={guide.summary} />

      <div className="mt-12 grid gap-8 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-start">
        <div className="flex min-w-0 flex-col gap-8">
          <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
            <Intro />
          </div>

          <ChapterAccordion>
            {guide.chapters.map((chapter) => {
              const implicitUnit = chapter.units[0]?.implicit
                ? chapter.units[0]
                : undefined;

              return (
                <ChapterItem
                  key={chapter.id}
                  guideSlug={slug}
                  chapter={chapter}
                >
                  {implicitUnit === undefined ? (
                    <ol className="flex flex-col">
                      {chapter.units.map((unit) => {
                        const Body = bodies.get(unit.id)!;
                        return (
                          <StepRow key={unit.id} guideSlug={slug} unit={unit}>
                            <Body />
                          </StepRow>
                        );
                      })}
                    </ol>
                  ) : (
                    <StepBody
                      unit={implicitUnit}
                      className="min-w-0 pr-2 pl-11"
                    >
                      {(() => {
                        const Body = bodies.get(implicitUnit.id)!;
                        return <Body />;
                      })()}
                    </StepBody>
                  )}
                </ChapterItem>
              );
            })}
          </ChapterAccordion>

          <NextStepCard
            next={
              nextGuide === undefined
                ? undefined
                : {
                    slug: nextGuide.slug,
                    title: nextGuide.guide.title,
                    summary: nextGuide.guide.summary,
                  }
            }
          />
        </div>

        <aside className="order-first lg:order-none lg:sticky lg:top-20">
          <GuideToc guideSlug={slug} chapters={guide.chapters} />
        </aside>
      </div>
    </main>
  );
}
