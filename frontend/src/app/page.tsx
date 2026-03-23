// frontend/src/app/page.tsx

import BasePageContent from "@/components/BasePageContent";
import { getStrapiEndpoint } from "@/lib/strapi";
import { fullContentResolve, populatePageContentBase } from "@/utils/page_content";
import { getStrapiData } from "@/utils/strapi-helper";
import { BadResponse } from "@/types/response";

export default async function HomePage() {

  const strapiEndpoint = getStrapiEndpoint();

  try {
    const pageData = await getStrapiData(
      strapiEndpoint,
      "home",
      {
        populate: [
          {
            field: "page_content",
            data: {
              ...populatePageContentBase(),
            },
          },
        ],
      }
    );

    const resolvedPageContent = pageData?.data?.page_content ? await fullContentResolve(
      pageData.data.page_content,
      strapiEndpoint
    ) : null;

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
                Public role does not have permission to access the Home content.
              </p>
              <p className="text-sm text-red-600 mt-2">
                Check Strapi → Settings → Roles → Public → Home → enable "find".
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
                Home Not Available (404)
              </h2>
              <p className="text-sm text-yellow-700">
                The Home entry may not exist or is still in draft.
              </p>
              <p className="text-sm text-yellow-700 mt-2">
                Create and publish the Home entry in Strapi.
              </p>
            </div>
          </div>
        );
      }
    }

    console.error(err);

    // fallback
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