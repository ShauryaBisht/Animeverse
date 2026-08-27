import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInUser, signUpUser } from "../services/authService";

interface FormErrors {
  fullName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export default function Auth() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [fieldErrors, setFieldErrors] = useState<FormErrors>({});
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Validation regex patterns
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;

  const validate = (): boolean => {
    const errors: FormErrors = {};

    // Email validation
    if (!email.trim()) {
      errors.email = "Email is required.";
    } else if (!emailRegex.test(email.trim())) {
      errors.email = "Please enter a valid email address.";
    }

    // Password validation
    if (!password) {
      errors.password = "Password is required.";
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters.";
    }

    // Sign-up specific validations
    if (isSignUp) {
      if (!fullName.trim()) {
        errors.fullName = "Username is required.";
      } else if (!usernameRegex.test(fullName.trim())) {
        errors.fullName = "Username must be 3-20 characters (letters, numbers, underscores only).";
      }

      if (password !== confirmPassword) {
        errors.confirmPassword = "Passwords do not match.";
      }
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!validate()) return;

    setLoading(true);

    try {
      if (isSignUp) {
        await signUpUser(email.trim(), password, fullName.trim());
        setSuccessMsg("Account created! Check your email or proceed to log in.");
      } else {
        await signInUser(email.trim(), password);
        navigate("/");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = (signupMode: boolean) => {
    setIsSignUp(signupMode);
    setFieldErrors({});
    setErrorMsg("");
    setSuccessMsg("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setFullName("");
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-2xl p-8 shadow-xl">
        <h2 className="text-2xl font-bold text-center text-white mb-2">
          {isSignUp ? "Create an Account" : "Welcome Back"}
        </h2>
        <p className="text-sm text-neutral-400 text-center mb-6">
          {isSignUp
            ? "Sign up to start tracking your anime journey"
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

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          {isSignUp && (
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                Username
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="tanjiro_01"
                className={`w-full px-4 py-2.5 bg-neutral-950 border rounded-xl text-white text-sm focus:outline-none transition ${
                  fieldErrors.fullName
                    ? "border-red-500 focus:border-red-500"
                    : "border-neutral-800 focus:border-amber-500"
                }`}
              />
              {fieldErrors.fullName && (
                <p className="text-red-400 text-xs mt-1">{fieldErrors.fullName}</p>
              )}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className={`w-full px-4 py-2.5 bg-neutral-950 border rounded-xl text-white text-sm focus:outline-none transition ${
                fieldErrors.email
                  ? "border-red-500 focus:border-red-500"
                  : "border-neutral-800 focus:border-amber-500"
              }`}
            />
            {fieldErrors.email && (
              <p className="text-red-400 text-xs mt-1">{fieldErrors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className={`w-full px-4 py-2.5 bg-neutral-950 border rounded-xl text-white text-sm focus:outline-none transition ${
                fieldErrors.password
                  ? "border-red-500 focus:border-red-500"
                  : "border-neutral-800 focus:border-amber-500"
              }`}
            />
            {fieldErrors.password && (
              <p className="text-red-400 text-xs mt-1">{fieldErrors.password}</p>
            )}
          </div>

          {isSignUp && (
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className={`w-full px-4 py-2.5 bg-neutral-950 border rounded-xl text-white text-sm focus:outline-none transition ${
                  fieldErrors.confirmPassword
                    ? "border-red-500 focus:border-red-500"
                    : "border-neutral-800 focus:border-amber-500"
                }`}
              />
              {fieldErrors.confirmPassword && (
                <p className="text-red-400 text-xs mt-1">
                  {fieldErrors.confirmPassword}
                </p>
              )}
            </div>
          )}

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
            onClick={() => resetForm(!isSignUp)}
            className="text-amber-500 font-semibold hover:underline"
          >
            {isSignUp ? "Log In" : "Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
}