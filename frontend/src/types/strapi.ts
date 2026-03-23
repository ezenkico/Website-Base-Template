
export interface StrapiEndpoints{
  backend: string,
  frontend: string
}

export interface ImageFormat{
    ext: string,
    url: string,
    hash: string,
    name: string,
    alternativeText?: string,
    formats?: {
        xsmall: ImageFormat,
        small: ImageFormat,
        medium: ImageFormat,
        large: ImageFormat,
        thumbnail: ImageFormat
    }
}

export interface StrapiGetResponse{
    data: any | any[],
    meta: {
        pagination: {
            page: number,
            pageSize: number,
            pageCount: number,
            total: number
        }
    }
}

// Login
export interface StrapiLoginRequest {
  identifier: string;
  password: string;
}

export interface StrapiUser {
  id: number;
  username: string;
  email: string;
  confirmed?: boolean;
  blocked?: boolean;
  [key: string]: any;
}

export interface StrapiLoginResponse {
  jwt: string;
  user: StrapiUser;
}


// register
export interface StrapiRegisterRequest {
  username: string;
  email: string;
  password: string;
}
