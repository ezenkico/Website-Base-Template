"use client";

import { getFullImageUrl } from "@/utils/strapi-helper";
import { StrapiEndpoints } from "@/types/strapi";
import RichText, { RichTextBlock } from "./RichText";

type TextAndImageBlock = {
  id?: number | string;
  Text?: RichTextBlock;
  Image?: any;
  imagePosition?: "Left" | "Right";
};


export default function TextAndImage({
  block,
  endpoint,
}: {
  block: TextAndImageBlock;
  endpoint: StrapiEndpoints;
}) {
  const imageUrl = block.Image
    ? getFullImageUrl(block.Image, endpoint)
    : undefined;

  const altText =
    block.Image?.alternativeText ?? block.Image?.caption ?? "Content image";

  const isImageLeft = block.imagePosition === "Left";

  console.log(block.Text);

  return (
    // th-text-and-image: outer section for text-and-image block
    <section className="th-text-and-image py-12">
      {/* th-text-and-image-inner: width-constrained inner wrapper */}
      <div
        className={`th-text-and-image-inner mx-auto grid max-w-7xl gap-8 px-6 md:grid-cols-2 md:items-start ${
          isImageLeft
            ? ""
            : "md:[&>*:first-child]:order-2 md:[&>*:last-child]:order-1"
        }`}
      >
        {/* th-text-and-image-media-column: image column */}
        <div className="th-text-and-image-media-column">
          {imageUrl ? (
            // th-text-and-image-image-wrap: image frame/container
            <div className="th-text-and-image-image-wrap relative aspect-[4/3] overflow-hidden rounded-2xl border bg-gray-100">
              <img
                src={imageUrl}
                alt={altText}
                className="th-text-and-image-image h-full w-full object-cover"
              />
            </div>
          ) : null}
        </div>

        {/* th-text-and-image-text-column: text column */}
        <div className="th-text-and-image-text-column self-start flex flex-col justify-start">
          {block.Text ? (
            <RichText
              block={block.Text}
            />
          ) : null}
        </div>
      </div>
    </section>
  );
}