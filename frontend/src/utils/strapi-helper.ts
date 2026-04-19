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
import qs from "qs";

export type StrapiPrimitive = string | number | boolean | null;

export type StrapiFilterValue =
  | StrapiPrimitive
  | StrapiPrimitive[]
  | {
      [operator: string]: StrapiPrimitive | StrapiPrimitive[];
    };

export interface StrapiFilters {
  [field: string]:
    | StrapiFilterValue
    | StrapiFilters
    | StrapiFilters[]
    | undefined;
  $and?: StrapiFilters[];
  $or?: StrapiFilters[];
  $not?: StrapiFilters;
}

export type StrapiSort =
  | string
  | string[]
  | {
      field: string;
      order: "asc" | "desc";
    }
  | {
      field: string;
      order: "asc" | "desc";
    }[];

export type PopulateValue =
  | true
  | {
      fields?: string[];
      sort?: StrapiSort;
      filters?: StrapiFilters;
      populate?: PopulateObject;
      pagination?: {
        page: number;
        pageSize: number;
      };
      on?: {
        [componentUID: string]: {
          fields?: string[];
          sort?: StrapiSort;
          filters?: StrapiFilters;
          populate?: PopulateObject;
          pagination?: {
            page: number;
            pageSize: number;
          };
        };
      };
      status?: "draft" | "published";
    };

export interface PopulateObject {
  [field: string]: PopulateValue;
}

export interface GetData {
  fields?: string[];
  sort?: StrapiSort;
  filters?: StrapiFilters;
  populate?: PopulateObject;
  pagination?: {
    page: number;
    pageSize: number;
  };
  on?: {
    [componentUID: string]: Omit<GetData, "on">;
  };
  status?: "draft" | "published";
}

function buildStrapiQuery(data: GetData){
  return qs.stringify(data, { encodeValuesOnly: true });
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
