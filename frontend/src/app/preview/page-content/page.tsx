// app/preview/page-content/page.tsx
import jwt from "jsonwebtoken";
import { notFound } from "next/navigation";

import { getStrapiEndpoint } from "@/lib/strapi";
import { getStrapiDataById } from "@/utils/strapi-helper";
import { fullContentResolve } from "@/utils/page_content";
import { populatePageContentBase } from "@/utils/page_content";
import BasePageContent from "@/components/BasePageContent";

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
    console.log("Secret: ",secret);
    if (!secret) throw new Error("Missing PREVIEW_SECRET");
    console.log("Past secret");

    const payload = jwt.verify(token, secret) as PreviewTokenPayload;

    console.log("internal payload: ", JSON.stringify(payload))

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

export default async function PreviewPage({ searchParams }: PreviewPageProps) {
  const { token } = await searchParams;
  console.log("Check: ", token);

  if (!token) notFound();

  const payload = verifyPreviewToken(token);
  console.log("Payload: ", JSON.stringify(payload));
  if (!payload?.documentId) notFound();

  const endpoint = getStrapiEndpoint();
  
  const apiToken = process.env.STRAPI_TOKEN;

  const response = await getStrapiDataById(
    endpoint,
    "page-contents",
    payload.documentId,
    {
      ...populatePageContentBase(),
      status: "draft",
    },
    apiToken
  );

  console.log(response);

  const pageContent = response?.data;
  if (!pageContent) notFound();

  const resolvedContent = await fullContentResolve(pageContent, endpoint, apiToken, true);

  console.log("Flarg");

  return <BasePageContent page_content={resolvedContent} strapiEndpoint={endpoint} />;
}