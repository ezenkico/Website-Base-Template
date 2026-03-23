import { FC } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import clsx from "clsx";

interface StandardMarkdownProps {
  children: string;
  className?: string;        // extra wrapper classes if you want
  proseClassName?: string;   // customize prose styles
}

const schema = {
  ...defaultSchema,
  tagNames: [...(defaultSchema.tagNames ?? []), "u"],
  attributes: {
    ...(defaultSchema.attributes ?? {}),
    u: ["className"], // allow Tailwind class on <u>
  },
};

/**
 * Tailwind-only Markdown renderer (no rehype).
 * - Uses Tailwind Typography (`prose`) for nice defaults
 * - Disables raw HTML for safety (`skipHtml`)
 * - Custom element renderers add utility classes for code, tables, images, etc.
 */
const StandardMarkdown: FC<StandardMarkdownProps> = ({
  children,
  className,
  proseClassName,
}) => {
  return (
    <div className={clsx("max-w-none", className)}>
      <ReactMarkdown
        skipHtml={false}
        rehypePlugins={[rehypeRaw, [rehypeSanitize, schema]]}
        // Map markdown elements to Tailwind-styled components
        components={{
          h1: ({ node, ...props }) => (
            <h1 className="mt-6 mb-4 font-bold text-3xl lg:text-4xl tracking-tight scroll-m-20" {...props} />
          ),
          h2: ({ node, ...props }) => (
            <h2 className="mt-6 mb-3 pb-2 border-b font-semibold text-2xl tracking-tight scroll-m-20" {...props} />
          ),
          h3: ({ node, ...props }) => (
            <h3 className="mt-5 mb-2 font-semibold text-xl tracking-tight scroll-m-20" {...props} />
          ),
          h4: ({ node, ...props }) => (
            <h4 className="mt-4 mb-2 font-semibold text-lg tracking-tight scroll-m-20" {...props} />
          ),
          p: ({ node, ...props }) => (
            <p className="my-4 leading-7" {...props} />
          ),
          ul: ({ node, ...props }) => (
            <ul className="my-4 ml-6 dark:marker:text-neutral-400 marker:text-neutral-500 list-disc" {...props} />
          ),
          ol: ({ node, ...props }) => (
            <ol className="my-4 ml-6 dark:marker:text-neutral-400 marker:text-neutral-500 list-decimal" {...props} />
          ),
          li: ({ node, ...props }) => (
            <li className="my-1" {...props} />
          ),
          blockquote: ({ node, ...props }) => (
            <blockquote className="mt-6 pl-4 border-l-4 text-neutral-700 dark:text-neutral-300 italic" {...props} />
          ),
          hr: ({ node, ...props }) => (
            <hr className="my-8 border-neutral-200 dark:border-neutral-800" {...props} />
          ),
          a: ({ node, ...props }) => (
            <a
              className="text-blue-700 dark:text-blue-400 decoration-neutral-300 hover:decoration-neutral-500 underline underline-offset-4"
              target="_blank"
              rel="noreferrer"
              {...props}
            />
          ),
          table: ({ node, ...props }) => (
            <div className="my-6 border border-neutral-200 dark:border-neutral-800 rounded-xl w-full overflow-x-auto">
              <table className="w-full text-sm text-left" {...props} />
            </div>
          ),
          thead: ({ node, ...props }) => (
            <thead className="bg-neutral-50 dark:bg-neutral-900/50" {...props} />
          ),
          th: ({ node, ...props }) => (
            <th className="px-3 py-2 border-neutral-200 dark:border-neutral-800 border-b font-semibold" {...props} />
          ),
          td: ({ node, ...props }) => (
            <td className="px-3 py-2 border-neutral-200 dark:border-neutral-800 border-b align-top" {...props} />
          ),
          pre: ({ node, ...props }) => (
            <pre className="bg-neutral-950 shadow-inner my-4 p-4 rounded-xl overflow-x-auto text-neutral-50" {...props} />
          ),
          code: ({ className: _cn, children, ...props }) => {
            // block code (ReactMarkdown usually wraps <code> with a <pre> above)
            return (
              <code
                className="block font-mono text-sm"
                {...props}
              >
                {children}
              </code>
            );
          },
          img: ({ node, ...props }) => (
            <img
              className="shadow my-4 border border-neutral-200 dark:border-neutral-800 rounded-xl w-auto max-w-full max-h-[28rem]"
              loading="lazy"
              {...props}
            />
          ),
          u: ({ node, ...props }) => (
            <u className="underline underline-offset-4" {...props} />
          )
        }}
        // `prose` wrapper via `remark/rehype` isn’t needed—just wrap output with a styled div.
        // We emulate that here by wrapping the entire markdown in a Tailwind-typography container:
      >
        {/* We pass children as-is. */}
        {children}
      </ReactMarkdown>
    </div>
  );
};

export default StandardMarkdown;
