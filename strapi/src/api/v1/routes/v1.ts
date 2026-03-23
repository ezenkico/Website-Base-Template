export default {
  routes: [
    {
      method: "POST",
      path: "/v1/custom-auth/login",
      handler: "custom-auth.login",
      config: {
        auth: false,
      },
    },
    {
      method: "POST",
      path: "/v1/custom-auth/logout",
      handler: "custom-auth.logout",
      config: {
        auth: false,
      },
    },
    {
     method: 'POST',
     path: '/v1/stripe',
     handler: 'stripe.stripeWebhook',
     config: {
        auth: false,
        policies: [],
     },
    },
  ],
};