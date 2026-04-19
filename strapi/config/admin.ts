import type { Core } from '@strapi/strapi';
import jwt from "jsonwebtoken";

function generateToken(params: Core.Config.Shared.ConfigParams, documentId: string, uid: string){
  const secret = params.env("PREVIEW_SECRET");

  return jwt.sign(
    {
      uid,
      documentId,
    },
    secret,
    {
      expiresIn: "15m",
    }
  );
}

const config = (params: Core.Config.Shared.ConfigParams): Core.Config.Admin => ({
  auth: {
    secret: params.env('ADMIN_JWT_SECRET'),
  },
  apiToken: {
    salt: params.env('API_TOKEN_SALT'),
  },
  transfer: {
    token: {
      salt: params.env('TRANSFER_TOKEN_SALT'),
    },
  },
  secrets: {
    encryptionKey: params.env('ENCRYPTION_KEY'),
  },
  flags: {
    nps: params.env.bool('FLAG_NPS', true),
    promoteEE: params.env.bool('FLAG_PROMOTE_EE', true),
  },
  preview: {
    enabled: true,
    config: {
      async handler(uid, { documentId }) {
        const token = generateToken(params, documentId, uid);
        switch(uid){
          case "api::page-content.page-content":
            return `/preview/page-content?token=${encodeURIComponent(token)}`;
          case "api::blog.blog":
            return `/preview/blog?token=${encodeURIComponent(token)}`;
        }
        return null;
      },
    },
  }
});

export default config;
