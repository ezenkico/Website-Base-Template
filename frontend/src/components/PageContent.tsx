"use client";

import React from "react";
import RichText from "./page-content/RichText";
import TextAndImage from "./page-content/TextAndImage";
import { StrapiEndpoints } from "@/types/strapi";
import Carousel from "./page-content/Carousel";
import Media from "./page-content/Media";
import CardContainer from "./page-content/CardContainer";

export type StrapiComponentBlock = {
  __component: string;
  id?: number | string;
  [key: string]: any;
};

type BlockRendererProps = {
  block: StrapiComponentBlock;
  endpoint: StrapiEndpoints
};

type ComponentsRegistry = Record<string, React.ComponentType<BlockRendererProps>>;

const components: ComponentsRegistry = {
    "text.rich-text" : ({ block }) => <RichText block={block as any}/>,
    "text.text-and-image": ({ block, endpoint }) => (
        <TextAndImage block={block as any} endpoint={endpoint} />
    ),
    "image.carousel": ({ block, endpoint }) => (
        <Carousel block={block as any} endpoint={endpoint} />
    ),
    "image.media": ({ block, endpoint }) => (
        <Media block={block as any} endpoint={endpoint} />
    ),
    "content.card-container": ({ block, endpoint }) => (
        <CardContainer block={block as any} endpoint={endpoint} />
    ),
}

function UnknownBlock({ block }: BlockRendererProps) {
  // Keep this simple; you can expand later (dev-only logging, etc.)
  return null;
}

export default function PageContents({ content, endpoint }: { content: StrapiComponentBlock[], endpoint: StrapiEndpoints }) {
  if (!Array.isArray(content) || content.length === 0) return null;
  console.log(content);

  return (
    <>
      {content.map((block, index) => {
        const Component = components[block.__component] ?? UnknownBlock;

        // Prefer Strapi-provided id; fall back to index to avoid crashing.
        // const key = block.id ?? `${block.__component}-${index}`; // block.id is not always unique and always present
        const key = `${block.id}${index}`;

        return <Component key={key} block={block} endpoint={endpoint} />;
      })}
    </>
  );
}
