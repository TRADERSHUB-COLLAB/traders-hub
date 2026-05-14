import { ZuploContext, ZuploRequest } from "@zuplo/runtime";

export default async function (request: ZuploRequest, context: ZuploContext) {
  const url = new URL(request.url);
  const requestId = context.requestId;

  context.log.warn("Unmatched route (404)", {
    method: request.method,
    path: url.pathname,
    query: url.search,
    userAgent: request.headers.get("user-agent") ?? "",
    referer: request.headers.get("referer") ?? "",
    requestId,
  });

  const body = {
    error: "Not Found",
    message: `The path '${url.pathname}' was not found on this API.`,
    requestId,
    availableEndpoints: [
      { method: "GET", path: "/v1/signal", description: "Get a trading signal" },
      { method: "GET", path: "/v1/sentiment", description: "Get news sentiment" },
      { method: "GET", path: "/v1/multiframe", description: "Multi-timeframe trend analysis" },
      { method: "GET", path: "/v1/health", description: "Health check" },
    ],
    docs: "https://tradershub.dev",
  };

  return new Response(JSON.stringify(body, null, 2), {
    status: 404,
    headers: {
      "content-type": "application/json",
      "x-request-id": requestId,
    },
  });
}
