import { StrapiEndpoints } from "@/types/strapi";
import PageContents from "./PageContent";
import { getFullImageUrl } from "@/utils/strapi-helper";

export interface BlogParams {
  Title: string;
  documentId: string;
  id: number;
  Image?: any;
  excerpt?: string;
  slug: string;
  tags?: {
    documentId: string;
    id: string;
    tag: string;
  }[];
}

export default function BlogPageBase({
  blog,
  resolvedPageContent,
  endpoint,
}: {
  blog: BlogParams;
  resolvedPageContent: any;
  endpoint: StrapiEndpoints;
}) {

  console.log(blog.Image);
  const imageUrl = blog.Image
    ? getFullImageUrl(blog.Image, endpoint)
    : null;

  const imageAlt =
    blog.Image?.alternativeText ||
    blog.Image?.caption ||
    blog.Title ||
    "Blog image";

  console.log(imageUrl);

  return (
    <article className="th-blog-page w-full flex justify-center px-4 py-10">
      <div className="th-blog-page-inner w-full max-w-3xl flex flex-col gap-8">
        {/* th-blog-page-image-wrap: featured image container */}
        {imageUrl && (
          <div className="th-blog-page-image-wrap w-full overflow-hidden rounded-2xl">
            <img
              src={imageUrl}
              alt={imageAlt}
              className="th-blog-page-image w-full h-auto object-cover"
            />
          </div>
        )}

        {/* th-blog-page-header: header content */}
        <header className="th-blog-page-header flex flex-col gap-4">
          <h1 className="th-blog-page-title text-3xl md:text-4xl font-bold leading-tight">
            {blog.Title}
          </h1>

          {blog.excerpt && (
            <p className="th-blog-page-excerpt text-lg text-gray-600 leading-relaxed">
              {blog.excerpt}
            </p>
          )}

          {blog.tags?.length ? (
            <div className="th-blog-tags flex flex-wrap gap-2">
              {blog.tags.map((tag) => (
                <span
                  key={tag.documentId || tag.id}
                  className="th-blog-tag rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700"
                >
                  {tag.tag}
                </span>
              ))}
            </div>
          ) : null}
        </header>

        {/* th-blog-page-divider: divider between header and content */}
        <div className="th-blog-page-divider border-t border-gray-200" />

        {/* th-blog-page-content: main article body */}
        {resolvedPageContent?.content ? (
          <div className="th-blog-page-content">
            <PageContents
              content={resolvedPageContent.content}
              endpoint={endpoint}
            />
          </div>
        ) : null}
      </div>
    </article>
  );
}