"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check auth from localStorage
    const isAuthenticated = localStorage.getItem("ikodio_auth") === "true";
    const kycCompleted =
      localStorage.getItem("ikodio_kyc_completed") === "true";
    const email = localStorage.getItem("ikodio_email");

    if (!isAuthenticated || !kycCompleted) {
      router.push("/");
    } else {
      // Create mock user from localStorage
      if (email) {
        setUser({
          id: "local-user",
          name: email.split("@")[0], // Use email prefix as name
          email: email,
        });
      }
      setIsLoading(false);
    }
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          <p className="text-sm text-zinc-500">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-gray-400">
      <Header user={user} />
      <div className="container py-10">{children}</div>
    </main>
  );
}
