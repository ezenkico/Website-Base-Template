import { StrapiEndpoints } from "@/types/strapi";

export function getStrapiEndpoint(): StrapiEndpoints{
  // TODO: Remove the localhost once we have a production domain
  return {
    backend: process.env.STRAPI_BACKEND ?? "http://localhost:1337",
    frontend: process.env.STRAPI_FRONTEND ?? "http://localhost:1337"
  }
}
