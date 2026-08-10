import type { Metadata } from "next";

import { GuideHero } from "@/components/guide/guide-hero";
import { PathStep } from "@/components/guide/path-step";
import { loadAllGuides } from "@/lib/guides";

export const metadata: Metadata = {
  title: "학습 경로",
  description:
    "설치부터 첫 프로젝트까지, 순서대로 밟아 가는 클로드 코드 입문 단계.",
};

/**
 * 학습 경로.
 *
 * 가이드의 챕터를 순서 있는 단계형 수직 목록으로 편다. 단계를 누르면 상세의
 * 해당 챕터로 간다(`specs/site-pages` — 학습 경로 화면).
 */
export default async function GuidesPage() {
  const guides = await loadAllGuides();

  return (
    <main className="mx-auto w-full max-w-[1200px] flex-1 px-5 py-10 sm:px-6 sm:py-14">
      <GuideHero
        eyebrow="학습 경로"
        title="순서대로 하나씩"
        summary="위에서부터 차례로 밟으면 됩니다. 완료 표시는 이 브라우저에 남아서, 다음에 와도 하던 자리부터 이어갈 수 있습니다."
      />

      <div className="mx-auto mt-12 flex max-w-3xl flex-col gap-14">
        {guides.map(({ slug, guide }) => (
          <section key={slug}>
            <h2 className="display-lg text-foreground">{guide.title}</h2>
            <p className="mt-3 text-body">{guide.summary}</p>
            <ol className="mt-6 flex flex-col">
              {guide.chapters.map((chapter, index) => (
                <PathStep
                  key={chapter.id}
                  guideSlug={slug}
                  chapter={chapter}
                  last={index === guide.chapters.length - 1}
                />
              ))}
            </ol>
          </section>
        ))}
      </div>
    </main>
  );
}
