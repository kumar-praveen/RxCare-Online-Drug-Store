import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import {
  CheckCircle,
  XCircle,
  Clock,
  Loader,
  ArrowRight,
  RotateCcw,
  Mail,
  LogIn,
} from "lucide-react";
import toast from "react-hot-toast";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const { axios, setShowUserLogin } = useAppContext();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [status, setStatus] = useState("loading");
  const [expiredEmail, setExpiredEmail] = useState("");
  const [resendLoading, setResendLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  // ── Countdown ────────────────────────────────────────────────────────
  useEffect(() => {
    if (resendCooldown === 0) return;
    const t = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCooldown]);

  // ── Verify Token on Mount ────────────────────────────────────────────
  useEffect(() => {
    if (!token) {
      setStatus("invalid");
      return;
    }
    verifyToken();
  }, [token]);

  const verifyToken = async () => {
    try {
      setStatus("loading");
      const { data } = await axios.get(`/api/user/verify-email?token=${token}`);

      if (data.success) {
        setStatus("success");
      } else if (data.alreadyVerified) {
        setStatus("already");
      } else if (data.expired) {
        setStatus("expired");
        if (data.email) setExpiredEmail(data.email);
      } else {
        setStatus("invalid");
      }
    } catch (error) {
      setStatus("invalid");
    }
  };

  // ── Resend Verification ──────────────────────────────────────────────
  const handleResend = async () => {
    if (!expiredEmail) {
      toast.error("Email not found. Please register again.");
      return;
    }
    try {
      setResendLoading(true);
      const { data } = await axios.post("/api/user/resend-verification", {
        email: expiredEmail,
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

  // ── Open Login Modal & Go Home ───────────────────────────────────────
  const handleGoLogin = () => {
    navigate("/"); // go to home
    setTimeout(() => {
      setShowUserLogin(true); // ✅ open login modal after navigation
    }, 100);
  };

  // ── Status Configs ───────────────────────────────────────────────────
  const statusConfig = {
    loading: {
      icon: <Loader className="w-12 h-12 text-primary animate-spin" />,
      iconBg: "bg-primary/10",
      accent: "bg-primary",
      title: "Verifying your email...",
      desc: "Please wait while we verify your email address.",
    },
    success: {
      icon: <CheckCircle className="w-12 h-12 text-green-500" />,
      iconBg: "bg-green-50",
      accent: "bg-green-400",
      title: "Email Verified! 🎉",
      desc: "Your email has been verified successfully. A welcome email has been sent to your inbox. You can now login to your account.",
    },
    expired: {
      icon: <Clock className="w-12 h-12 text-orange-400" />,
      iconBg: "bg-orange-50",
      accent: "bg-orange-400",
      title: "Link Expired",
      desc: "This verification link has expired. Verification links are valid for 24 hours. Please request a new one below.",
    },
    invalid: {
      icon: <XCircle className="w-12 h-12 text-red-400" />,
      iconBg: "bg-red-50",
      accent: "bg-red-400",
      title: "Invalid Link",
      desc: "This verification link is invalid or has already been used. Please request a new verification email.",
    },
    already: {
      icon: <CheckCircle className="w-12 h-12 text-blue-400" />,
      iconBg: "bg-blue-50",
      accent: "bg-blue-400",
      title: "Already Verified",
      desc: "Your email address has already been verified. Please login to continue.",
    },
  };

  const current = statusConfig[status];

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div
          onClick={() => navigate("/")}
          className="text-center mb-8 cursor-pointer"
        >
          <h1 className="text-3xl font-bold">
            <span className="text-primary">Rx</span>Care
          </h1>
          <p className="text-gray-400 text-sm mt-1">Your Trusted Pharmacy</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Top accent bar */}
          <div className={`h-1.5 w-full ${current.accent}`} />

          <div className="p-8 flex flex-col items-center text-center gap-5">
            {/* Icon */}
            <div
              className={`${current.iconBg} w-24 h-24 rounded-full flex items-center justify-center`}
            >
              {current.icon}
            </div>

            {/* Text */}
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                {current.title}
              </h2>
              <p className="text-gray-500 text-sm leading-relaxed">
                {current.desc}
              </p>
            </div>

            {/* ── Success Actions ─────────────────────────────────── */}
            {status === "success" && (
              <div className="w-full flex flex-col gap-3 mt-2">
                {/* ✅ Primary: Login Now — opens modal */}
                <button
                  onClick={handleGoLogin}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-primary hover:bg-primary-dull text-white rounded-xl font-semibold text-sm transition"
                >
                  <LogIn className="w-4 h-4" />
                  Login Now
                </button>
                {/* Secondary: Browse */}
                <button
                  onClick={() => {
                    navigate("/products");
                    scrollTo(0, 0);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3 border border-gray-200 text-gray-500 rounded-xl font-medium text-sm hover:bg-gray-50 transition"
                >
                  Browse Products
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* ── Already Verified Actions ────────────────────────── */}
            {status === "already" && (
              <button
                onClick={handleGoLogin}
                className="w-full flex items-center justify-center gap-2 py-3 bg-primary hover:bg-primary-dull text-white rounded-xl font-semibold text-sm transition"
              >
                <LogIn className="w-4 h-4" />
                Login Now
              </button>
            )}

            {/* ── Expired / Invalid Actions ───────────────────────── */}
            {(status === "expired" || status === "invalid") && (
              <div className="w-full flex flex-col gap-3">
                <button
                  onClick={handleResend}
                  disabled={
                    resendLoading || resendCooldown > 0 || !expiredEmail
                  }
                  className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition ${
                    resendLoading || resendCooldown > 0 || !expiredEmail
                      ? "bg-primary/50 cursor-not-allowed text-white"
                      : "bg-primary hover:bg-primary-dull text-white cursor-pointer"
                  }`}
                >
                  {resendLoading ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      Sending...
                    </>
                  ) : resendCooldown > 0 ? (
                    <>
                      <Clock className="w-4 h-4" />
                      Resend in {resendCooldown}s
                    </>
                  ) : (
                    <>
                      <RotateCcw className="w-4 h-4" />
                      Resend Verification Email
                    </>
                  )}
                </button>

                <button
                  onClick={() => navigate("/")}
                  className="w-full py-3 border border-gray-200 text-gray-500 rounded-xl font-medium text-sm hover:bg-gray-50 transition"
                >
                  Back to Home
                </button>

                {/* Email hint */}
                <div className="flex items-start gap-2 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 text-left">
                  <Mail className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-blue-600">
                    Check your spam/junk folder. The new email may take a few
                    minutes to arrive.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-400 mt-6">
          © {new Date().getFullYear()} RxCare. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default VerifyEmail;
