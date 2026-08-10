import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],
};

// remark/rehype 플러그인은 아직 없다. Turbopack에서는 플러그인을 문자열로만
// 지정할 수 있으므로(함수는 Rust로 전달되지 않는다) 도입 시점에 다시 정한다.
const withMDX = createMDX({});

export default withMDX(nextConfig);
