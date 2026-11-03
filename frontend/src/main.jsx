import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import axios from "axios";
import "./index.css";
import App from "./App.jsx";
import Auth from "./Auth.jsx";
import { SparklesIcon } from "./Icons";
import { supabase } from "./supabaseClient";

// ============================================================
// AXIOS AUTH INTERCEPTOR
// ============================================================
axios.interceptors.request.use(
  async (config) => {
    try {
      const { data } = await supabase.auth.getSession();
      const session = data?.session;
      if (session?.access_token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${session.access_token}`;
      }
    } catch (error) {
      console.error("Unable to attach authentication token:", error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ============================================================
// ROOT APPLICATION WITH STRICT AUTH GATE
// ============================================================
function RootApp() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) console.error("Session error:", error);
        if (mounted) {
          setSession(data?.session || null);
          setLoading(false);
        }
      } catch (err) {
        console.error("Auth check failed:", err);
        if (mounted) setLoading(false);
      }
    };

    loadSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession || null);
    });

    return () => {
      mounted = false;
      listener?.subscription?.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAFD] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-600 text-white shadow-xl shadow-purple-500/20 animate-pulse">
            <SparklesIcon className="w-7 h-7 text-white" />
          </div>
          <p className="text-xs font-semibold text-slate-500 tracking-wide uppercase">
            Verifying Session Security...
          </p>
        </div>
      </div>
    );
  }

  // ==========================================================
  // AUTH GATE: Without user sign in, access to the application is strictly denied
  // ==========================================================
  if (!session) {
    return <Auth onAuthSuccess={(newSession) => setSession(newSession)} />;
  }

  // ==========================================================
  // MAIN APPLICATION: Accessible only when authenticated
  // ==========================================================
  return <App session={session} onSignOut={() => setSession(null)} />;
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RootApp />
  </StrictMode>
);
