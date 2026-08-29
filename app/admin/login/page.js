"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabase";

export default function AdminLogin() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();

    setError("");
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/admin");
  }

  return (
    <main className="min-h-screen bg-[#150297] text-white">

      <div className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-6">

        <div className="w-full max-w-md">

          {/* Logo */}

          <div className="mb-10 text-center">

            <a href="/" className="inline-block">
              <img
                src="/olakh-logo-transparent.png"
                alt="The Olakh Collective"
                className="mx-auto h-16 w-auto"
              />
            </a>

            <p
              className="mt-6 text-sm font-bold uppercase tracking-[0.25em] text-[#FC65C3]"
              style={{
                WebkitTextStroke: "0.5px #6C0666",
              }}
            >
              Admin
            </p>

            <h1 className="mt-3 text-4xl font-bold tracking-tight md:text-5xl">
              Welcome back.
            </h1>

            <p className="mt-4 text-white/70">
              Sign in to manage Olakh.
            </p>

          </div>


          {/* Login Card */}

          <div className="rounded-2xl bg-white p-8 text-[#150297] shadow-[0_20px_60px_rgba(0,0,0,0.3)] md:p-10">

            <form onSubmit={handleLogin}>

              {/* Email */}

              <div>

                <label
                  htmlFor="email"
                  className="text-sm font-semibold"
                >
                  Email
                </label>

                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="admin@example.com"
                  className="mt-2 w-full rounded-lg border border-[#150297]/20 px-4 py-3 outline-none transition focus:border-[#311EB2] focus:ring-2 focus:ring-[#311EB2]/20"
                />

              </div>


              {/* Password */}

              <div className="mt-5">

                <label
                  htmlFor="password"
                  className="text-sm font-semibold"
                >
                  Password
                </label>

                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="mt-2 w-full rounded-lg border border-[#150297]/20 px-4 py-3 outline-none transition focus:border-[#311EB2] focus:ring-2 focus:ring-[#311EB2]/20"
                />

              </div>


              {/* Error */}

              {error && (
                <div className="mt-5 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}


              {/* Button */}

              <button
                type="submit"
                disabled={loading}
                className="mt-7 w-full rounded-full bg-[#150297] px-6 py-3.5 font-semibold text-white transition hover:bg-[#311EB2] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>

            </form>


            {/* Back */}

            <a
              href="/"
              className="mt-6 block text-center text-sm text-[#311EB2] transition-opacity hover:opacity-60"
            >
              ← Back to Olakh
            </a>

          </div>

        </div>

      </div>

    </main>
  );
}