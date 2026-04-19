"use client";

import { useState } from "react";
import { BlogParams } from "../BlogPageBase";
import { StrapiEndpoints } from "@/types/strapi";
import BlogList from "./BlogList";
import BlogPagination from "./BlogPagination";
import { getStrapiData } from "@/utils/strapi-helper";

type BlogBrowserProps = {
  initialBlogs: BlogParams[];
  initialPage: number;
  initialPageCount: number;
  endpoint: StrapiEndpoints;
};

type BlogListResponse = {
  data: BlogParams[];
  meta?: {
    pagination?: {
      page: number;
      pageCount: number;
    };
  };
};

export default function BlogBrowser({
  initialBlogs,
  initialPage,
  initialPageCount,
  endpoint,
}: BlogBrowserProps) {
  const [blogs, setBlogs] = useState<BlogParams[]>(initialBlogs);
  const [page, setPage] = useState<number>(initialPage);
  const [pageCount, setPageCount] = useState<number>(initialPageCount);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  async function handlePageChange(nextPage: number) {
    if (nextPage === page || nextPage < 1 || nextPage > pageCount || isLoading) {
      return;
    }

    try {
      setIsLoading(true);

      const response = await getStrapiData(endpoint, "blogs", {
        sort: { field: "publishedAt", order: "desc" },
        populate: [
          {
            field: "Image",
          },
          {
            field: "tags",
          },
        ],
        pagination: {
          page: nextPage,
          pageSize: 9,
        },
      });

      const typedResponse = response as BlogListResponse;

      setBlogs(typedResponse.data || []);
      setPage(typedResponse.meta?.pagination?.page || nextPage);
      setPageCount(typedResponse.meta?.pagination?.pageCount || 1);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <BlogList blogs={blogs} endpoint={endpoint} />

      <BlogPagination
        page={page}
        pageCount={pageCount}
        isLoading={isLoading}
        onPageChange={handlePageChange}
      />
    </div>
  );
}