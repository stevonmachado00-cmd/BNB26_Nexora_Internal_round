import React, { useState } from "react";
import { ArrowRight, Lock, Mail, User } from "lucide-react";

interface AuthProps {
  mode: "login" | "signup";
  onSuccess: () => void;
  onSwitchMode: (mode: "login" | "signup") => void;
}

export const AuthPages: React.FC<AuthProps> = ({ mode, onSuccess, onSwitchMode }) => {
  const [email, setEmail] = useState("alex.morgan@relearn.io");
  const [password, setPassword] = useState("••••••••");
  const [name, setName] = useState("Alex Morgan");
  const [confirmPassword, setConfirmPassword] = useState("••••••••");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) {
      setError("Please provide a valid email address.");
      return;
    }
    if (mode === "signup" && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    setError("");
    setTimeout(() => {
      setLoading(false);
      onSuccess();
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#090d13] text-[#e6edf3] flex items-center justify-center p-6 select-none">
      <div className="w-full max-w-sm p-6 rounded bg-[#0e1218] border border-[#212734] space-y-5">
        <div className="space-y-1.5 text-left">
          <div className="w-7 h-7 rounded bg-[#1b2230] border border-[#2f3a4e] flex items-center justify-center text-[#f0f6fc] font-mono font-bold text-xs">
            RE
          </div>
          <h2 className="text-lg font-bold tracking-tight text-[#f0f6fc] font-mono">
            {mode === "login" ? "Sign in to Re:Learn" : "Create Re:Learn Account"}
          </h2>
          <p className="text-xs text-[#8b949e]">
            {mode === "login"
              ? "Access your cognitive mastery profile and diagnostics."
              : "Initialize your cognitive learner model and skill map."}
          </p>
        </div>

        {error && (
          <div className="p-2.5 rounded bg-[#261114] border border-[#542227] text-[#f85149] text-xs font-mono">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          {mode === "signup" && (
            <div className="space-y-1">
              <label className="text-[#8b949e] font-mono text-[11px]">Full Name</label>
              <div className="relative">
                <User className="w-3.5 h-3.5 text-[#6e7681] absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#090d13] border border-[#212734] rounded pl-8 pr-3 py-1.5 text-[#c9d1d9] placeholder:text-[#6e7681] focus:outline-none focus:border-[#388bfd]"
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-[#8b949e] font-mono text-[11px]">Email Address</label>
            <div className="relative">
              <Mail className="w-3.5 h-3.5 text-[#6e7681] absolute left-2.5 top-2.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#090d13] border border-[#212734] rounded pl-8 pr-3 py-1.5 text-[#c9d1d9] placeholder:text-[#6e7681] focus:outline-none focus:border-[#388bfd] font-mono text-xs"
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-[#8b949e] font-mono text-[11px]">Password</label>
              {mode === "login" && (
                <button
                  type="button"
                  onClick={() => alert("Password reset link sent to " + email)}
                  className="text-[10px] text-[#58a6ff] hover:text-[#79b8ff] font-mono"
                >
                  Forgot?
                </button>
              )}
            </div>
            <div className="relative">
              <Lock className="w-3.5 h-3.5 text-[#6e7681] absolute left-2.5 top-2.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#090d13] border border-[#212734] rounded pl-8 pr-3 py-1.5 text-[#c9d1d9] focus:outline-none focus:border-[#388bfd] font-mono text-xs"
              />
            </div>
          </div>

          {mode === "signup" && (
            <div className="space-y-1">
              <label className="text-[#8b949e] font-mono text-[11px]">Confirm Password</label>
              <div className="relative">
                <Lock className="w-3.5 h-3.5 text-[#6e7681] absolute left-2.5 top-2.5" />
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-[#090d13] border border-[#212734] rounded pl-8 pr-3 py-1.5 text-[#c9d1d9] focus:outline-none focus:border-[#388bfd] font-mono text-xs"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded bg-[#238636] hover:bg-[#2ea043] font-semibold font-mono text-white text-xs flex items-center justify-center gap-1.5 border border-[#2ea043] transition-colors mt-1"
          >
            {loading ? (
              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>{mode === "login" ? "Sign In" : "Register Profile"}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

        <div className="relative flex items-center justify-center py-1">
          <div className="border-t border-[#212734] w-full" />
          <span className="bg-[#0e1218] px-2 text-[10px] text-[#6e7681] font-mono absolute">
            OR
          </span>
        </div>

        <button
          onClick={onSuccess}
          className="w-full py-1.5 rounded bg-[#12161f] hover:bg-[#1a202c] border border-[#212734] text-[#c9d1d9] font-mono text-xs flex items-center justify-center gap-2 transition-colors"
        >
          <span className="font-bold">G</span>
          <span>Sign In with GitHub / SSO</span>
        </button>

        <div className="text-center pt-1 font-mono text-xs">
          {mode === "login" ? (
            <p className="text-[#8b949e] text-[11px]">
              No profile yet?{" "}
              <button
                onClick={() => onSwitchMode("signup")}
                className="text-[#58a6ff] hover:text-[#79b8ff] font-semibold"
              >
                Register
              </button>
            </p>
          ) : (
            <p className="text-[#8b949e] text-[11px]">
              Already registered?{" "}
              <button
                onClick={() => onSwitchMode("login")}
                className="text-[#58a6ff] hover:text-[#79b8ff] font-semibold"
              >
                Sign In
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
