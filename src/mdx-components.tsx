import type { MDXComponents } from "mdx/types";

// 기본 요소 매핑은 MDX 렌더링 컴포넌트 단계에서 채운다.
const components: MDXComponents = {};

// Next 16의 useMDXComponents는 인자를 받지 않는다.
export function useMDXComponents(): MDXComponents {
  return components;
}
