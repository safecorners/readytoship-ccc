import Link from "next/link";

import { Button } from "@/components/ui/button";

/**
 * 모든 화면에 놓이는 전역 내비게이션.
 *
 * 요구는 두 가지뿐이다 — 브랜드 워드마크와 학습 경로로 돌아가는 수단
 * (`specs/site-pages` — 전역 내비게이션). 루트 `design.md`의 `top-nav`대로
 * 높이 64px, 워드마크 좌·액션 우.
 */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background/85 backdrop-blur-sm">
      <div className="mx-auto flex h-16 w-full max-w-[1200px] items-center justify-between gap-4 px-5 sm:px-6">
        {/* 상단 컨트롤은 터치 대상을 40px 이상으로 잡는다. 워드마크는 글자
            높이만으로 26px이라 세로 패딩으로 채운다. */}
        <Link
          href="/"
          className="rounded-sm py-2 text-[17px] font-medium tracking-tight text-foreground"
        >
          밀크티쉐이크
        </Link>
        <nav aria-label="주 메뉴">
          <Button asChild variant="ghost">
            <Link href="/guides">학습 경로</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
