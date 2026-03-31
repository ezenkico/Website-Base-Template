import { ImageFormat, StrapiEndpoints, StrapiGetResponse } from "@/types/strapi";
import { sendRequest } from "./helper";
import { BadResponse } from "@/types/response";
import type {
  StrapiLoginRequest,
  StrapiLoginResponse,
  StrapiUser,
  StrapiRegisterRequest,
  StrapiMedia
} from "@/types/strapi";

export interface LogicalFilter {
  field: string | string[];
  operator: string; // e.g., "$eq", "$contains"
  value: string;
}

export interface CombineFilter {
  type: "$and" | "$or";
  filters: Filter[];
}

export type Filter = LogicalFilter | CombineFilter;

export interface GetData {
  fields?: string[];
  sort?: {
    field: string;
    type: "asc" | "desc";
  };
  filters?: Filter[];
  populate?: {
    field: string;
    data?: GetData;
  }[];
  pagination?: {
    page: number;
    pageSize: number;
  };
  on?: {
    [componentUID: string]: GetData;
  };
  status?: "draft" | "published"
}

interface KeyChain{
    path: string[],
    value: string
}

function setupFilter(filter: Filter, prefix: string[] = []): KeyChain[] {
    const result: KeyChain[] = [];
    if ("type" in filter) {
        filter.filters.forEach((f, j) => {
            setupFilter(f, [...prefix, filter.type, j.toString()]).forEach(r => {
                result.push(r);
            });
        });
    } else {
        const fields = Array.isArray(filter.field) ? filter.field : [filter.field];
        result.push({
            path: [
                ...prefix,
                ...fields,
                filter.operator
            ],
            value: filter.value
        });
    }
    return result;
}

function buildStrapiItems(query: GetData): KeyChain[]{
    const result: KeyChain[] = [];

    if (query.fields?.length) {
        query.fields.forEach((f, i) => {
            result.push({
                path: [
                    "fields",
                    i.toString()
                ],
                value: f
            });
        });
    }

    if(query.sort){
        result.push({
            path: [
                "sort"
            ],
            value: `${query.sort.field}:${query.sort.type}`
        });
    }

    if (query.filters?.length) {
        query.filters.forEach(filter => {
            setupFilter(filter, ["filters"]).forEach(f => result.push(f));
        });
    }

    if (query.populate?.length){
        query.populate.forEach((pop, i) => {
            if(pop.data){
                const nested = buildStrapiItems(pop.data);

                nested.forEach(n => {
                    n.path.unshift("populate", pop.field);
                    result.push(n);
                });
            }else{
                result.push({
                    path: ["populate"],
                    value: pop.field
                });
            }
        });
    }

    if(query.pagination){
        result.push({
            path: [
                "pagination",
                "page"
            ],
            value: query.pagination.page.toString()
        });
        result.push({
            path: [
                "pagination",
                "pageSize"
            ],
            value: query.pagination.pageSize.toString()
        });
    }

    if(query.status){
      result.push({
        path: ["status"],
        value: query.status
      })
    }

    if (query.on) {
        Object.entries(query.on).forEach(([component, data]) => {
            const nested = buildStrapiItems(data);

            if (nested.length === 0) {
            result.push({
                path: ["on", component],
                value: "*",
            });
            } else {
            nested.forEach(n => {
                n.path.unshift("on", component);
                result.push(n);
            });
            }
        });
    }

    return result;
}

export function buildStrapiQuery(query: GetData): string {
  const params = new URLSearchParams();

  const items = buildStrapiItems(query);

  items.forEach(item => {
    const [base, ...rest] = item.path;
    if(base){
        const fullKey = `${base}${rest.map(p => `[${p}]`).join("")}`;
        params.append(fullKey, item.value);
    }
  })

  return params.toString();
}

export async function getStrapiData(
  endpoint: StrapiEndpoints,
  collection: string,
  searchData?: GetData,
  apiToken?: string
): Promise<StrapiGetResponse> {

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (apiToken) {
    headers["Authorization"] = `Bearer ${apiToken}`;
  }

  return await (
    await sendRequest(
      endpoint,
      `/api/${encodeURIComponent(collection)}${
        searchData == null ? "" : `?${buildStrapiQuery(searchData)}`
      }`,
      {
        method: "GET",
        headers,
      }
    )
  ).json();
}

export async function getStrapiDataFromUrl(
  baseUrl: string,
  collection: string,
  searchData?: GetData,
  apiToken?: string
): Promise<StrapiGetResponse> {

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (apiToken) {
    headers["Authorization"] = `Bearer ${apiToken}`;
  }

  const url = `${baseUrl}/api/${encodeURIComponent(collection)}${
    searchData == null ? "" : `?${buildStrapiQuery(searchData)}`
  }`;

  const response = await fetch(url, {
    method: "GET",
    headers,
  });

  if (!response.ok) {
    throw new BadResponse(response.status, await response.text(), response.type);
  }

  return await response.json();
}

