import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import localFont from "next/font/local";

import { ProgressBootScript } from "@/components/progress-boot-script";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

// Pretendard 가변 폰트 자체 호스팅. weight 45~920 구간을 가지며,
// 디스플레이가 쓰는 weight 300이 실재하는 것이 선택 이유다.
const pretendard = localFont({
  src: "../../node_modules/pretendard/dist/web/variable/woff2/PretendardVariable.woff2",
  variable: "--font-pretendard",
  weight: "45 920",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "밀크티쉐이크 — 클로드 코드 입문 가이드",
    template: "%s — 밀크티쉐이크",
  },
  description:
    "설치부터 첫 프로젝트까지, 체크해 나가며 따라가는 클로드 코드 입문 튜토리얼.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ko"
      className={`${pretendard.variable} ${jetbrainsMono.variable} antialiased`}
    >
      {/*
        높이는 뷰포트 단위로 잡는다. `html`에 `height: 100%`를 주면 본문이 그
        상자를 넘칠 때 `documentElement`의 측정값이 어긋난다.
      */}
      <body className="flex min-h-svh flex-col">
        <SiteHeader />
        {children}
        {/* 대상 요소가 파싱된 뒤에 실행돼야 하므로 본문 맨 뒤다 */}
        <ProgressBootScript />
      </body>
    </html>
  );
}
