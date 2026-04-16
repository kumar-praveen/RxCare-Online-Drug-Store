import express from "express";
import {
  register,
  login,
  isAuth,
  logout,
  verifyEmail,
  resendVerification,
} from "../controllers/user.controller.js";
import authUser from "../middlewares/authUser.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/is-auth", authUser, isAuth);
router.get("/logout", authUser, logout);
router.get("/verify-email", verifyEmail);
// ✅ No auth needed — user is not logged in yet
router.post("/resend-verification", resendVerification);

export default router;
