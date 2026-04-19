import { getFullImageUrl } from "@/utils/strapi-helper";
import Link from "next/link";
import { BlogParams } from "../BlogPageBase";
import { StrapiEndpoints } from "@/types/strapi";

export default function BlogCard({
  blog,
  endpoint,
}: {
  blog: BlogParams;
  endpoint: StrapiEndpoints;
}) {
  const imageUrl = blog.Image ? getFullImageUrl(blog.Image, endpoint) : null;

  return (
    <Link
      href={`/blog/${blog.slug}`}
      className="group block overflow-hidden rounded-2xl border border-gray-200 bg-white transition hover:-translate-y-0.5 hover:shadow-md"
    >
      {imageUrl && (
        <div className="aspect-[16/9] w-full overflow-hidden bg-gray-100">
          <img
            src={imageUrl}
            alt={blog.Title}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
          />
        </div>
      )}

      <div className="flex flex-col gap-4 p-5">
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold leading-tight text-gray-900 transition group-hover:text-gray-700">
            {blog.Title}
          </h2>

          {blog.excerpt && (
            <p className="line-clamp-3 text-sm leading-6 text-gray-600">
              {blog.excerpt}
            </p>
          )}
        </div>

        {blog.tags?.length ? (
          <div className="flex flex-wrap gap-2">
            {blog.tags.map((tag: any) => (
              <span
                key={tag.documentId || tag.id}
                className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700"
              >
                {tag.tag}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </Link>
  );
}