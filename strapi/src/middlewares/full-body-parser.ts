
function comparePath(path: string | { url: string; method?: string }, req: { url: string; method: string }) {
  if (typeof path === 'string') {
    return req.url === path;
  }
  if (typeof path === 'object') {
    return req.url === path.url && (!path.method || req.method === path.method);
  }
  return false;
}

async function readRawBody(ctx: any): Promise<string> {
  const buffers: Buffer[] = [];
  for await (const chunk of ctx.req) {
    buffers.push(chunk);
  }
  return Buffer.concat(buffers).toString('utf8');
}

const middleware = (config: any = {}, { strapi }) => {
  return async (ctx, next) => {
    const { rawPaths = [], streamPaths = [] } = config;

    const shouldSkipParsing = streamPaths.some((p) => comparePath(p, ctx.request));
    if (shouldSkipParsing) return next(); // let downstream middleware handle it

    const rawBody = await readRawBody(ctx);

    const shouldKeepRaw = rawPaths.some((p) => comparePath(p, ctx.request));
    if (shouldKeepRaw) {
      ctx.request.rawBody = rawBody;
    }

    // Basic JSON body parsing (expand if needed)
    try {
      ctx.request.body = JSON.parse(rawBody);
    } catch {
      ctx.request.body = {};
    }

    await next();
  };
};

export default middleware;
