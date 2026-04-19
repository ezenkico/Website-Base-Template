import BlogCard from "./BlogCard";
import { BlogParams } from "../BlogPageBase";
import { StrapiEndpoints } from "@/types/strapi";

export default function BlogList({
  blogs,
  endpoint,
}: {
  blogs: BlogParams[];
  endpoint: StrapiEndpoints;
}) {
  if (!blogs?.length) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center">
        <p className="text-sm text-gray-600">No blog posts found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {blogs.map((blog) => (
        <BlogCard
          key={blog.documentId || blog.id || blog.slug}
          blog={blog}
          endpoint={endpoint}
        />
      ))}
    </div>
  );
}