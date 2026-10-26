import { useState } from "react";
import { supabase } from "./supabaseClient";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setMessage("");
    if (!email.trim()) { setError("Please enter your email."); return; }
    if (!password) { setError("Please enter your password."); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    setLoading(true);
    try {
      if (!isLogin) {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(), password,
          options: { emailRedirectTo: window.location.origin },
        });
        if (error) throw error;
        setMessage(data.user && !data.session
          ? "Check your email to confirm your account before logging in."
          : "Registration successful!");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
        if (error) throw error;
      }
    } catch (err) {
      setError(err.message || "Authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  const toggle = () => { setIsLogin(!isLogin); setError(""); setMessage(""); };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/40 to-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-600 to-violet-600 text-white text-2xl mb-4 shadow-lg shadow-purple-200">
            ✨
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900">
            CaptionCraft <span className="text-purple-600">AI</span>
          </h1>
          <p className="text-gray-500 mt-1 text-sm">AI Social Media Content Assistant</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-100/80 p-8">
          <div className="text-center mb-7">
            <h2 className="text-2xl font-bold text-gray-900">
              {isLogin ? "Welcome back" : "Create account"}
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              {isLogin ? "Sign in to continue to CaptionCraft AI." : "Save and manage your AI-generated content."}
            </p>
          </div>

          {error && (
            <div className="mb-5 bg-red-50 border border-red-200 text-red-700 rounded-xl p-3.5 text-sm">{error}</div>
          )}
          {message && (
            <div className="mb-5 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl p-3.5 text-sm">{message}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full border border-gray-200 bg-gray-50 rounded-xl p-3.5 text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-100 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                className="w-full border border-gray-200 bg-gray-50 rounded-xl p-3.5 text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-100 focus:outline-none" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white font-semibold py-3.5 rounded-xl disabled:opacity-50 transition shadow-md shadow-purple-200 mt-2">
              {loading ? "Please wait..." : isLogin ? "Sign In" : "Create Account"}
            </button>
          </form>

          <div className="text-center mt-6 text-sm text-gray-500">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button onClick={toggle} className="ml-1.5 text-purple-600 font-semibold hover:text-purple-800">
              {isLogin ? "Register" : "Sign In"}
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">CaptionCraft AI · Generative AI</p>
      </div>
    </div>
  );
}
