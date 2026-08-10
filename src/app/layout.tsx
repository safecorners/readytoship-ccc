import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import localFont from "next/font/local";
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
      className={`${pretendard.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
