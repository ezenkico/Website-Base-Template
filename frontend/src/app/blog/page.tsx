import BlogBrowser from "@/components/blog/BlogBrowser";
import { BlogParams } from "@/components/BlogPageBase";
import { getStrapiEndpoint } from "@/lib/strapi";
import { getStrapiData } from "@/utils/strapi-helper";

type BlogListResponse = {
  data: BlogParams[];
  meta?: {
    pagination?: {
      page: number;
      pageCount: number;
    };
  };
};

export default async function BlogIndexPage() {
  const endpoint = getStrapiEndpoint();

  const response = (await getStrapiData(endpoint, "blogs", {
    sort: "publishedAt:desc",
    populate: {
      Image: true,
      tags: true,
    },
    pagination: {
      page: 1,
      pageSize: 9,
    },
  })) as BlogListResponse;

  const blogs = response?.data || [];
  const page = response?.meta?.pagination?.page || 1;
  const pageCount = response?.meta?.pagination?.pageCount || 1;

  return (
    <div className="w-full flex justify-center px-4 py-10">
      <div className="w-full max-w-6xl flex flex-col gap-8">
        <div className="flex flex-col gap-3">
          <h1 className="text-3xl md:text-4xl font-bold leading-tight">
            Blog
          </h1>
          <p className="text-base text-gray-600 max-w-2xl">
            Articles, updates, and ideas.
          </p>
        </div>

        <BlogBrowser
          initialBlogs={blogs}
          initialPage={page}
          initialPageCount={pageCount}
          endpoint={endpoint}
        />
      </div>
    </div>
  );
}