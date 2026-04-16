import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { X, User, Mail, Lock, Eye, EyeOff, Send } from "lucide-react";

const Auth = () => {
  const [state, setState] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // ── Post Register State ─────────────────────────────────────────────────
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [showVerifyPrompt, setShowVerifyPrompt] = useState(false);

  // ── Unverified State (on login attempt) ────────────────────────────────
  const [unverifiedEmail, setUnverifiedEmail] = useState("");
  const [showUnverifiedPrompt, setShowUnverifiedPrompt] = useState(false);

  // ── Resend State ───────────────────────────────────────────────────────
  const [resendLoading, setResendLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const { setShowUserLogin, setUser, axios } = useAppContext();
  const navigate = useNavigate();

  // ── Resend Countdown ───────────────────────────────────────────────────
  React.useEffect(() => {
    if (resendCooldown === 0) return;
    const t = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCooldown]);

  const switchTab = (tab) => {
    setState(tab);
    setName("");
    setEmail("");
    setPassword("");
    setShowPassword(false);
    setShowVerifyPrompt(false);
    setShowUnverifiedPrompt(false);
  };

  // ── Submit Handler ─────────────────────────────────────────────────────
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await axios.post(`/api/user/${state}`, {
        name,
        email,
        password,
      });

      if (data.success) {
        if (state === "register") {
          // ✅ Show verify prompt — do NOT login user
          setRegisteredEmail(email);
          setShowVerifyPrompt(true);
        } else {
          // Login success
          toast.success(data.message);
          setUser(data.user);
          setShowUserLogin(false);
          navigate("/");
        }
      } else {
        // ✅ Handle unverified user trying to login
        if (data.notVerified) {
          setUnverifiedEmail(data.email || email);
          setShowUnverifiedPrompt(true);
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // ── Resend Verification ────────────────────────────────────────────────
  const handleResend = async (targetEmail) => {
    try {
      setResendLoading(true);
      const { data } = await axios.post("/api/user/resend-verification", {
        email: targetEmail,
      });
      if (data.success) {
        toast.success(data.message);
        setResendCooldown(60);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div
      onClick={() => setShowUserLogin(false)}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* ── Header ─────────────────────────────────────────────────── */}
        <div className="relative bg-primary/5 border-b border-primary/10 px-6 pt-6 pb-0">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">
              <span className="text-primary">Rx</span>Care
            </h2>
            <button
              onClick={() => setShowUserLogin(false)}
              className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1.5 rounded-full transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Tabs — hidden on special states */}
          {!showVerifyPrompt && !showUnverifiedPrompt && (
            <>
              <p className="text-sm text-gray-500 mb-4">
                {state === "login"
                  ? "Welcome back! Login to your account."
                  : "Create your RxCare account today."}
              </p>
              <div className="flex">
                {["login", "register"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => switchTab(tab)}
                    className={`flex-1 py-2.5 text-sm font-semibold transition-all border-b-2 ${
                      state === tab
                        ? "border-primary text-primary"
                        : "border-transparent text-gray-400 hover:text-gray-600"
                    }`}
                  >
                    {tab === "login" ? "Login" : "Sign Up"}
                  </button>
                ))}
              </div>
            </>
          )}

          {/* Verify Prompt Header */}
          {(showVerifyPrompt || showUnverifiedPrompt) && (
            <div className="pb-4">
              <p className="text-sm text-gray-500">Email Verification</p>
            </div>
          )}
        </div>

        {/* ── Verify Email Prompt (after register) ─────────────────── */}
        {showVerifyPrompt && (
          <div className="px-6 py-8 flex flex-col items-center text-center gap-5">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <Send className="w-7 h-7 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">
                Check Your Email! 📬
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                We've sent a verification link to{" "}
                <span className="font-semibold text-primary">
                  {registeredEmail}
                </span>
                . Please click the link to verify your account before logging
                in.
              </p>
            </div>

            {/* Steps */}
            <div className="w-full flex flex-col gap-2 bg-gray-50 rounded-xl p-4 text-left">
              {[
                "Check your inbox (or spam folder)",
                "Click the verification link",
                "Come back and login",
              ].map((step, idx) => (
                <div key={idx} className="flex items-center gap-3 text-sm">
                  <span className="w-5 h-5 rounded-full bg-primary text-white text-xs flex items-center justify-center shrink-0 font-bold">
                    {idx + 1}
                  </span>
                  <span className="text-gray-600">{step}</span>
                </div>
              ))}
            </div>

            {/* Resend */}
            <div className="flex flex-col items-center gap-2 w-full">
              <button
                onClick={() => handleResend(registeredEmail)}
                disabled={resendLoading || resendCooldown > 0}
                className="text-sm text-primary font-semibold hover:underline disabled:opacity-60 transition"
              >
                {resendCooldown > 0
                  ? `Resend in ${resendCooldown}s`
                  : resendLoading
                    ? "Sending..."
                    : "Resend verification email"}
              </button>

              <button
                onClick={() => switchTab("login")}
                className="w-full py-3 bg-primary hover:bg-primary-dull text-white rounded-xl font-semibold text-sm transition mt-1"
              >
                Go to Login
              </button>
            </div>
          </div>
        )}

        {/* ── Unverified Prompt (login attempt before verify) ───────── */}
        {showUnverifiedPrompt && (
          <div className="px-6 py-8 flex flex-col items-center text-center gap-5">
            <div className="w-16 h-16 bg-yellow-50 rounded-full flex items-center justify-center">
              <Mail className="w-7 h-7 text-yellow-500" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">
                Email Not Verified
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                You need to verify{" "}
                <span className="font-semibold text-primary">
                  {unverifiedEmail}
                </span>{" "}
                before you can login. Please check your inbox for the
                verification link.
              </p>
            </div>

            {/* Resend */}
            <button
              onClick={() => handleResend(unverifiedEmail)}
              disabled={resendLoading || resendCooldown > 0}
              className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition ${
                resendLoading || resendCooldown > 0
                  ? "bg-primary/50 cursor-not-allowed text-white"
                  : "bg-primary hover:bg-primary-dull text-white"
              }`}
            >
              <Send className="w-4 h-4" />
              {resendCooldown > 0
                ? `Resend in ${resendCooldown}s`
                : resendLoading
                  ? "Sending..."
                  : "Resend Verification Email"}
            </button>

            <button
              onClick={() => setShowUnverifiedPrompt(false)}
              className="text-sm text-gray-400 hover:text-gray-600 transition"
            >
              ← Back to Login
            </button>
          </div>
        )}

        {/* ── Normal Login / Register Form ──────────────────────────── */}
        {!showVerifyPrompt && !showUnverifiedPrompt && (
          <form
            onSubmit={onSubmitHandler}
            className="px-6 py-6 flex flex-col gap-4"
          >
            {/* Name */}
            {state === "register" && (
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    required
                    className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition"
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition"
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-9 pr-10 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Forgot Password */}
            {state === "login" && (
              <div className="text-right -mt-2">
                <span className="text-xs text-primary hover:underline cursor-pointer">
                  Forgot password?
                </span>
              </div>
            )}

            {/* Terms */}
            {state === "register" && (
              <p className="text-xs text-gray-400 -mt-1">
                By creating an account, you agree to our{" "}
                <span className="text-primary hover:underline cursor-pointer">
                  Terms of Service
                </span>{" "}
                and{" "}
                <span className="text-primary hover:underline cursor-pointer">
                  Privacy Policy
                </span>
                .
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-xl text-white font-semibold text-sm transition-all flex items-center justify-center gap-2 mt-1 ${
                loading
                  ? "bg-primary/60 cursor-not-allowed"
                  : "bg-primary hover:bg-primary-dull cursor-pointer"
              }`}
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8z"
                    />
                  </svg>
                  {state === "login" ? "Logging in..." : "Creating Account..."}
                </>
              ) : state === "login" ? (
                "Login"
              ) : (
                "Create Account"
              )}
            </button>

            {/* Switch Tab */}
            <p className="text-center text-xs text-gray-400">
              {state === "login" ? (
                <>
                  Don't have an account?{" "}
                  <span
                    onClick={() => switchTab("register")}
                    className="text-primary font-semibold hover:underline cursor-pointer"
                  >
                    Sign Up
                  </span>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <span
                    onClick={() => switchTab("login")}
                    className="text-primary font-semibold hover:underline cursor-pointer"
                  >
                    Login
                  </span>
                </>
              )}
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default Auth;
