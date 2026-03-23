"use client"

import { StrapiEndpoints } from "@/types/strapi";
import PageContents from "./PageContent";

export default function BasePageContent({
  page_content,
  strapiEndpoint,
}: {
  page_content: any;
  strapiEndpoint: StrapiEndpoints;
}) {
  if (!page_content) {
    return (
      <div className="flex items-center justify-center w-full py-24 px-6">
        <div className="max-w-md w-full text-center border border-dashed border-gray-300 rounded-xl p-8">
          <h2 className="text-lg font-semibold mb-2">No Page Content Found</h2>
          <p className="text-sm text-gray-600">
            This page has no content configured yet.
          </p>
          <p className="text-sm text-gray-600 mt-2">
            Add content in Strapi using the Page Content system.
          </p>
        </div>
      </div>
    );
  }

  return (
    <PageContents
      content={page_content.content}
      endpoint={strapiEndpoint}
    />
  );
}