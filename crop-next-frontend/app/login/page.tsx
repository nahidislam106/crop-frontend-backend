"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Leaf, Mail, Lock, Eye, EyeOff, AlertCircle } from "lucide-react";
import LanguageToggle from "@/components/LanguageToggle";

export default function LoginPage() {
  const router = useRouter();
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [showPw,   setShowPw]   = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { setError("Please fill in all fields."); return; }
    setLoading(true);
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.replace("/dashboard");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Login failed";
      setError(msg.replace("Firebase: ", "").replace(/ \(auth.*?\)/, ""));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="absolute top-4 right-4 z-20">
        <LanguageToggle compact />
      </div>
      {/* Left — branding panel */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-green-600 via-emerald-600 to-teal-700 flex-col justify-between p-12 relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-white/5 rounded-full" />
        <div className="absolute -bottom-32 -right-20 w-96 h-96 bg-white/5 rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/5 rounded-full" />

        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <Leaf className="text-white" size={22} />
            </div>
            <span className="text-white font-bold text-xl">AgriSense</span>
          </div>
        </div>

        <div className="relative z-10">
          <h2 className="text-4xl font-bold text-white leading-tight mb-4">
            Grow smarter<br />with AI insights
          </h2>
          <p className="text-green-100 text-lg leading-relaxed mb-8">
            Monitor soil health, track weather patterns, and get precise crop recommendations powered by machine learning.
          </p>
          <div className="grid grid-cols-3 gap-4">
            {[
              { v: "22+",    l: "Crop types" },
              { v: "12",     l: "Soil metrics" },
              { v: "99.2%",  l: "Accuracy" },
            ].map(({ v, l }) => (
              <div key={l} className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm border border-white/10">
                <div className="text-2xl font-bold text-white">{v}</div>
                <div className="text-xs text-green-200 mt-1">{l}</div>
              </div>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-green-200 text-sm">
          © 2026 AgriSense. Smart Crop Recommendation System.
        </p>
      </div>

      {/* Right — form panel */}
      <div className="flex-1 flex items-center justify-center p-6 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
            <div className="w-9 h-9 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
              <Leaf className="text-white" size={20} />
            </div>
            <span className="font-bold text-gray-900 text-xl">AgriSense</span>
          </div>

          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 animate-slide-up">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Welcome back</h1>
            <p className="text-gray-500 text-sm mb-8">
              Sign in to your farmer dashboard
            </p>

            {error && (
              <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-2xl px-4 py-3 mb-6">
                <AlertCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email address
                </label>
                <div className="relative">
                  <Mail
                    size={17}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock
                    size={17}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type={showPw ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Your password"
                    className="w-full pl-10 pr-11 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPw ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl text-sm shadow-md hover:shadow-green-200 hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Signing in…
                  </span>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-500">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-green-600 font-semibold hover:underline">
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
