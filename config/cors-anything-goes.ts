// Permissive CORS policy so the API can be called from any browser.
// Tighten this once you know which domains your customers will call from.
export default {
  allowOriginsAnything: true,
  allowHeaders: ["Authorization", "Content-Type"],
  allowMethods: ["GET", "OPTIONS"],
  allowCredentials: false,
};