export async function getStrapiDataById(
    endpoint: StrapiEndpoints,
    collection: string,
    id: string | number,
    populateData?: GetData,
    apiToken?: string
): Promise<StrapiGetResponse>{
    const queryString = populateData ? `?${buildStrapiQuery(populateData)}` : "";

    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (apiToken) {
      headers["Authorization"] = `Bearer ${apiToken}`;
    }
    return await (await sendRequest(endpoint, `/api/${encodeURIComponent(collection)}/${id}${queryString}`, {
        method: "GET",
        headers
    })).json();
}

export async function getStrapiDataByIDFromUrl(
  baseUrl: string,
  collection: string,
  id: string | number,
  populateData?: GetData,
  apiToken?: string
): Promise<StrapiGetResponse> {

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (apiToken) {
    headers["Authorization"] = `Bearer ${apiToken}`;
  }
  const queryString = populateData ? `?${buildStrapiQuery(populateData)}` : "";

  const url = `${baseUrl}/api/${encodeURIComponent(collection)}/${id}${queryString}`;

  const response = await fetch(url, {
    method: "GET",
    headers,
  });

  if (!response.ok) {
    throw new BadResponse(response.status, await response.text(), response.type);
  }

  return await response.json();
}

export function modifyImageUrl(baseUrl: string, imageFormats: {[key: string]: ImageFormat}){
    Object.keys(imageFormats).forEach(key => {
        imageFormats[key].url = `${baseUrl}${imageFormats[key].url}`;
    });
}

// Helper to get full image URL
export const getFullImageUrl = (image: any, endpoint: StrapiEndpoints): string | undefined => {
    const imageUrl = getImageUrl(image);
    if (!imageUrl) return undefined;
    // If URL is already absolute, return as is
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
        return imageUrl;
    }
    // Otherwise, prepend Strapi frontend URL
    return `${endpoint.frontend}${imageUrl}`;
};

export function getImageUrl(m?: StrapiMedia): string | undefined {
  if (!m) return undefined;
  // prefer a reasonable responsive size if present
  const formats = m.formats ?? {};
  return (
    formats.large?.url ||
    formats.medium?.url ||
    formats.small?.url ||
    formats.thumbnail?.url ||
    m.url
  );
}

// strapi login functionality

export async function loginToStrapi(
  endpoint: StrapiEndpoints,
  loginData: StrapiLoginRequest
): Promise<StrapiLoginResponse> {
  return await (
    await sendRequest(endpoint, "/api/auth/local", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginData),
    })
  ).json();
}

export async function loginToStrapiFromUrl(
  baseUrl: string,
  loginData: StrapiLoginRequest
): Promise<StrapiLoginResponse> {
  const response = await fetch(`${baseUrl}/api/auth/local`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(loginData),
  });

  if (!response.ok) {
    throw new BadResponse(response.status, await response.text(), response.type);
  }

  return await response.json();
}

export async function getCurrentStrapiUser(
  endpoint: StrapiEndpoints,
  jwt: string
): Promise<StrapiUser> {
  return await (
    await sendRequest(endpoint, "/api/users/me", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
    })
  ).json();
}

export async function getCurrentStrapiUserFromUrl(
  baseUrl: string,
  jwt: string
): Promise<StrapiUser> {
  const response = await fetch(`${baseUrl}/api/users/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt}`,
    },
  });

  if (!response.ok) {
    throw new BadResponse(response.status, await response.text(), response.type);
  }

  return await response.json();
}

export interface CustomStrapiLoginResponse {
  user: any;
}

export async function loginToStrapiWithCookie(
  endpoint: StrapiEndpoints,
  loginData: StrapiLoginRequest
): Promise<CustomStrapiLoginResponse> {
  return await (
    await sendRequest(endpoint, "/api/v1/custom-auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginData),
      credentials: "include",
    })
  ).json();
}

// Sign up
export async function registerToStrapi(
  endpoint: StrapiEndpoints,
  registerData: StrapiRegisterRequest
): Promise<StrapiLoginResponse> {
  return await (
    await sendRequest(endpoint, "/api/auth/local/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(registerData),
    })
  ).json();
}

export async function registerToStrapiFromUrl(
  baseUrl: string,
  registerData: StrapiRegisterRequest
): Promise<StrapiLoginResponse> {
  const response = await fetch(`${baseUrl}/api/auth/local/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(registerData),
  });

  if (!response.ok) {
    throw new BadResponse(response.status, await response.text(), response.type);
  }

  return await response.json();
}
