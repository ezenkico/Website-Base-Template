"use client";

import StandardMarkdown from "@/components/ui/StandardMarkdown";

export type RichTextBlock = {
  __component: "shared.rich-text";
  id?: number | string;
  body?: string;
  Orientation?: "Left" | "Right" | "Center";
};

const alignmentMap: Record<NonNullable<RichTextBlock["Orientation"]>, string> = {
  Left: "text-left",
  Right: "text-right",
  Center: "text-center",
};

export default function RichText({ block }: { block: RichTextBlock }) {
  if (!block?.body) return null;

  const alignment =
    block.Orientation && alignmentMap[block.Orientation]
      ? alignmentMap[block.Orientation]
      : "text-left";

  return (
    // th-rich-text: outer wrapper for rich text block
    <section className={`th-rich-text w-full self-start place-self-start ${alignment}`}>
      <StandardMarkdown
        className="th-rich-text-inner"
        proseClassName="th-rich-text-prose"
      >
        {block.body}
      </StandardMarkdown>
    </section>
  );
}