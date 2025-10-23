"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { HeroSection } from "@/components/hero-section";
import { LiveTicker } from "@/components/live-ticker";
import { MarketOverview } from "@/components/market-overview";
import { FeatureSection } from "@/components/feature-section";
import { PricingSection } from "@/components/pricing-section";
import { Footer } from "@/components/footer";
import { SplashScreen } from "@/components/splash-screen";
import { AuthModal } from "@/components/auth-modal";
import { KYCForm } from "@/components/kyc-form";
import { useAppStore } from "@/store/useAppStore";

type AppView = "splash" | "landing" | "auth" | "kyc" | "success";

export default function HomePage() {
  const router = useRouter();
  const [currentView, setCurrentView] = useState<AppView>("splash");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [isInitialized, setIsInitialized] = useState(false);

  const { tradingMode, setTradingMode } = useAppStore();

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = () => {
      const savedAuth = localStorage.getItem("ikodio_auth");
      const savedEmail = localStorage.getItem("ikodio_email");
      const savedKYCCompleted = localStorage.getItem("ikodio_kyc_completed");
      const hasVisited = localStorage.getItem("ikodio_has_visited");

      if (savedAuth === "true" && savedEmail && savedKYCCompleted === "true") {
        // User was previously authenticated with KYC complete - redirect to dashboard
        setIsAuthenticated(true);
        setUserEmail(savedEmail);
        setIsInitialized(true);
        router.push("/dashboard");
        return;
      }

      if (savedAuth === "true" && savedEmail) {
        // User authenticated but no KYC - show KYC form
        setIsAuthenticated(true);
        setUserEmail(savedEmail);
        setCurrentView("kyc");
      } else {
        // No auth - show landing or splash
        if (hasVisited === "true") {
          setCurrentView("landing");
        } else {
          localStorage.setItem("ikodio_has_visited", "true");
          setCurrentView("splash");
        }
      }

      setIsInitialized(true);
    };

    checkSession();
  }, [router]);

  // Save auth state to localStorage whenever it changes
  useEffect(() => {
    if (isInitialized) {
      if (isAuthenticated && userEmail) {
        localStorage.setItem("ikodio_auth", "true");
        localStorage.setItem("ikodio_email", userEmail);
      } else {
        localStorage.removeItem("ikodio_auth");
        localStorage.removeItem("ikodio_email");
      }
    }
  }, [isAuthenticated, userEmail, isInitialized]);

  // Show loading while checking session (prevent flash)
  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          <p className="text-sm text-zinc-500">Loading...</p>
        </div>
      </div>
    );
  }

  // Handlers
  const handleGetStarted = () => {
    setCurrentView("auth");
  };

  const handleAuthSuccess = (email: string, isNewUser: boolean) => {
    setUserEmail(email);
    // Only show KYC form for new users (signup)
    if (isNewUser) {
      setCurrentView("kyc");
    } else {
      // Existing users (login) go directly to dashboard
      setIsAuthenticated(true);
      router.push("/dashboard");
    }
  };

  const handleKYCComplete = () => {
    setIsAuthenticated(true);
    // Save KYC completion status
    localStorage.setItem("ikodio_kyc_completed", "true");
    // Redirect to dashboard
    router.push("/dashboard");
  };

  const handleLogout = () => {
    // Reset to landing page and clear all session data
    setIsAuthenticated(false);
    setCurrentView("landing");
    setUserEmail("");

    // Clear localStorage
    localStorage.removeItem("ikodio_auth");
    localStorage.removeItem("ikodio_email");
    localStorage.removeItem("ikodio_kyc_completed");
  };

  // Render based on current view
  switch (currentView) {
    case "splash":
      return <SplashScreen onComplete={() => setCurrentView("landing")} />;

    case "landing":
      return (
        <>
          <Navbar
            mode={tradingMode}
            onModeChange={setTradingMode}
            onGetStarted={handleGetStarted}
          />
          <HeroSection onGetStarted={handleGetStarted} />
          <LiveTicker />
          <MarketOverview />
          <FeatureSection />
          <PricingSection onGetStarted={handleGetStarted} />
          <Footer />
        </>
      );

    case "auth":
      return (
        <>
          <Navbar
            mode={tradingMode}
            onModeChange={setTradingMode}
            onGetStarted={handleGetStarted}
          />
          <AuthModal
            isOpen={true}
            onClose={() => setCurrentView("landing")}
            onSuccess={handleAuthSuccess}
          />
        </>
      );

    case "kyc":
      return (
        <>
          <Navbar mode={tradingMode} onModeChange={setTradingMode} />
          <KYCForm
            isOpen={true}
            onClose={() => setCurrentView("landing")}
            onComplete={handleKYCComplete}
            userEmail={userEmail}
          />
        </>
      );

    case "success":
      return (
        <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-6">
          <div className="max-w-md w-full">
            <div className="bg-[#111111] rounded-2xl border border-white/[0.08] p-8 text-center">
              {/* Success Icon */}
              <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-10 h-10 text-green-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>

              {/* Welcome Message */}
              <h1 className="text-3xl font-bold text-white mb-3">
                Welcome to IKODIO!
              </h1>

              <p className="text-lg text-zinc-400 mb-8">
                Your account has been successfully set up and verified.
              </p>

              {/* User Info */}
              <div className="bg-white/[0.03] rounded-xl p-6 mb-8">
                <div className="flex items-center justify-center gap-3 text-zinc-300">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  <span>{userEmail}</span>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={handleLogout}
                className="w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-xl font-semibold transition-all transform hover:scale-[1.02]"
              >
                Return to Home
              </button>

              <p className="text-sm text-zinc-500 mt-6">
                Thank you for choosing IKODIO
              </p>
            </div>
          </div>
        </div>
      );

    default:
      return null;
  }
}
