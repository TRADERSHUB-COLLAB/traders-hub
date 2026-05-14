import { ZuploContext, ZuploRequest } from "@zuplo/runtime";

const AVAILABLE_ENDPOINTS = [
  { method: "GET", path: "/v1/signal", description: "BUY / SELL / HOLD trading signal with confidence score" },
  { method: "GET", path: "/v1/sentiment", description: "News sentiment scoring from recent headlines" },
  { method: "GET", path: "/v1/multiframe", description: "Multi-timeframe trend alignment (daily / weekly / monthly)" },
  { method: "GET", path: "/v1/health", description: "Public health check" }
];

export default async function (request: ZuploRequest, context: ZuploContext) {
  const url = new URL(request.url);
  const failingPath = url.pathname;
  const method = request.method;
  const query = Object.fromEntries(url.searchParams.entries());

  // Log the failing path for root-cause analysis in Zuplo live logs.
  context.log.warn("catch-all-404", {
    failingPath,
    method,
    query,
    userAgent: request.headers.get("user-agent") ?? null,
    referer: request.headers.get("referer") ?? null,
    requestId: context.requestId
  });

  const body = {
    error: "Not Found",
    message: `No endpoint matches '${method} ${failingPath}'. See available_endpoints below or visit the docs.`,
    requested: { method, path: failingPath },
    available_endpoints: AVAILABLE_ENDPOINTS,
    docs: "https://tradershub.dev/docs",
    support: "kobusmnel@gmail.com",
    requestId: context.requestId
  };

  return new Response(JSON.stringify(body, null, 2), {
    status: 404,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "x-tradershub-handler": "catch-all-404"
    }
  });
}
