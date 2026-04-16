import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./configs/db.js";
import "dotenv/config";
import userRouter from "./routes/user.route.js";
import sellerRouter from "./routes/seller.route.js";
import connectCloudinary from "./configs/cloudinary.js";
import productRouter from "./routes/product.route.js";
import cartRouter from "./routes/cart.route.js";
import addressRouter from "./routes/address.route.js";
import orderRouter from "./routes/order.route.js";

const app = express();
const port = process.env.PORT || 4000;

await connectDB();
await connectCloudinary();

// Allowed Origins
const allowedOrigins = [process.env.FRONTEND_URL, "http://localhost:5173"];

// ✅ Removed: Stripe webhook route
// app.post('/stripe', express.raw({ type: "application/json" }), stripeWebhooks)
// Razorpay does NOT need a raw body webhook route
// Verification is handled directly in /api/order/verify-razorpay

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({ origin: allowedOrigins, credentials: true }));

app.get("/", (req, res) => {
  res.send("Backend is running");
});

app.use("/api/user", userRouter);
app.use("/api/seller", sellerRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/address", addressRouter);
app.use("/api/order", orderRouter);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
