import BasePageContent from "@/components/BasePageContent";
import { getStrapiEndpoint } from "@/lib/strapi";
import { fullContentResolve, populatePageContentBase } from "@/utils/page_content";
import { getStrapiData } from "@/utils/strapi-helper";
import { BadResponse } from "@/types/response"; // adjust if needed

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function DynamicPage({ params }: PageProps) {
  const { slug } = await params;
  const strapiEndpoint = getStrapiEndpoint();

  try {
    const pageData = await getStrapiData(strapiEndpoint, "pages", {
      filters: {
        slug: { $eq: slug },
      },
      populate: {
        page_content: populatePageContentBase(),
      },
      pagination: {
        page: 1,
        pageSize: 1,
      },
    });

    const page = pageData?.data?.[0] ?? null;

    if (!page) {
      return (
        <div className="flex items-center justify-center w-full py-24 px-6">
          <div className="max-w-md w-full text-center border border-yellow-300 rounded-xl p-8 bg-yellow-50">
            <h2 className="text-lg font-semibold mb-2 text-yellow-700">
              Page Not Found
            </h2>
            <p className="text-sm text-yellow-700">
              No published page was found for this slug.
            </p>
            <p className="text-sm text-yellow-700 mt-2">
              Check the slug, publish the page, and make sure show is enabled.
            </p>
          </div>
        </div>
      );
    }

    const resolvedPageContent = page?.page_content
      ? await fullContentResolve(page.page_content, strapiEndpoint)
      : null;

    return (
      <BasePageContent
        page_content={resolvedPageContent}
        strapiEndpoint={strapiEndpoint}
      />
    );
  } catch (err: any) {
    if (err instanceof BadResponse) {
      if (err.status === 403) {
        return (
          <div className="flex items-center justify-center w-full py-24 px-6">
            <div className="max-w-md w-full text-center border border-red-300 rounded-xl p-8 bg-red-50">
              <h2 className="text-lg font-semibold mb-2 text-red-700">
                Access Denied (403)
              </h2>
              <p className="text-sm text-red-600">
                Public role does not have permission to access Pages content.
              </p>
              <p className="text-sm text-red-600 mt-2">
                Check Strapi permissions for the Page collection.
              </p>
            </div>
          </div>
        );
      }

      if (err.status === 404) {
        return (
          <div className="flex items-center justify-center w-full py-24 px-6">
            <div className="max-w-md w-full text-center border border-yellow-300 rounded-xl p-8 bg-yellow-50">
              <h2 className="text-lg font-semibold mb-2 text-yellow-700">
                Page Not Found
              </h2>
              <p className="text-sm text-yellow-700">
                This page does not exist or is still in draft.
              </p>
            </div>
          </div>
        );
      }
    }

    return (
      <div className="flex items-center justify-center w-full py-24 px-6">
        <div className="max-w-md w-full text-center border border-gray-300 rounded-xl p-8">
          <h2 className="text-lg font-semibold mb-2">
            Unexpected Error
          </h2>
          <p className="text-sm text-gray-600">
            Something went wrong while loading the page.
          </p>
        </div>
      </div>
    );
  }
}