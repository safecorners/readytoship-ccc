import type { MDXComponents } from "mdx/types";
import Link from "next/link";
import { isValidElement, type ComponentProps, type ReactNode } from "react";

import { Callout } from "@/components/mdx/callout";
import { Chip, ChipPath } from "@/components/mdx/chip";
import { CodeBlock } from "@/components/mdx/code-block";
import { ExternalLink } from "@/components/mdx/external-link";
import { cn } from "@/lib/utils";

/**
 * MDX 본문의 기본 요소 매핑.
 *
 * 콘텐츠 작성자가 마크다운만 쓰고도 디자인 토큰을 따르게 하는 것이 목적이다.
 * 여기 없는 태그를 쓰면 브라우저 기본 스타일이 나오므로, 본문에 실제로
 * 등장하는 태그를 전부 덮는다.
 */

/**
 * 펜스 코드 블록에서 원문 문자열을 꺼낸다.
 *
 * MDX는 `<pre><code className="language-…">문자열</code></pre>` 모양으로 넘긴다.
 * 문자열만 필요하므로 `code` 매핑(인라인용 Chip)을 타지 않고 여기서 가로챈다.
 */
function unwrapCode(node: ReactNode): string {
  const raw = isValidElement<{ children?: ReactNode }>(node)
    ? node.props.children
    : node;
  // 펜스 블록은 항상 개행으로 끝난다. 그대로 복사하면 터미널에서 바로
  // 실행돼 버리므로 떼어 낸다.
  return typeof raw === "string" ? raw.replace(/\n$/, "") : "";
}

function isExternal(href: string): boolean {
  return /^(https?:)?\/\//.test(href) || href.startsWith("mailto:");
}

const components: MDXComponents = {
  h2: ({ className, ...props }: ComponentProps<"h2">) => (
    <h2
      className={cn("display-sm mt-8 mb-3 text-foreground first:mt-0", className)}
      {...props}
    />
  ),
  h3: ({ className, ...props }: ComponentProps<"h3">) => (
    <h3
      className={cn(
        "mt-6 mb-2 text-[1.0625rem] font-medium text-foreground",
        className
      )}
      {...props}
    />
  ),
  h4: ({ className, ...props }: ComponentProps<"h4">) => (
    <h4
      className={cn("mt-4 mb-1.5 font-medium text-foreground", className)}
      {...props}
    />
  ),
  p: ({ className, ...props }: ComponentProps<"p">) => (
    <p className={cn("mb-4 text-body last:mb-0", className)} {...props} />
  ),
  ul: ({ className, ...props }: ComponentProps<"ul">) => (
    <ul
      className={cn(
        "mb-4 flex list-disc flex-col gap-1.5 pl-5 marker:text-muted-soft last:mb-0",
        className
      )}
      {...props}
    />
  ),
  ol: ({ className, ...props }: ComponentProps<"ol">) => (
    <ol
      className={cn(
        "mb-4 flex list-decimal flex-col gap-1.5 pl-5 marker:text-muted-soft last:mb-0",
        className
      )}
      {...props}
    />
  ),
  li: ({ className, ...props }: ComponentProps<"li">) => (
    <li className={cn("pl-1 text-body", className)} {...props} />
  ),
  strong: ({ className, ...props }: ComponentProps<"strong">) => (
    <strong className={cn("font-medium text-foreground", className)} {...props} />
  ),
  hr: ({ className, ...props }: ComponentProps<"hr">) => (
    <hr className={cn("my-8 border-border", className)} {...props} />
  ),
  blockquote: ({ className, ...props }: ComponentProps<"blockquote">) => (
    <blockquote
      className={cn(
        "my-4 border-l-2 border-hairline-strong pl-4 text-muted-foreground",
        className
      )}
      {...props}
    />
  ),
  a: ({ href, children, className, ...props }: ComponentProps<"a">) => {
    if (href !== undefined && isExternal(href)) {
      return (
        <ExternalLink href={href} className={className}>
          {children}
        </ExternalLink>
      );
    }
    return (
      <Link
        href={href ?? "#"}
        className={cn(
          "font-medium text-foreground underline decoration-hairline-strong underline-offset-4 transition-colors hover:decoration-foreground",
          className
        )}
        {...props}
      >
        {children}
      </Link>
    );
  },
  code: ({ children, className }: ComponentProps<"code">) => (
    <Chip className={className}>{children}</Chip>
  ),
  pre: ({ children }: ComponentProps<"pre">) => (
    <CodeBlock code={unwrapCode(children)} />
  ),

  // 작성자가 MDX 안에서 바로 쓸 수 있는 컴포넌트
  Callout,
  Chip,
  ChipPath,
  CodeBlock,
  ExternalLink,
};

// Next 16의 useMDXComponents는 인자를 받지 않는다.
export function useMDXComponents(): MDXComponents {
  return components;
}
