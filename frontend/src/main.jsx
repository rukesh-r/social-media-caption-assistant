import {
  StrictMode,
  useEffect,
  useState
} from "react";

import {
  createRoot
} from "react-dom/client";

import axios from "axios";

import "./index.css";

import App from "./App.jsx";

import Auth from "./Auth.jsx";

import { supabase } from "./supabaseClient";


// ============================================================
// AXIOS AUTH INTERCEPTOR
// ============================================================

axios.interceptors.request.use(
  async (config) => {

    try {

      const {
        data
      } = await supabase.auth.getSession();


      const session =
        data.session;


      if (session?.access_token) {

        config.headers =
          config.headers || {};


        config.headers.Authorization =
          `Bearer ${session.access_token}`;

      }

    }

    catch (error) {

      console.error(
        "Unable to attach authentication token:",
        error
      );

    }


    return config;

  },

  (error) => {

    return Promise.reject(error);

  }

);


// ============================================================
// ROOT APPLICATION
// ============================================================

function RootApp() {

  const [session, setSession] =
    useState(null);


  const [loading, setLoading] =
    useState(true);


  // ==========================================================
  // CHECK SESSION
  // ==========================================================

  useEffect(() => {

    let mounted = true;


    const loadSession = async () => {

      const {
        data,
        error
      } = await supabase.auth.getSession();


      if (error) {

        console.error(
          "Session error:",
          error
        );

      }


      if (mounted) {

        setSession(
          data.session
        );

        setLoading(false);

      }

    };


    loadSession();


    // ========================================================
    // AUTH STATE CHANGES
    // ========================================================

    const {
      data: listener
    } =
      supabase.auth.onAuthStateChange(

        (_event, newSession) => {

          setSession(
            newSession
          );

        }

      );


    return () => {

      mounted = false;

      listener.subscription.unsubscribe();

    };

  }, []);


  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {

    return (

      <div className="min-h-screen bg-slate-50 flex items-center justify-center">

        <div className="text-center">

          <div className="text-6xl animate-pulse mb-5">

            ✨

          </div>


          <p className="text-gray-500">

            Loading CaptionCraft AI...

          </p>

        </div>

      </div>

    );

  }


  // ==========================================================
  // AUTH SCREEN
  // ==========================================================

  if (!session) {

    return <Auth />;

  }


  // ==========================================================
  // MAIN APPLICATION
  // ==========================================================

  return <App />;

}


// ============================================================
// RENDER
// ============================================================

createRoot(
  document.getElementById("root")
).render(

  <StrictMode>

    <RootApp />

  </StrictMode>

);