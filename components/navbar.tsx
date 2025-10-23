"use client";

import * as React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { TrendingUp, Menu, X } from "lucide-react";
import { gsap } from "gsap";
import { useI18n } from "@/lib/i18n/I18nContext";

interface NavbarProps {
  mode: "normal" | "prediction";
  onModeChange: (mode: "normal" | "prediction") => void;
  onGetStarted?: () => void;
  onLogout?: () => void;
  isAuthModalOpen?: boolean;
}

export function Navbar({
  mode,
  onModeChange,
  onGetStarted,
  onLogout,
  isAuthModalOpen = false,
}: NavbarProps) {
  const { t } = useI18n();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [showUserMenu, setShowUserMenu] = React.useState(false);
  const navRef = React.useRef<HTMLElement>(null);
  const { scrollY } = useScroll();

  const backgroundColor = useTransform(
    scrollY,
    [0, 100],
    ["rgba(10, 10, 10, 0)", "rgba(10, 10, 10, 0.8)"]
  );

  // Check if we're in dashboard mode (when onGetStarted is undefined)
  const isDashboard = !onGetStarted;

  // Animate navbar hide/show when auth modal opens/closes
  React.useEffect(() => {
    if (!navRef.current) return;

    if (isAuthModalOpen) {
      // Hide navbar smoothly
      gsap.to(navRef.current, {
        y: -80,
        opacity: 0,
        duration: 0.4,
        ease: "power2.inOut",
      });
    } else {
      // Show navbar smoothly
      gsap.to(navRef.current, {
        y: 0,
        opacity: 1,
        duration: 0.5,
        ease: "power2.out",
      });
    }
  }, [isAuthModalOpen]);

  return (
    <motion.nav
      ref={navRef}
      className={`fixed top-0 left-0 right-0 z-[100] border-b ${
        isDashboard
          ? "bg-[#0A0A0A] border-white/[0.08]"
          : "bg-[#0A0A0A]/80 backdrop-blur-md border-transparent"
      }`}
      style={!isDashboard ? { backgroundColor } : {}}
    >
      <div
        className={`${
          isDashboard ? "w-full" : "max-w-7xl mx-auto"
        } px-6 h-16 flex items-center justify-between`}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-medium text-white tracking-tight">
            Ikodio
            {!isDashboard && (
              <span className="text-zinc-500 font-normal ml-2 text-sm">
                Beta
              </span>
            )}
          </span>
        </Link>

        {/* Desktop Navigation */}
        {!isDashboard ? (
          <div className="hidden lg:flex items-center gap-8">
            <Link
              href="#features"
              className="text-sm text-zinc-400 hover:text-white transition-colors"
            >
              Features
            </Link>
            <Link
              href="#pricing"
              className="text-sm text-zinc-400 hover:text-white transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="#about"
              className="text-sm text-zinc-400 hover:text-white transition-colors"
            >
              Learn
            </Link>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            {/* Dashboard Mode Toggle */}
            <div className="flex items-center gap-2 bg-white/[0.03] rounded-xl p-1">
              <button
                onClick={() => onModeChange("normal")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  mode === "normal"
                    ? "bg-white text-black"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                Trading
              </button>
              <button
                onClick={() => onModeChange("prediction")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  mode === "prediction"
                    ? "bg-white text-black"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                Prediction
              </button>
            </div>

            {/* User Menu */}
            <div className="flex items-center gap-3">
              <button className="p-2.5 rounded-xl hover:bg-white/[0.03] transition-colors">
                <svg
                  className="w-5 h-5 text-zinc-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
              </button>
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/[0.03] transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-white/[0.08] flex items-center justify-center">
                    <span className="text-sm font-medium text-white">HR</span>
                  </div>
                </button>

                {/* Dropdown Menu */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-[#0A0A0A] border border-white/[0.08] rounded-xl shadow-lg overflow-hidden z-50">
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        onLogout?.();
                      }}
                      className="w-full px-4 py-3 text-left text-sm text-zinc-400 hover:bg-white/[0.03] hover:text-white transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Landing Page CTA */}
        {!isDashboard && (
          <div className="hidden lg:flex items-center">
            <motion.button
              onClick={() => {
                console.log(
                  "Try For Free clicked, onGetStarted:",
                  onGetStarted
                );
                onGetStarted?.();
              }}
              className="flex items-center gap-2 px-5 py-2.5 bg-white text-black rounded-lg text-sm font-medium hover:bg-zinc-100 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
              </svg>
              Try For Free
            </motion.button>
          </div>
        )}

        {/* Mobile Menu Button */}
        {!isDashboard && (
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 text-white"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        )}
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="lg:hidden bg-dark-secondary border-t border-white/10"
        >
          <div className="container-custom py-6 flex flex-col gap-4">
            <Link
              href="#features"
              className="text-sm font-medium text-zinc-300 hover:text-white transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Features
            </Link>
            <Link
              href="#pricing"
              className="text-sm font-medium text-zinc-300 hover:text-white transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Pricing
            </Link>
            <Link
              href="#about"
              className="text-sm font-medium text-zinc-300 hover:text-white transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>

            <div className="flex items-center bg-dark rounded-full p-1 border border-white/10">
              <button
                onClick={() => {
                  onModeChange("normal");
                  setIsMenuOpen(false);
                }}
                className={`flex-1 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  mode === "normal"
                    ? "bg-gradient-to-r from-accent to-accent-secondary text-dark"
                    : "text-zinc-400"
                }`}
              >
                Normal
              </button>
              <button
                onClick={() => {
                  onModeChange("prediction");
                  setIsMenuOpen(false);
                }}
                className={`flex-1 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  mode === "prediction"
                    ? "bg-gradient-to-r from-accent to-accent-secondary text-dark"
                    : "text-zinc-400"
                }`}
              >
                AI Mode
              </button>
            </div>

            <button
              onClick={() => {
                onGetStarted?.();
                setIsMenuOpen(false);
              }}
              className="w-full px-6 py-3 rounded-full bg-white text-dark font-semibold text-sm hover:bg-accent transition-colors mt-2"
            >
              {t("header.getStarted")}
            </button>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
}
