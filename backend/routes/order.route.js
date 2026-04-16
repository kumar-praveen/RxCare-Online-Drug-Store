import express from "express";
import authUser from "../middlewares/authUser.js";
import authSeller from "../middlewares/authSeller.js";
import {
  getAllOrders,
  getUserOrders,
  placeOrderCOD,
  placeOrderRazorpay,
  verifyRazorpayPayment,
  updateOrderStatus,
  updatePaymentStatus,
} from "../controllers/order.controller.js";

const orderRouter = express.Router();

orderRouter.post("/cod", authUser, placeOrderCOD);
orderRouter.get("/user", authUser, getUserOrders);
orderRouter.get("/seller", authSeller, getAllOrders);
orderRouter.post("/status", authSeller, updateOrderStatus);
orderRouter.post("/payment", authSeller, updatePaymentStatus);

// ✅ Razorpay routes
orderRouter.post("/razorpay", authUser, placeOrderRazorpay);
orderRouter.post("/verify-razorpay", authUser, verifyRazorpayPayment);

export default orderRouter;
