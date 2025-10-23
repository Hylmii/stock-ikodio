import Header from "@/components/Header";
import { getCurrentUser } from "@/lib/better-auth/server";
import { redirect } from "next/navigation";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  // Check Better Auth session
  const user = await getCurrentUser();

  if (!user) {
    redirect("/");
  }

  return (
    <main className="min-h-screen text-gray-400">
      <Header user={user} />
      <div className="container py-10">{children}</div>
    </main>
  );
};
export default Layout;
