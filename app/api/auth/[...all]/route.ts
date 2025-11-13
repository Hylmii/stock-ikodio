import { auth } from "@/lib/better-auth/auth";
import { toNextJsHandler } from "better-auth/next-js";
import { NextRequest, NextResponse } from "next/server";

const handlers = toNextJsHandler(auth);

const allowedOrigins = [
  "https://ikodio.com",
  "https://www.ikodio.com",
  "http://localhost:3000",
  "http://localhost:3001",
];

function getCorsHeaders(origin: string | null) {
  const allowOrigin =
    origin && allowedOrigins.includes(origin) ? origin : "https://ikodio.com";

  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers":
      "Content-Type, Authorization, Cookie, Set-Cookie, X-Requested-With",
    "Access-Control-Allow-Credentials": "true",
  };
}

export async function GET(request: NextRequest) {
  const response = await handlers.GET(request);
  const origin = request.headers.get("origin");
  const corsHeaders = getCorsHeaders(origin);

  // Better Auth already sets some headers, we add CORS
  Object.entries(corsHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  return response;
}

export async function POST(request: NextRequest) {
  const response = await handlers.POST(request);
  const origin = request.headers.get("origin");
  const corsHeaders = getCorsHeaders(origin);

  // Better Auth already sets some headers, we add CORS
  Object.entries(corsHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  return response;
}

// Handle CORS preflight OPTIONS request
export async function OPTIONS(request: Request) {
  const origin = request.headers.get("origin");
  const corsHeaders = getCorsHeaders(origin);

  return new NextResponse(null, {
    status: 204,
    headers: {
      ...corsHeaders,
      "Access-Control-Max-Age": "86400",
    },
  });
}
