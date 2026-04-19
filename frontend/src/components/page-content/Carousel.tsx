"use client";

import { useMemo, useState } from "react";
import { StrapiEndpoints, StrapiMedia } from "@/types/strapi";
import { getFullImageUrl } from "@/utils/strapi-helper";

type Props = {
  block: CarouselBlock;
  endpoint: StrapiEndpoints;
};

export type CarouselBlock = {
  __component: "image.carousel";
  id?: number | string;
  Images?: StrapiMedia[];
};

export default function Carousel({ block, endpoint }: Props) {
  const images = useMemo(() => block.Images ?? [], [block.Images]);
  const [index, setIndex] = useState(0);

  const goTo = (nextIndex: number) => {
    if (!images.length) return;

    if (nextIndex < 0) {
      setIndex(images.length - 1);
      return;
    }

    if (nextIndex >= images.length) {
      setIndex(0);
      return;
    }

    setIndex(nextIndex);
  };

  if (!images.length) return null;

  const current = images[index];
  const imageUrl = getFullImageUrl(current, endpoint);

  return (
    // th-carousel: outer section for the carousel block
    <section className="th-carousel relative z-10 w-full pointer-events-auto">
      {/* th-carousel-inner: width-constrained inner wrapper */}
      <div className="th-carousel-inner mx-auto max-w-4xl">
        {/* th-carousel-stage: main image stage container */}
        <div className="th-carousel-stage overflow-hidden rounded-2xl border border-gray-200 bg-gray-50">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={current?.alternativeText || ""}
              className="th-carousel-image block max-h-[500px] w-full object-contain"
            />
          ) : (
            // th-carousel-empty: fallback when image is unavailable
            <div className="th-carousel-empty flex h-[300px] items-center justify-center text-sm text-gray-500">
              Image unavailable
            </div>
          )}
        </div>

        {/* th-carousel-controls: previous / status / next row */}
        <div className="th-carousel-controls mt-4 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => goTo(index - 1)}
            className="th-carousel-button th-carousel-button-prev relative z-20 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium pointer-events-auto hover:bg-gray-100"
          >
            Previous
          </button>

          {/* th-carousel-status: current position indicator */}
          <div className="th-carousel-status text-sm text-gray-600">
            {index + 1} / {images.length}
          </div>

          <button
            type="button"
            onClick={() => goTo(index + 1)}
            className="th-carousel-button th-carousel-button-next relative z-20 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium pointer-events-auto hover:bg-gray-100"
          >
            Next
          </button>
        </div>

        {/* th-carousel-thumbs: thumbnail button list */}
        <div className="th-carousel-thumbs mt-4 flex flex-wrap justify-center gap-2">
          {images.map((img, i) => {
            const thumbUrl = getFullImageUrl(img, endpoint);
            const isActive = i === index;

            return (
              <button
                key={i}
                type="button"
                onClick={() => goTo(i)}
                className={`th-carousel-thumb relative z-20 overflow-hidden rounded-lg border pointer-events-auto ${
                  isActive
                    ? "th-carousel-thumb-active border-black"
                    : "th-carousel-thumb-inactive border-gray-300 hover:border-gray-400"
                }`}
              >
                {thumbUrl ? (
                  <img
                    src={thumbUrl}
                    alt={img.alternativeText || ""}
                    className="th-carousel-thumb-image block h-16 w-24 object-cover"
                  />
                ) : (
                  // th-carousel-thumb-empty: thumbnail fallback
                  <div className="th-carousel-thumb-empty flex h-16 w-24 items-center justify-center bg-gray-100 text-xs text-gray-500">
                    No image
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}