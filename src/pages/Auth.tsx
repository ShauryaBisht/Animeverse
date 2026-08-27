import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInUser, signUpUser } from "../services/authService";

export default function Auth() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setLoading(true);

    try {
      if (isSignUp) {
        if (!fullName.trim()) {
          throw new Error("Please enter your full name.");
        }
        await signUpUser(email, password, fullName);
        setSuccessMsg("Account created successfully! Check your email to confirm or log in.");
      } else {
        await signInUser(email, password);
        navigate("/");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-2xl p-8 shadow-xl">
        <h2 className="text-2xl font-bold text-center text-white mb-2">
          {isSignUp ? "Create an Account" : "Welcome Back"}
        </h2>
        <p className="text-sm text-neutral-400 text-center mb-6">
          {isSignUp
            ? "Sign up to track your favorite anime"
            : "Sign in to access your saved watchlist"}
        </p>

        {errorMsg && (
          <div className="mb-4 p-3 bg-red-950/60 border border-red-800 text-red-300 text-xs rounded-xl">
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs rounded-xl">
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                Username
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Tanjiro Kamado"
                className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white text-sm focus:outline-none focus:border-amber-500 transition"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white text-sm focus:outline-none focus:border-amber-500 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white text-sm focus:outline-none focus:border-amber-500 transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-neutral-950 font-bold rounded-xl text-sm transition"
          >
            {loading ? "Processing..." : isSignUp ? "Sign Up" : "Log In"}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-neutral-400">
          {isSignUp ? "Already have an account? " : "Don't have an account? "}
          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setErrorMsg("");
              setSuccessMsg("");
            }}
            className="text-amber-500 font-semibold hover:underline"
          >
            {isSignUp ? "Log In" : "Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
}