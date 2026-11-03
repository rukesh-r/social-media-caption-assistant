import { useState } from "react";
import { supabase } from "./supabaseClient";
import BrandLogo from "./BrandLogo";
import {
  LockIcon,
  SparklesIcon,
  BrainIcon,
  BarChartIcon,
  HistoryIcon,
  AlertTriangleIcon,
  CheckCircleIcon,
  LaptopIcon
} from "./Icons";

export default function Auth({ onAuthSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }
    if (!password) {
      setError("Please enter your password.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);
    try {
      if (!isLogin) {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: { emailRedirectTo: window.location.origin }
        });
        if (signUpError) throw signUpError;

        if (data?.session) {
          onAuthSuccess?.(data.session);
        } else if (data?.user) {
          setMessage(
            "Account registered! Please check your email to confirm your account before signing in."
          );
        } else {
          setMessage("Registration successful! You may now sign in.");
        }
      } else {
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password
        });
        if (signInError) throw signInError;

        if (data?.session) {
          onAuthSuccess?.(data.session);
        }
      }
    } catch (err) {
      setError(err.message || "Authentication failed. Please verify your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError("");
    setMessage("");
  };

  return (
    <div className="min-h-screen bg-[#FAFAFD] text-slate-900 flex flex-col justify-between selection:bg-purple-100 selection:text-purple-900 relative overflow-hidden">
      {/* Soft Ambient Light Gradient Orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] pointer-events-none -z-10">
        <div className="absolute -top-20 left-1/4 w-96 h-96 bg-purple-200/40 rounded-full blur-3xl opacity-70" />
        <div className="absolute top-10 right-1/4 w-[28rem] h-[28rem] bg-indigo-100/50 rounded-full blur-3xl opacity-60" />
        <div className="absolute top-48 left-1/3 w-80 h-80 bg-violet-100/30 rounded-full blur-2xl opacity-50" />
      </div>

      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-purple-100/60 shadow-[0_4px_24px_rgba(15,23,42,0.03)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <BrandLogo size="md" showSubtitle={true} />
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-50 border border-purple-200/80 text-purple-700 text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-purple-600 animate-pulse" />
            <span>Sign In Required</span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 sm:py-14 flex items-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Column: Brand Hero Highlights */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-purple-200/80 shadow-sm text-xs font-bold text-purple-800">
              <LockIcon className="w-3.5 h-3.5 text-purple-700" />
              <span>AUTHENTICATION GATE · STUDIO ACCESS</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-[1.15]">
              Sign In to Unlock{" "}
              <span className="block mt-1 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                CaptionCraft AI Studio
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-600 max-w-lg mx-auto lg:mx-0 leading-relaxed font-normal">
              Sign in with your verified account to access the complete generative studio, custom RAG knowledge vaults, multi-platform adaptation, and engagement diagnostics.
            </p>

            {/* Feature Highlights Grid */}
            <div className="space-y-3 pt-2 max-w-lg mx-auto lg:mx-0 text-left">
              {[
                {
                  icon: <SparklesIcon className="w-4 h-4 text-purple-700" />,
                  title: "Multi-Platform Caption Studio",
                  desc: "Instantly craft viral-ready posts for Instagram, LinkedIn, Facebook, and X."
                },
                {
                  icon: <BrainIcon className="w-4 h-4 text-purple-700" />,
                  title: "Personal Knowledge RAG Vault",
                  desc: "Upload brand playbooks & documents to generate verified, factually grounded copy."
                },
                {
                  icon: <BarChartIcon className="w-4 h-4 text-purple-700" />,
                  title: "8-Metric Engagement Diagnostics",
                  desc: "Score hook strength, readability, and virality before hitting publish."
                },
                {
                  icon: <HistoryIcon className="w-4 h-4 text-purple-700" />,
                  title: "Cloud Content Sync & History",
                  desc: "Your past captions, revisions, and analyses safely stored and searchable."
                }
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white/70 backdrop-blur-md border border-slate-200/70 hover:border-purple-200 transition"
                >
                  <span className="p-2.5 rounded-xl bg-purple-50 text-purple-700 shrink-0 flex items-center justify-center">
                    {item.icon}
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{item.title}</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Authentication Card */}
          <div className="lg:col-span-6 max-w-md mx-auto w-full">
            <div className="bg-white/95 backdrop-blur-xl rounded-3xl border border-purple-100/90 shadow-2xl shadow-purple-900/5 p-7 sm:p-9">
              {/* Tab Switcher */}
              <div className="flex p-1 bg-slate-100/90 rounded-2xl border border-slate-200/60 mb-6">
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(true);
                    setError("");
                    setMessage("");
                  }}
                  className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${
                    isLogin
                      ? "bg-white text-purple-700 shadow-sm shadow-purple-500/10 scale-[1.01]"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(false);
                    setError("");
                    setMessage("");
                  }}
                  className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${
                    !isLogin
                      ? "bg-white text-purple-700 shadow-sm shadow-purple-500/10 scale-[1.01]"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  Create Account
                </button>
              </div>

              <div className="text-center mb-6">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                  {isLogin ? "Welcome Back" : "Create Your Account"}
                </h2>
                <p className="text-slate-500 text-xs sm:text-sm mt-1">
                  {isLogin
                    ? "Enter your credentials to enter the application studio."
                    : "Register to unlock the complete suite of AI creation tools."}
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-5 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl p-3.5 text-xs font-medium flex items-start gap-2.5">
                  <AlertTriangleIcon className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <span className="flex-1">{error}</span>
                </div>
              )}

              {/* Success Message */}
              {message && (
                <div className="mb-5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl p-3.5 text-xs font-medium flex items-start gap-2.5">
                  <CheckCircleIcon className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="flex-1">{message}</span>
                </div>
              )}

              {/* Auth Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Insane Email Input */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">Email Address</label>
                  <div className="relative rounded-xl border border-slate-200 bg-slate-50/50 focus-within:bg-white focus-within:border-purple-500 focus-within:ring-4 focus-within:ring-purple-500/10 transition">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@company.com"
                      required
                      className="w-full bg-transparent px-4 py-3 text-xs sm:text-sm text-slate-900 placeholder-slate-400 outline-none"
                    />
                  </div>
                </div>

                {/* Insane Password Input */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-semibold text-slate-700">Password</label>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-[11px] text-purple-600 hover:text-purple-800 font-semibold transition"
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                  <div className="relative rounded-xl border border-slate-200 bg-slate-50/50 focus-within:bg-white focus-within:border-purple-500 focus-within:ring-4 focus-within:ring-purple-500/10 transition">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      required
                      className="w-full bg-transparent px-4 py-3 text-xs sm:text-sm text-slate-900 placeholder-slate-400 outline-none"
                    />
                  </div>
                </div>

                {/* Submit Action */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 text-white font-bold text-sm shadow-md shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Verifying Credentials...</span>
                    </>
                  ) : (
                    <span>{isLogin ? "Sign In & Enter Studio" : "Create Account & Unlock Studio"}</span>
                  )}
                </button>
              </form>

              {/* Mode Toggle Footer */}
              <div className="mt-6 text-center text-xs text-slate-500">
                {isLogin ? "Don't have an account yet?" : "Already registered?"}
                <button
                  type="button"
                  onClick={toggleMode}
                  className="ml-1.5 font-bold text-purple-600 hover:text-purple-800 transition"
                >
                  {isLogin ? "Sign up free" : "Sign In"}
                </button>
              </div>
            </div>

            <p className="text-center text-[11px] text-slate-400 mt-6">
              CaptionCraft AI · Enterprise-Grade Privacy & Security
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/70 bg-white/70 py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex flex-col sm:flex-row items-center gap-2 text-center sm:text-left">
            <span className="font-bold text-slate-700 flex items-center gap-1.5">
              <LaptopIcon className="w-3.5 h-3.5 text-purple-600" />
              <span>Designed &amp; Developed by:</span>
            </span>
            <div className="flex flex-wrap items-center justify-center gap-2 font-bold">
              <span className="px-2 py-0.5 rounded-md bg-purple-50 text-purple-800 border border-purple-200/60">Rasetty Rukesh</span>
              <span className="px-2 py-0.5 rounded-md bg-purple-50 text-purple-800 border border-purple-200/60">T Karthik</span>
              <span className="px-2 py-0.5 rounded-md bg-purple-50 text-purple-800 border border-purple-200/60">M Nithin Rao</span>
              <span className="px-2 py-0.5 rounded-md bg-purple-50 text-purple-800 border border-purple-200/60">P Dinesh Kumar Reddy</span>
              <span className="px-2 py-0.5 rounded-md bg-purple-50 text-purple-800 border border-purple-200/60">G Rama Krishna</span>
            </div>
          </div>
          <span className="text-slate-400">© 2026 CaptionCraft AI</span>
        </div>
      </footer>
    </div>
  );
}
