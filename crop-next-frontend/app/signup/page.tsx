"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Leaf, Mail, Lock, Eye, EyeOff, User, AlertCircle, CheckCircle2 } from "lucide-react";
import LanguageToggle from "@/components/LanguageToggle";

export default function SignupPage() {
  const router = useRouter();
  const [name,     setName]     = useState("");
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [confirm,  setConfirm]  = useState("");
  const [showPw,   setShowPw]   = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");

  const pwStrength = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : 3;
  const strengthLabel = ["", "Weak", "Good", "Strong"];
  const strengthColor = ["", "bg-red-400", "bg-yellow-400", "bg-green-500"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) { setError("Passwords do not match."); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    setLoading(true);
    setError("");
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      if (name) await updateProfile(cred.user, { displayName: name });
      router.replace("/dashboard");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Signup failed";
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
      {/* Left panel */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-green-600 via-emerald-600 to-teal-700 flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-white/5 rounded-full" />
        <div className="absolute -bottom-32 -right-20 w-96 h-96 bg-white/5 rounded-full" />

        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <Leaf className="text-white" size={22} />
          </div>
          <span className="text-white font-bold text-xl">AgriSense</span>
        </div>

        <div className="relative z-10">
          <h2 className="text-4xl font-bold text-white leading-tight mb-4">
            Start your<br />smart farm today
          </h2>
          <p className="text-green-100 text-lg leading-relaxed mb-8">
            Join thousands of farmers using AI to maximize yields and make data-driven decisions.
          </p>
          <div className="space-y-4">
            {[
              "Real-time soil nutrient monitoring",
              "AI-powered crop recommendations",
              "Weather microclimate analysis",
              "Save & export your farm reports",
            ].map((f) => (
              <div key={f} className="flex items-center gap-3">
                <CheckCircle2 className="text-green-300 shrink-0" size={20} />
                <span className="text-green-100 text-sm">{f}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-green-200 text-sm">
          © 2026 AgriSense. Smart Crop Recommendation System.
        </p>
      </div>

      {/* Right — form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
            <div className="w-9 h-9 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
              <Leaf className="text-white" size={20} />
            </div>
            <span className="font-bold text-gray-900 text-xl">AgriSense</span>
          </div>

          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 animate-slide-up">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Create account</h1>
            <p className="text-gray-500 text-sm mb-8">
              Set up your farmer profile in seconds
            </p>

            {error && (
              <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-2xl px-4 py-3 mb-6">
                <AlertCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <div className="relative">
                  <User size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent bg-gray-50 focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <div className="relative">
                  <Mail size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent bg-gray-50 focus:bg-white transition-all"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <div className="relative">
                  <Lock size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPw ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min. 6 characters"
                    className="w-full pl-10 pr-11 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent bg-gray-50 focus:bg-white transition-all"
                    required
                  />
                  <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPw ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
                {password && (
                  <div className="mt-2 flex gap-1.5">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className={`h-1.5 flex-1 rounded-full transition-all ${i <= pwStrength ? strengthColor[pwStrength] : "bg-gray-200"}`}
                      />
                    ))}
                    <span className="text-xs text-gray-500 ml-1">{strengthLabel[pwStrength]}</span>
                  </div>
                )}
              </div>

              {/* Confirm password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                <div className="relative">
                  <Lock size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    placeholder="Repeat password"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent bg-gray-50 focus:bg-white transition-all"
                    required
                  />
                  {confirm && (
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
                      {confirm === password
                        ? <CheckCircle2 size={17} className="text-green-500" />
                        : <AlertCircle size={17} className="text-red-400" />
                      }
                    </div>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl text-sm shadow-md hover:shadow-green-200 hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed transition-all active:scale-[0.98] mt-2"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Creating account…
                  </span>
                ) : (
                  "Create Account"
                )}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-500">
              Already have an account?{" "}
              <Link href="/login" className="text-green-600 font-semibold hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
