import { FC } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import clsx from "clsx";

interface StandardMarkdownProps {
  children: string;
  className?: string;
  proseClassName?: string;
}

const schema = {
  ...defaultSchema,
  tagNames: [...(defaultSchema.tagNames ?? []), "u"],
  attributes: {
    ...(defaultSchema.attributes ?? {}),
    u: ["className"],
  },
};

const StandardMarkdown: FC<StandardMarkdownProps> = ({
  children,
  className,
  proseClassName,
}) => {
  return (
    // th-markdown: outer wrapper for markdown renderer
    <div className={clsx("th-markdown max-w-none", className)}>
      {/* th-markdown-prose: inner prose wrapper for all rendered markdown */}
      <div className={clsx("th-markdown-prose", proseClassName)}>
        <ReactMarkdown
          skipHtml={false}
          rehypePlugins={[rehypeRaw, [rehypeSanitize, schema]]}
          components={{
            h1: ({ node, ...props }) => (
              <h1
                className="th-markdown-h1 mt-6 mb-4 scroll-m-20 text-3xl font-bold tracking-tight lg:text-4xl"
                {...props}
              />
            ),
            h2: ({ node, ...props }) => (
              <h2
                className="th-markdown-h2 mt-6 mb-3 scroll-m-20 pb-2 text-2xl font-semibold tracking-tight"
                {...props}
              />
            ),
            h3: ({ node, ...props }) => (
              <h3
                className="th-markdown-h3 mt-5 mb-2 scroll-m-20 text-xl font-semibold tracking-tight"
                {...props}
              />
            ),
            h4: ({ node, ...props }) => (
              <h4
                className="th-markdown-h4 mt-4 mb-2 text-lg font-semibold tracking-tight"
                {...props}
              />
            ),
            p: ({ node, ...props }) => (
              <p className="th-markdown-p my-4 leading-7" {...props} />
            ),
            ul: ({ node, ...props }) => (
              <ul
                className="th-markdown-ul my-4 ml-6 list-disc marker:text-neutral-500 dark:marker:text-neutral-400"
                {...props}
              />
            ),
            ol: ({ node, ...props }) => (
              <ol
                className="th-markdown-ol my-4 ml-6 list-decimal marker:text-neutral-500 dark:marker:text-neutral-400"
                {...props}
              />
            ),
            li: ({ node, ...props }) => (
              <li className="th-markdown-li my-1" {...props} />
            ),
            blockquote: ({ node, ...props }) => (
              <blockquote
                className="th-markdown-blockquote mt-6 border-l-4 pl-4 italic text-neutral-700 dark:text-neutral-300"
                {...props}
              />
            ),
            hr: ({ node, ...props }) => (
              <hr
                className="th-markdown-hr my-8 border-neutral-200 dark:border-neutral-800"
                {...props}
              />
            ),
            a: ({ node, ...props }) => (
              <a
                className="th-markdown-link text-blue-700 underline underline-offset-4 decoration-neutral-300 hover:decoration-neutral-500 dark:text-blue-400"
                target="_blank"
                rel="noreferrer"
                {...props}
              />
            ),
            table: ({ node, ...props }) => (
              // th-markdown-table-wrap: scrolling table container
              <div className="th-markdown-table-wrap my-6 w-full overflow-x-auto rounded-xl border border-neutral-200 dark:border-neutral-800">
                <table
                  className="th-markdown-table w-full text-left text-sm"
                  {...props}
                />
              </div>
            ),
            thead: ({ node, ...props }) => (
              <thead
                className="th-markdown-thead bg-neutral-50 dark:bg-neutral-900/50"
                {...props}
              />
            ),
            th: ({ node, ...props }) => (
              <th
                className="th-markdown-th border-b border-neutral-200 px-3 py-2 font-semibold dark:border-neutral-800"
                {...props}
              />
            ),
            td: ({ node, ...props }) => (
              <td
                className="th-markdown-td border-b border-neutral-200 px-3 py-2 align-top dark:border-neutral-800"
                {...props}
              />
            ),
            pre: ({ node, ...props }) => (
              <pre
                className="th-markdown-pre my-4 overflow-x-auto rounded-xl bg-neutral-950 p-4 text-neutral-50 shadow-inner"
                {...props}
              />
            ),
            code: ({ className: _cn, children, ...props }) => {
              return (
                <code
                  className="th-markdown-code block font-mono text-sm"
                  {...props}
                >
                  {children}
                </code>
              );
            },
            img: ({ node, ...props }) => (
              <img
                className="th-markdown-img my-4 max-h-[28rem] w-auto max-w-full rounded-xl border border-neutral-200 shadow dark:border-neutral-800"
                loading="lazy"
                {...props}
              />
            ),
            u: ({ node, ...props }) => (
              <u
                className="th-markdown-u underline underline-offset-4"
                {...props}
              />
            ),
          }}
        >
          {children}
        </ReactMarkdown>
      </div>
    </div>
  );
};

export default StandardMarkdown;