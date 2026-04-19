// app/blog/[slug]/page.tsx
import { Metadata } from "next";
import { notFound } from "next/navigation";

import PageContents from "@/components/PageContent";
import { getFullImageUrl, getStrapiData } from "@/utils/strapi-helper";
import { getBlogBySlug } from "@/utils/blog";
import BlogPageBase from "@/components/BlogPageBase";

type BlogPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({
  params,
}: BlogPageProps): Promise<Metadata> {
  const { slug } = await params;
  const result = await getBlogBySlug(slug);

  if (!result?.blog) {
    return {};
  }

  const { blog, endpoint } = result;

  const title = blog.Seo?.metaTitle || blog.Title;
  const description = blog.Seo?.metaDescription || blog.excerpt || undefined;

  const seoImage =
    getFullImageUrl(blog.Seo?.shareImage, endpoint) ||
    getFullImageUrl(blog.Image, endpoint);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: seoImage ? [seoImage] : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: seoImage ? [seoImage] : [],
    },
  };
}

export default async function BlogPage({ params }: BlogPageProps) {
  const { slug } = await params;
  const result = await getBlogBySlug(slug);

  if (!result?.blog) {
    notFound();
  }

  const { blog, endpoint } = result;

  return <BlogPageBase
    blog={blog}
    resolvedPageContent={blog.page_content}
    endpoint={endpoint}
    />;
}