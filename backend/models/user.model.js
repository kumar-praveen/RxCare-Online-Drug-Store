// models/user.model.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    cartItems: { type: Object, default: {} },
    // ── Email Verification ──────────────────
    isVerified: { type: Boolean, default: false },
    verifyToken: { type: String, default: "" },
    verifyTokenExpiry: { type: Number, default: 0 },
  },
  { minimize: false },
);

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
