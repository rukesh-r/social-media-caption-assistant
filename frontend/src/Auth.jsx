import { useState } from "react";

import { supabase } from "./supabaseClient";


function Auth() {

  const [isLogin, setIsLogin] =
    useState(true);


  const [email, setEmail] =
    useState("");


  const [password, setPassword] =
    useState("");


  const [loading, setLoading] =
    useState(false);


  const [error, setError] =
    useState("");


  const [message, setMessage] =
    useState("");


  // ============================================================
  // LOGIN / REGISTER
  // ============================================================

  const handleSubmit = async (event) => {

    event.preventDefault();


    setError("");

    setMessage("");


    if (!email.trim()) {

      setError(
        "Please enter your email."
      );

      return;

    }


    if (!password) {

      setError(
        "Please enter your password."
      );

      return;

    }


    if (password.length < 6) {

      setError(
        "Password must contain at least 6 characters."
      );

      return;

    }


    setLoading(true);


    try {

      // ========================================================
      // REGISTER
      // ========================================================

      if (!isLogin) {

        const {
          data,
          error
        } = await supabase.auth.signUp({

          email:
            email.trim(),

          password:

            password,

          options: {

            emailRedirectTo:
              window.location.origin

          }

        });


        if (error) {

          throw error;

        }


        // Email confirmation enabled
        if (
          data.user &&
          !data.session
        ) {

          setMessage(
            "Registration successful! Please check your email and confirm your account before logging in."
          );

        }

        else {

          setMessage(
            "Registration successful!"
          );

        }

      }


      // ========================================================
      // LOGIN
      // ========================================================

      else {

        const {
          error
        } = await supabase.auth.signInWithPassword({

          email:
            email.trim(),

          password

        });


        if (error) {

          throw error;

        }

      }

    }


    catch (err) {

      console.error(err);


      setError(
        err.message ||
        "Authentication failed."
      );

    }


    finally {

      setLoading(false);

    }

  };


  // ============================================================
  // SWITCH LOGIN / REGISTER
  // ============================================================

  const toggleMode = () => {

    setIsLogin(
      !isLogin
    );

    setError("");

    setMessage("");

  };


  // ============================================================
  // UI
  // ============================================================

  return (

    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6">

      <div className="w-full max-w-md">


        {/* BRAND */}

        <div className="text-center mb-8">

          <h1 className="text-3xl font-bold text-purple-600">

            CaptionCraft AI

          </h1>


          <p className="text-gray-500 mt-2">

            AI Social Media Content Assistant

          </p>

        </div>


        {/* CARD */}

        <div className="bg-white rounded-2xl border shadow-sm p-8">


          <div className="text-center mb-7">

            <div className="text-5xl mb-4">

              {isLogin ? "🔐" : "🚀"}

            </div>


            <h2 className="text-2xl font-bold text-gray-900">

              {isLogin
                ? "Welcome Back"
                : "Create Your Account"
              }

            </h2>


            <p className="text-gray-500 mt-2">

              {isLogin

                ? "Login to continue to CaptionCraft AI."

                : "Create an account to save your AI content."

              }

            </p>

          </div>


          {/* ERROR */}

          {error && (

            <div className="mb-5 bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm">

              {error}

            </div>

          )}


          {/* MESSAGE */}

          {message && (

            <div className="mb-5 bg-green-50 border border-green-200 text-green-700 rounded-xl p-4 text-sm">

              {message}

            </div>

          )}


          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >


            {/* EMAIL */}

            <div>

              <label className="block text-sm font-medium mb-2">

                Email Address

              </label>


              <input

                type="email"

                value={email}

                onChange={(event) =>
                  setEmail(
                    event.target.value
                  )
                }

                placeholder="you@example.com"

                className="w-full border rounded-xl p-3.5 focus:ring-2 focus:ring-purple-500 focus:outline-none"

              />

            </div>


            {/* PASSWORD */}

            <div>

              <label className="block text-sm font-medium mb-2">

                Password

              </label>


              <input

                type="password"

                value={password}

                onChange={(event) =>
                  setPassword(
                    event.target.value
                  )
                }

                placeholder="Minimum 6 characters"

                className="w-full border rounded-xl p-3.5 focus:ring-2 focus:ring-purple-500 focus:outline-none"

              />

            </div>


            {/* BUTTON */}

            <button

              type="submit"

              disabled={loading}

              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3.5 rounded-xl disabled:opacity-50"

            >

              {loading

                ? "Please wait..."

                : isLogin
                  ? "🔐 Login"
                  : "🚀 Create Account"

              }

            </button>

          </form>


          {/* SWITCH */}

          <div className="text-center mt-6">

            <p className="text-sm text-gray-500">

              {isLogin

                ? "Don't have an account?"

                : "Already have an account?"

              }


              <button

                type="button"

                onClick={toggleMode}

                className="ml-2 text-purple-600 font-semibold hover:text-purple-700"

              >

                {isLogin
                  ? "Register"
                  : "Login"
                }

              </button>

            </p>

          </div>

        </div>


        {/* FOOTER */}

        <p className="text-center text-xs text-gray-400 mt-6">

          CaptionCraft AI • Generative AI

        </p>

      </div>

    </div>

  );

}


export default Auth;