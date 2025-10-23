"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Lock, User, Eye, EyeOff, TrendingUp, Sparkles } from "lucide-react";
import { gsap } from "gsap";

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
  
  const modalRef = React.useRef<HTMLDivElement>(null);
  const formRef = React.useRef<HTMLFormElement>(null);
  const headerRef = React.useRef<HTMLDivElement>(null);

  // Debug: Log when component mounts
  React.useEffect(() => {
    console.log("AuthModal mounted/updated", {
      isOpen,
      hasOnSuccess: !!onSuccess,
      hasOnClose: !!onClose,
    });
  }, [isOpen, onSuccess, onClose]);

  // GSAP Animations when modal opens
  React.useEffect(() => {
    if (!isOpen || !modalRef.current) return;

    const ctx = gsap.context(() => {
      // Header fade in
      gsap.from(headerRef.current, {
        opacity: 0,
        y: -20,
        duration: 0.4,
        delay: 0.1,
        ease: "power2.out",
      });

      // Form fields stagger in
      gsap.from(formRef.current?.querySelectorAll(".form-field") || [], {
        opacity: 0,
        y: 20,
        stagger: 0.1,
        duration: 0.4,
        delay: 0.2,
        ease: "power2.out",
      });

      // Divider and social buttons
      gsap.from(".auth-divider, .social-button", {
        opacity: 0,
        scale: 0.95,
        stagger: 0.05,
        duration: 0.3,
        delay: 0.5,
        ease: "back.out(1.5)",
      });
    }, modalRef);

    return () => ctx.revert();
  }, [isOpen, mode]);

  const handleSubmit = (e: React.FormEvent) => {
    try {
      e.preventDefault();
      console.log("Form submitted!", { mode, formData });

      // Validate form data
      if (!formData.email || !formData.password) {
        console.log("Validation failed: empty fields");
        alert("Please fill in all fields");
        return;
      }

      if (mode === "signup" && !formData.name) {
        console.log("Validation failed: no name");
        alert("Please enter your name");
        return;
      }

      // Simple validation for email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        console.log("Validation failed: invalid email");
        alert("Please enter a valid email address");
        return;
      }

      console.log("Validation passed, processing auth...");
      console.log("Auth submit:", { mode, email: formData.email });

      // TODO: Implement actual authentication
      // For now, just simulate success and pass email + isNewUser flag
      const isNewUser = mode === "signup";

      // Simulate API call
      console.log("Simulating API call...");
      setTimeout(() => {
        try {
          console.log("Auth success, calling onSuccess callback");
          console.log("Auth success:", { email: formData.email, isNewUser });
          console.log("onSuccess function:", onSuccess);
          onSuccess(formData.email, isNewUser);
        } catch (err) {
          console.error("Error in onSuccess callback:", err);
        }
      }, 500);
    } catch (err) {
      console.error("Error in handleSubmit:", err);
    }
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              ref={modalRef}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-[440px] bg-gradient-to-b from-[#1A1A1A] to-[#0F0F0F] border border-white/10 rounded-2xl p-8 shadow-2xl my-8 overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              {/* Gradient Overlay Effect */}
              <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-blue-500/5 to-transparent pointer-events-none" />
              
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 text-zinc-600 hover:text-white transition-all rounded-lg hover:bg-white/5 z-10"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Header */}
              <div ref={headerRef} className="text-center mb-8 relative z-10">
                {/* Icon Badge */}
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/10 mb-4">
                  <Sparkles className="w-6 h-6 text-blue-400" />
                </div>
                
                <h2 className="text-2xl font-semibold text-white mb-2">
                  {mode === "login" ? "Welcome Back" : "Get Started"}
                </h2>
                <p className="text-zinc-400 text-sm">
                  {mode === "login"
                    ? "Sign in to access your trading dashboard"
                    : "Create your account to start trading"}
                </p>
              </div>

              {/* Form */}
              <form ref={formRef} onSubmit={handleSubmit} className="space-y-4 relative z-10">
                {mode === "signup" && (
                  <div className="form-field">
                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                      Full Name
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity blur" />
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 z-10" />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        className="relative w-full pl-10 pr-4 py-2.5 bg-black/40 border border-white/10 rounded-lg text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:border-blue-500/50 focus:bg-black/60 transition-all"
                        required
                      />
                    </div>
                  </div>
                )}

                <div className="form-field">
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Email Address
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity blur" />
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 z-10" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      className="relative w-full pl-10 pr-4 py-2.5 bg-black/40 border border-white/10 rounded-lg text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:border-blue-500/50 focus:bg-black/60 transition-all"
                      required
                    />
                  </div>
                </div>

                <div className="form-field">
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Password
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity blur" />
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 z-10" />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="relative w-full pl-10 pr-10 py-2.5 bg-black/40 border border-white/10 rounded-lg text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:border-blue-500/50 focus:bg-black/60 transition-all"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors z-10"
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
                  <div className="flex justify-end form-field">
                    <button
                      type="button"
                      className="text-sm text-blue-400 hover:text-blue-300 transition-colors font-medium"
                    >
                      Forgot password?
                    </button>
                  </div>
                )}

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  className="form-field !mt-6 w-full py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg shadow-blue-500/25"
                  whileHover={{ scale: 1.01, boxShadow: "0 20px 40px -12px rgba(59, 130, 246, 0.4)" }}
                  whileTap={{ scale: 0.99 }}
                >
                  {mode === "login" ? "Sign In" : "Create Account"}
                </motion.button>
              </form>

              {/* Divider */}
              <div className="auth-divider relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-gradient-to-b from-[#1A1A1A] to-[#0F0F0F] text-zinc-500 text-xs">
                    Or continue with
                  </span>
                </div>
              </div>

              {/* Social Login */}
              <div className="space-y-2.5">
                {/* Google */}
                <button
                  type="button"
                  className="social-button w-full flex items-center justify-center gap-2.5 py-2.5 px-4 bg-black/40 border border-white/10 rounded-lg text-white text-sm font-medium hover:bg-black/60 hover:border-white/20 transition-all"
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
                  className="social-button w-full flex items-center justify-center gap-2.5 py-2.5 px-4 bg-black/40 border border-white/10 rounded-lg text-white text-sm font-medium hover:bg-black/60 hover:border-white/20 transition-all"
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
                  className="social-button w-full flex items-center justify-center gap-2.5 py-2.5 px-4 bg-black/40 border border-white/10 rounded-lg text-white text-sm font-medium hover:bg-black/60 hover:border-white/20 transition-all"
                >
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                  >
                    <path fill="#F25022" d="M1 1h10v10H1z" />
                    <path fill="#00A4EF" d="M13 1h10v10H13z" />
                    <path fill="#7FBA00" d="M1 13h10v10H1z" />
                    <path fill="#FFB900" d="M13 13h10v10H13z" />
                  </svg>
                  <span>Microsoft</span>
                </button>
              </div>

              {/* Toggle Mode */}
              <div className="mt-6 text-center">
                <p className="text-sm text-zinc-400">
                  {mode === "login"
                    ? "Don't have an account? "
                    : "Already have an account? "}
                  <button
                    type="button"
                    onClick={() =>
                      setMode(mode === "login" ? "signup" : "login")
                    }
                    className="text-blue-400 hover:text-blue-300 font-semibold transition-colors"
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

                {/* Microsoft */}
                <button
                  type="button"
                  className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 bg-[#0A0A0A] border border-white/[0.08] rounded-lg text-white text-sm font-normal hover:bg-white/[0.03] hover:border-white/[0.12] transition-colors"
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
                              </button>
              </div>

              {/* Toggle Mode */}
              <div className="mt-6 text-center">
                <p className="text-sm text-zinc-400">
                  {mode === "login"
                    ? "Don't have an account? "
                    : "Already have an account? "}
                  <button
                    type="button"
                    onClick={() =>
                      setMode(mode === "login" ? "signup" : "login")
                    }
                    className="text-blue-400 hover:text-blue-300 font-semibold transition-colors"
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

            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
