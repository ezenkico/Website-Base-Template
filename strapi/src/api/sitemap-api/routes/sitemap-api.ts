export default {
  routes: [
    {
      method: "GET",
      path: "/sitemap.xml",
      handler: "api::sitemap-api.sitemap-api.setupSitemapIndex",
      config: {
        auth: false,
      },
    },
    {
      method: "GET",
      path: "/sitemap/:name.xml",
      handler: "api::sitemap-api.sitemap-api.setupSitemap",
      config: {
        auth: false,
      },
    },
  ],
};