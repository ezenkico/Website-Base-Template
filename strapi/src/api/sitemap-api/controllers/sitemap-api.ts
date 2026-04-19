// src/api/sitemap-api/controllers/sitemap-api.ts

type SitemapEntry = {
  loc: string;
  lastmod?: string;
};

type SitemapSource = {
  name: string;
  getEntries: () => Promise<SitemapEntry[]>;
};

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function normalizeBaseUrl(url: string): string {
  return url.endsWith("/") ? url.slice(0, -1) : url;
}

function getSiteUrl(): string {
  const siteUrl =
    process.env.FRONTEND_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    "http://localhost:3000";

  return normalizeBaseUrl(siteUrl);
}

function buildSitemapIndexXml(names: string[]): string {
  const siteUrl = getSiteUrl();

  const body = names
    .map(
      (name) => `
  <sitemap>
    <loc>${escapeXml(`${siteUrl}/api/sitemap/${name}.xml`)}</loc>
  </sitemap>`
    )
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${body}
</sitemapindex>`;
}

function buildUrlSetXml(entries: SitemapEntry[]): string {
  const body = entries
    .map((entry) => {
      const lastmod = entry.lastmod
        ? `\n    <lastmod>${escapeXml(entry.lastmod)}</lastmod>`
        : "";

      return `
  <url>
    <loc>${escapeXml(entry.loc)}</loc>${lastmod}
  </url>`;
    })
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${body}
</urlset>`;
}

function getSitemapSources(): SitemapSource[] {
  const siteUrl = getSiteUrl();

  return [
    {
      name: "pages",
      getEntries: async () => {
        const pages = await strapi.documents("api::page.page").findMany({
          status: "published",
          filters: {
            show: {
              $eq: true,
            },
          },
          fields: ["slug", "updatedAt"],
          sort: ["updatedAt:desc"],
        });

        return pages
          .filter((page: any) => !!page?.slug)
          .map((page: any) => ({
            loc: `${siteUrl}/page/${page.slug}`,
            lastmod: page.updatedAt,
          }));
      },
    },
    {
      name: "blogs",
      getEntries: async () => {
        const pages = await strapi.documents("api::blog.blog").findMany({
          status: "published",
          fields: ["slug", "updatedAt"],
          sort: ["updatedAt:desc"],
        });

        return pages
          .filter((page: any) => !!page?.slug)
          .map((page: any) => ({
            loc: `${siteUrl}/blog/${page.slug}`,
            lastmod: page.updatedAt,
          }));
      }
    }
  ];
}

export default {
  async setupSitemapIndex(ctx: any) {
    const sources = getSitemapSources();
    const xml = buildSitemapIndexXml(sources.map((source) => source.name));

    ctx.set("Content-Type", "application/xml; charset=utf-8");
    ctx.body = xml;
  },

  async setupSitemap(ctx: any) {
    const { name } = ctx.params;
    console.log(name);
    const sources = getSitemapSources();
    const source = sources.find((item) => item.name === name);
    

    if (!source) {
      return ctx.notFound(`Sitemap "${name}" not found`);
    }

    const entries = await source.getEntries();
    const xml = buildUrlSetXml(entries);

    ctx.set("Content-Type", "application/xml; charset=utf-8");
    ctx.body = xml;
  },
};