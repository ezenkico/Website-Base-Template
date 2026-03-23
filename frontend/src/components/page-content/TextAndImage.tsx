"use client";

import { getFullImageUrl } from "@/utils/strapi-helper";
import { StrapiEndpoints } from "@/types/strapi";

type TextAndImageBlock = {
  id?: number | string;
  Text?: string;
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

  return (
    <section className="py-12">
      <div
        className={`mx-auto grid max-w-7xl gap-8 px-6 md:grid-cols-2 md:items-center ${
          block.imagePosition === "Left"
            ? ""
            : "md:[&>*:first-child]:order-2 md:[&>*:last-child]:order-1"
        }`}
      >
        <div>
          {imageUrl ? (
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border bg-gray-100">
              <img
                src={imageUrl}
                alt={altText}
                className="object-cover"
              />
            </div>
          ) : null}
        </div>

        <div>
          {block.Text ? (
            <div
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: block.Text }}
            />
          ) : null}
        </div>
      </div>
    </section>
  );
}