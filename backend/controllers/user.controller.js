import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { sendEmail } from "../configs/nodemailer.js";

// ── Helper: Set Token Cookie ─────────────────────────────────────────────
const setTokenCookie = (res, token) => {
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

// Register User : /api/user/register
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.json({ success: false, message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate secure token
    const verifyToken = crypto.randomBytes(32).toString("hex");
    const verifyTokenExpiry = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

    await User.create({
      name,
      email,
      password: hashedPassword,
      verifyToken,
      verifyTokenExpiry,
    });

    // Send verification email
    const verifyUrl = `http:localhost:5173/verify-email?token=${verifyToken}`;
    await sendEmail({ to: email, type: "verification", name, verifyUrl });

    // ✅ No cookie set — user must verify first then login
    return res.json({
      success: true,
      message: `Account created! Please check ${email} to verify your account before logging in.`,
    });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

// Login User : /api/user/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.json({ success: false, message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid email or password" });
    }

    // ✅ Block login if not verified
    if (!user.isVerified) {
      return res.json({
        success: false,
        message: "Please verify your email before logging in.",
        notVerified: true,
        email: user.email,
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    setTokenCookie(res, token);

    return res.json({
      success: true,
      message: `Welcome back ${user.name}!`,
      user: {
        name: user.name,
        email: user.email,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

// Verify Email via Link : /api/user/verify-email
export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.json({ success: false, message: "Invalid verification link" });
    }

    const user = await User.findOne({ verifyToken: token });

    if (!user) {
      return res.json({
        success: false,
        message: "Invalid or expired verification link",
      });
    }

    if (user.isVerified) {
      return res.json({
        success: false,
        message: "Email already verified. Please login.",
        alreadyVerified: true,
      });
    }

    if (Date.now() > user.verifyTokenExpiry) {
      return res.json({
        success: false,
        message: "Verification link has expired. Please request a new one.",
        expired: true,
        email: user.email, // ✅ send email back for resend
      });
    }

    // Mark as verified & clear token
    user.isVerified = true;
    user.verifyToken = "";
    user.verifyTokenExpiry = 0;
    await user.save();

    // Send welcome email
    await sendEmail({ to: user.email, type: "welcome", name: user.name });

    return res.json({
      success: true,
      message: "Email verified successfully! You can now login. 🎉",
      email: user.email, // ✅ send email back to pre-fill login
    });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

// Resend Verification Link : /api/user/resend-verification
export const resendVerification = async (req, res) => {
  try {
    const { email } = req.body;

    // ✅ Find by email — no auth needed since user isn't logged in
    const user = await User.findOne({ email });

    if (!user) {
      return res.json({
        success: false,
        message: "No account found with this email",
      });
    }

    if (user.isVerified) {
      return res.json({
        success: false,
        message: "Email already verified. Please login.",
      });
    }

    // Generate new token
    const verifyToken = crypto.randomBytes(32).toString("hex");
    user.verifyToken = verifyToken;
    user.verifyTokenExpiry = Date.now() + 24 * 60 * 60 * 1000;
    await user.save();

    const verifyUrl = `${process.env.CLIENT_URL}/verify-email?token=${verifyToken}`;
    await sendEmail({
      to: user.email,
      type: "verification",
      name: user.name,
      verifyUrl,
    });

    return res.json({
      success: true,
      message: "Verification link sent! Please check your email.",
    });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

// Check Auth : /api/user/is-auth
export const isAuth = async (req, res) => {
  try {
    const { userId } = req;
    const user = await User.findById(userId).select("-password");
    return res.json({ success: true, user });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Logout User : /api/user/logout
export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });
    return res.json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
