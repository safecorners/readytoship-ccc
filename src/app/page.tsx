import Link from "next/link";

import { Orbs } from "@/components/orbs";
import { Button } from "@/components/ui/button";

/**
 * 랜딩.
 *
 * 여기서 할 일은 사이트가 무엇인지 한 문장으로 말하고 학습 경로로 보내는
 * 것뿐이다. 가격표·후기·FAQ는 두지 않는다(`specs/site-pages` — 랜딩 화면).
 */
export default function Home() {
  return (
    <main className="mx-auto w-full max-w-[1200px] flex-1 px-5 py-12 sm:px-6 sm:py-20">
      <section className="relative overflow-hidden rounded-3xl bg-canvas-soft px-6 py-20 sm:px-12 sm:py-28">
        <Orbs />
        <div className="relative mx-auto flex max-w-2xl flex-col items-center gap-6 text-center">
          <p className="caption-upper text-muted-foreground">밀크티쉐이크</p>
          <h1 className="display-mega text-foreground">
            터미널이 처음이어도 괜찮습니다
          </h1>
          <p className="max-w-xl text-body">
            클로드 코드를 쓰려면 먼저 몇 가지를 설치해야 합니다. 그 과정을 여덟
            단계로 쪼개고, 하나 끝낼 때마다 체크해 나가도록 만들었습니다. 중간에
            멈췄다 와도 하던 자리가 남아 있습니다.
          </p>
          <Button asChild size="lg" className="mt-2">
            <Link href="/guides">학습 경로 보기</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
