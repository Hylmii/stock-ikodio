import { cookies } from "next/headers";
import { auth } from "./auth";

export async function getSession() {
  const cookieStore = await cookies();

  // In production (HTTPS), Better Auth uses __Secure- prefix
  const sessionToken =
    cookieStore.get("__Secure-better-auth.session_token") ||
    cookieStore.get("better-auth.session_token");

  if (!sessionToken) {
    return null;
  }

  try {
    // Use Better Auth to verify and get session
    const session = await auth.api.getSession({
      headers: {
        // Use the actual cookie name that was found
        cookie: `${sessionToken.name}=${sessionToken.value}`,
      },
    });

    return session;
  } catch (error) {
    console.error("Session verification error:", error);
    return null;
  }
}

export async function getCurrentUser() {
  const session = await getSession();

  if (!session?.user) {
    return null;
  }

  return {
    id: session.user.id,
    email: session.user.email,
    name: session.user.name,
  };
}
