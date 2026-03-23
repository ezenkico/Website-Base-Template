function getSecurity(env: any){
  const cfPublic = env("CF_PUBLIC_ACCESS_URL")
  if(cfPublic){
    return {
      name: "strapi::security",
      config: {
        contentSecurityPolicy: {
          useDefaults: true,
          directives: {
            "connect-src": ["'self'", "https:"],
            "img-src": [
              "'self'",
              "data:",
              "blob:",
              "market-assets.strapi.io",
              cfPublic.replace(/^https?:\/\//, ""),
            ],
            "media-src": [
              "'self'",
              "data:",
              "blob:",
              "market-assets.strapi.io",
              cfPublic.replace(/^https?:\/\//, ""),
            ],
            upgradeInsecureRequests: null,
          },
        },
      },
    }
  }

  return 'strapi::security'
}

export default ({env}) => {
  const security = getSecurity(env);

  return [
  'strapi::logger',
  'strapi::errors',
  {
    name: 'strapi::body',
    config: {
      includeUnparsed: true,
    },
  },
  security,
  'strapi::cors',
  'strapi::poweredBy',
  'strapi::query',
  'strapi::session',
  'strapi::favicon',
  'strapi::public'
]};
