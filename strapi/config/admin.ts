import type { Core } from '@strapi/strapi';
import jwt from "jsonwebtoken";


const config = ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Admin => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET'),
  },
  apiToken: {
    salt: env('API_TOKEN_SALT'),
  },
  transfer: {
    token: {
      salt: env('TRANSFER_TOKEN_SALT'),
    },
  },
  secrets: {
    encryptionKey: env('ENCRYPTION_KEY'),
  },
  flags: {
    nps: env.bool('FLAG_NPS', true),
    promoteEE: env.bool('FLAG_PROMOTE_EE', true),
  },
  preview: {
    enabled: true,
    config: {
      async handler(uid, { documentId }) {
        if (uid !== "api::page-content.page-content") {
          return null;
        }

        const secret = env("PREVIEW_SECRET");

        const token = jwt.sign(
          {
            uid,
            documentId,
          },
          secret,
          {
            expiresIn: "15m",
          }
        );

        return `/preview/page-content?token=${encodeURIComponent(token)}`;
      },
    },
  }
});

export default config;
