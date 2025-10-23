import Header from "@/components/Header";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  // Check for session cookie instead of better-auth
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("better-auth.session_token");

  if (!sessionCookie) {
    redirect("/");
  }

  // Extract email from cookie (format: ikodio_{email}_{timestamp})
  const cookieValue = sessionCookie.value;
  const email = cookieValue.split("_")[1] || "user@example.com";

  const user = {
    id: "1",
    email: email,
    name: email.split("@")[0],
  };

  return (
    <main className="min-h-screen text-gray-400">
      <Header user={user} />
      <div className="container py-10">{children}</div>
    </main>
  );
};
export default Layout;
