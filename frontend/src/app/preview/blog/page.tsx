import PageContents from "@/components/PageContent";
import { getBlogBySlug, getBlogPopulateBase } from "@/utils/blog";
import { notFound } from "next/navigation";
import jwt from "jsonwebtoken";
import { fullContentResolve } from "@/utils/page_content";
import { getStrapiEndpoint } from "@/lib/strapi";
import { getStrapiDataById } from "@/utils/strapi-helper";
import BlogPageBase from "@/components/BlogPageBase";

type PreviewTokenPayload = {
  documentId: string;
  uid?: string;
  exp?: number;
};

type PreviewPageProps = {
  searchParams: Promise<{
    token?: string;
  }>;
};

function verifyPreviewToken(token: string): PreviewTokenPayload | null {
  try {
    const secret = process.env.PREVIEW_SECRET;
    if (!secret) throw new Error("Missing PREVIEW_SECRET");

    const payload = jwt.verify(token, secret) as PreviewTokenPayload;

    if (!payload?.documentId) return null;

    return {
      documentId: String(payload.documentId),
      uid: payload.uid ? String(payload.uid) : undefined,
      exp: typeof payload.exp === "number" ? payload.exp : undefined,
    };
  } catch {
    console.log("Invalid token");
    return null;
  }
}

export default async function BlogPage({ searchParams }: PreviewPageProps) {
  const { token } = await searchParams;
  
    if (!token) notFound();

    const payload = verifyPreviewToken(token);
    if (!payload?.documentId) notFound();

    console.log(payload);

    const endpoint = getStrapiEndpoint();

    const apiToken = process.env.STRAPI_TOKEN;

    const response = await getStrapiDataById(
        endpoint,
        "blogs",
        payload.documentId,
        {
        populate: getBlogPopulateBase(),
        status: "draft",
        },
        apiToken
    );

  const blog = response?.data;
  
    if (!blog) return null;
  
    const resolvedPageContent = blog.page_content
      ? await fullContentResolve(blog.page_content, endpoint)
      : null;

    console.log(blog);
  return <BlogPageBase
  blog={blog}
  resolvedPageContent={resolvedPageContent}
  endpoint={endpoint}
  />;
}