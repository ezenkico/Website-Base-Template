# ---- Build Stage ----
FROM node:22-alpine AS build

RUN apk update && apk add --no-cache \
  build-base \
  gcc \
  autoconf \
  automake \
  zlib-dev \
  libpng-dev \
  vips-dev \
  git

WORKDIR /opt/app

# Install deps (include dev deps for Strapi build/admin bundling)
COPY package*.json ./
RUN npm ci

# Copy app source (includes src/plugins/ghost-integration)
COPY . .

# Build Strapi (bundles admin + your plugin admin)
RUN npm run build


# ---- Final Runtime Stage ----
FROM node:22-alpine

RUN apk add --no-cache vips-dev

WORKDIR /opt/app

# Copy pruned prod node_modules + built app
COPY --from=build /opt/app/node_modules ./node_modules
COPY --from=build /opt/app ./

ENV NODE_ENV=production

# Run as non-root user
RUN addgroup -g 1001 strapi && adduser -u 1001 -G strapi -s /bin/sh -D strapi
RUN chown -R strapi:strapi /opt/app
USER strapi

EXPOSE 1337
CMD ["sh", "-c", "node ./dist/src/create-db.js && npm start"]
