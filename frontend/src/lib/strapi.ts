import { StrapiEndpoints } from "@/types/strapi";

export function getStrapiEndpoint(): StrapiEndpoints{
  // TODO: Remove the localhost once we have a production domain
  return {
    backend: process.env.STRAPI_BACKEND ?? "http://localhost:1337",
    frontend: process.env.STRAPI_FRONTEND ?? "http://localhost:1337"
  }
}

export type StrapiMedia = {
  url?: string;
  alternativeText?: string | null;
  caption?: string | null;
  mime?: string;
  width?: number;
  height?: number;
  formats?: Record<string, { url?: string; width?: number; height?: number }>;
};

// Helper to get full image URL
export const getFullImageUrl = (image: any): string | undefined => {
    const imageUrl = getImageUrl(image);
    if (!imageUrl) return undefined;
    // If URL is already absolute, return as is
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
        return imageUrl;
    }
    // Otherwise, prepend Strapi frontend URL
    return `${getStrapiEndpoint().frontend}${imageUrl}`;
};

export function getImageUrl(m?: StrapiMedia): string | undefined {
  if (!m) return undefined;
  // prefer a reasonable responsive size if present
  const formats = m.formats ?? {};
  return (
    formats.large?.url ||
    formats.medium?.url ||
    formats.small?.url ||
    formats.thumbnail?.url ||
    m.url
  );
}
