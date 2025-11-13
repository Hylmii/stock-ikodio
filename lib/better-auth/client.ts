import { createAuthClient } from "better-auth/react";

// Determine baseURL dynamically based on environment
// In production, use the current origin to avoid hardcoded URLs
function getBaseURL() {
  // Server-side: use env variable
  if (typeof window === "undefined") {
    return process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3000";
  }

  // Client-side: use window.location.origin for production
  const isLocalhost =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1";

  if (isLocalhost) {
    return process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3000";
  }

  // Production: use current origin (works for both ikodio.com and www.ikodio.com)
  return window.location.origin;
}

export const authClient = createAuthClient({
  baseURL: getBaseURL(),
});

export const { signIn, signUp, signOut, useSession } = authClient;
