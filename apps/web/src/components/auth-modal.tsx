"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Lock, User, Eye, EyeOff, TrendingUp } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (email: string, isNewUser: boolean) => void;
}

export function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [mode, setMode] = React.useState<"login" | "signup">("login");
  const [showPassword, setShowPassword] = React.useState(false);
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement actual authentication
    // For now, just simulate success and pass email + isNewUser flag
    const isNewUser = mode === "signup";
    setTimeout(() => {
      onSuccess(formData.email, isNewUser);
    }, 500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 20 }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="relative w-full max-w-[480px] bg-[#171717] border border-white/[0.08] rounded-3xl p-10 shadow-xl"
              onClick={e => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-6 right-6 p-2 text-zinc-600 hover:text-white transition-colors rounded-full hover:bg-white/5"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Logo */}
              <div className="flex justify-center mb-10">
                <h1 className="text-4xl font-medium text-white tracking-tight">
                  Ikodio
                </h1>
              </div>

              {/* Title */}
              <div className="text-center mb-10">
                <h2 className="text-2xl font-medium text-white mb-3">
                  {mode === "login" ? "Welcome Back" : "Get Started"}
                </h2>
                <p className="text-zinc-500 text-sm">
                  {mode === "login"
                    ? "Sign in to access your trading dashboard"
                    : "Create your account to start trading"}
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === "signup" && (
                  <div>
                    <label className="block text-sm font-normal text-zinc-400 mb-2.5">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        className="w-full pl-11 pr-4 py-3 bg-[#0A0A0A] border border-white/[0.08] rounded-xl text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:border-white/20 transition-colors"
                        required
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-normal text-zinc-400 mb-2.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      className="w-full pl-11 pr-4 py-3 bg-[#0A0A0A] border border-white/[0.08] rounded-xl text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:border-white/20 transition-colors"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-normal text-zinc-400 mb-2.5">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full pl-11 pr-11 py-3 bg-[#0A0A0A] border border-white/[0.08] rounded-xl text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:border-white/20 transition-colors"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400 transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {mode === "login" && (
                  <div className="flex justify-end pt-1">
                    <button
                      type="button"
                      className="text-sm text-white hover:text-zinc-400 transition-colors font-normal"
                    >
                      Forgot password?
                    </button>
                  </div>
                )}

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  className="!mt-6 w-full py-3 rounded-xl bg-white text-black font-medium hover:bg-zinc-100 transition-colors"
                  whileHover={{ scale: 1.005 }}
                  whileTap={{ scale: 0.995 }}
                >
                  {mode === "login" ? "Sign In" : "Create Account"}
                </motion.button>
              </form>

              {/* Divider */}
              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/[0.06]"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-[#171717] text-zinc-500 text-xs">
                    Or continue with
                  </span>
                </div>
              </div>

              {/* Social Login */}
              <div className="space-y-2.5">
                {/* Google */}
                <button
                  type="button"
                  className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 bg-[#0A0A0A] border border-white/[0.08] rounded-xl text-white text-sm font-normal hover:bg-white/[0.03] hover:border-white/[0.12] transition-colors"
                >
                  <svg
                    className="w-4 h-4 grayscale opacity-50"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  <span>Google</span>
                </button>

                {/* Apple */}
                <button
                  type="button"
                  className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 bg-[#0A0A0A] border border-white/[0.08] rounded-xl text-white text-sm font-normal hover:bg-white/[0.03] hover:border-white/[0.12] transition-colors"
                >
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                  </svg>
                  <span>Apple</span>
                </button>

                {/* Microsoft */}
                <button
                  type="button"
                  className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 bg-[#0A0A0A] border border-white/[0.08] rounded-xl text-white text-sm font-normal hover:bg-white/[0.03] hover:border-white/[0.12] transition-colors"
                >
                  <svg
                    className="w-4 h-4 grayscale opacity-50"
                    viewBox="0 0 24 24"
                  >
                    <path fill="currentColor" d="M1 1h10v10H1z" />
                    <path fill="currentColor" d="M13 1h10v10H13z" />
                    <path fill="currentColor" d="M1 13h10v10H1z" />
                    <path fill="currentColor" d="M13 13h10v10H13z" />
                  </svg>
                  <span>Microsoft</span>
                </button>
              </div>

              {/* Toggle Mode */}
              <div className="mt-8 text-center">
                <p className="text-sm text-zinc-500">
                  {mode === "login"
                    ? "Don't have an account? "
                    : "Already have an account? "}
                  <button
                    type="button"
                    onClick={() =>
                      setMode(mode === "login" ? "signup" : "login")
                    }
                    className="text-white hover:text-zinc-400 font-medium transition-colors"
                  >
                    {mode === "login" ? "Sign up" : "Sign in"}
                  </button>
                </p>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
