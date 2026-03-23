export default {
  async login(ctx: any) {
    const { identifier, password } = ctx.request.body ?? {};

    if (!identifier || !password) {
      return ctx.badRequest("Identifier and password are required.");
    }

    try {
      const authResponse = await strapi
        .plugin("users-permissions")
        .service("auth")
        .callback("local", {
          identifier,
          password,
        });

      const { jwt, user } = authResponse;

      ctx.cookies.set("strapi_jwt", jwt, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        // domain: ".example.com", // use this in production when needed
      });

      ctx.send({
        user,
      });
    } catch (error) {
      return ctx.unauthorized("Invalid identifier or password.");
    }
  },

  async logout(ctx: any) {
    ctx.cookies.set("strapi_jwt", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      expires: new Date(0),
    });

    ctx.send({
      ok: true,
    });
  },
};