"use client";

import { useEffect, useMemo, useState } from "react";
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
    <section className="w-full relative z-10 pointer-events-auto">
      <div className="mx-auto max-w-4xl">
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-gray-50">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={current?.alternativeText || ""}
              className="block w-full max-h-[500px] object-contain"
            />
          ) : (
            <div className="flex h-[300px] items-center justify-center text-sm text-gray-500">
              Image unavailable
            </div>
          )}
        </div>

        <div className="mt-4 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => goTo(index - 1)}
            className="relative z-20 pointer-events-auto rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-100"
          >
            Previous
          </button>

          <div className="text-sm text-gray-600">
            {index + 1} / {images.length}
          </div>

          <button
            type="button"
            onClick={() => goTo(index + 1)}
            className="relative z-20 pointer-events-auto rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-100"
          >
            Next
          </button>
        </div>

        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {images.map((img, i) => {
            const thumbUrl = getFullImageUrl(img, endpoint);
            const isActive = i === index;

            return (
              <button
                key={i}
                type="button"
                onClick={() => goTo(i)}
                className={`relative z-20 pointer-events-auto overflow-hidden rounded-lg border ${
                  isActive
                    ? "border-black"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                {thumbUrl ? (
                  <img
                    src={thumbUrl}
                    alt={img.alternativeText || ""}
                    className="block h-16 w-24 object-cover"
                  />
                ) : (
                  <div className="flex h-16 w-24 items-center justify-center bg-gray-100 text-xs text-gray-500">
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