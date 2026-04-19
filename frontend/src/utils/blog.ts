import { getStrapiEndpoint } from "@/lib/strapi";
import { GetData, getStrapiData } from "./strapi-helper";
import { fullContentResolve } from "./page_content";
import { populatePageContentBase } from "./page_content"; // assuming this exists

export function getBlogPopulateBase(): GetData["populate"] {
  return {
    Image: true,
    tags: true,
    Seo: {
      populate: {
        shareImage: true,
      },
    },
    page_content: populatePageContentBase(),
  };
}

export async function getBlogBySlug(slug: string, draft?: boolean) {
  const endpoint = getStrapiEndpoint();

  const searchData: GetData = {
    filters: {
      slug: { $eq: slug },
    },
    populate: getBlogPopulateBase(),
    ...(draft && { publicationState: "preview" }),
  };

  const response = await getStrapiData(endpoint, "blogs", searchData);
  const blog = response?.data?.[0];

  if (!blog) return null;

  const resolvedPageContent = blog.page_content
    ? await fullContentResolve(blog.page_content, endpoint)
    : null;

  return {
    endpoint,
    blog: {
      ...blog,
      page_content: resolvedPageContent,
    },
  };
}