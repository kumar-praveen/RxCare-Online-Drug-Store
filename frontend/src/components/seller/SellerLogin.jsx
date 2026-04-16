import React, { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Mail, Lock, Eye, EyeOff, ShieldCheck, ArrowRight } from "lucide-react";

const SellerLogin = () => {
  const { isSeller, setIsSeller, axios } = useAppContext();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await axios.post("/api/seller/login", {
        email,
        password,
      });

      if (data.success) {
        setIsSeller(true);
        toast.success("Welcome to Seller Dashboard!");
        navigate("/seller");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isSeller) navigate("/seller");
  }, [isSeller]);

  if (isSeller) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-4xl flex rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
        {/* ── Left Panel ─────────────────────────────────────────────── */}
        <div className="hidden md:flex flex-col justify-between w-1/2 bg-primary p-10 text-white">
          {/* Brand */}
          <div>
            <h1 className="text-3xl font-bold mb-1">
              Rx<span className="text-white/70">Care</span>
            </h1>
            <p className="text-white/60 text-sm">Seller Portal</p>
          </div>

          {/* Main Content */}
          <div className="flex flex-col gap-6">
            <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-sm">
              <ShieldCheck className="w-10 h-10 text-white/80 mb-4" />
              <h2 className="text-2xl font-bold leading-snug">
                Manage Your Pharmacy Store
              </h2>
              <p className="text-white/70 text-sm mt-2 leading-relaxed">
                Access your dashboard to manage products, track orders, and grow
                your business with RxCare.
              </p>
            </div>

            {/* Features */}
            {[
              "Add & manage medicine listings",
              "Track & fulfil customer orders",
              "Monitor sales & inventory",
            ].map((feature, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                  <ArrowRight className="w-3 h-3 text-white" />
                </div>
                <p className="text-sm text-white/80">{feature}</p>
              </div>
            ))}
          </div>

          {/* Footer */}
          <p className="text-white/40 text-xs">
            © {new Date().getFullYear()} RxCare. All rights reserved.
          </p>
        </div>

        {/* ── Right Panel: Form ───────────────────────────────────────── */}
        <div className="flex-1 bg-white flex flex-col justify-center px-8 py-12">
          {/* Mobile Brand */}
          <div className="md:hidden mb-8 text-center">
            <h1 className="text-2xl font-bold text-gray-800">
              <span className="text-primary">Rx</span>Care
            </h1>
            <p className="text-xs text-gray-400 mt-1">Seller Portal</p>
          </div>

          {/* Form Header */}
          <div className="mb-8">
            <span className="text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full uppercase tracking-wide">
              Seller Access
            </span>
            <h2 className="text-2xl font-bold text-gray-800 mt-3">
              Welcome Back
            </h2>
            <p className="text-gray-400 text-sm mt-1">
              Login to access your seller dashboard
            </p>
          </div>

          {/* Form */}
          <form onSubmit={onSubmitHandler} className="flex flex-col gap-5">
            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seller@rxcare.com"
                  required
                  className="w-full pl-9 pr-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition"
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
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
                  className="w-full pl-9 pr-10 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition"
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
              <div className="text-right">
                <span className="text-xs text-primary hover:underline cursor-pointer">
                  Forgot password?
                </span>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-xl text-white font-semibold text-sm transition-all flex items-center justify-center gap-2 mt-2 ${
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
                  Logging in...
                </>
              ) : (
                <>
                  Login to Dashboard
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Back to Home */}
          <p className="text-center text-xs text-gray-400 mt-8">
            Not a seller?{" "}
            <span
              onClick={() => navigate("/")}
              className="text-primary font-semibold hover:underline cursor-pointer"
            >
              Go back to Home
            </span>
          </p>

          {/* Trust Note */}
          <div className="flex items-center justify-center gap-2 mt-6 text-xs text-gray-400">
            <ShieldCheck className="w-3.5 h-3.5 text-green-500" />
            Secure & encrypted login
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerLogin;
