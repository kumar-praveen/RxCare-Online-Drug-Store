import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import User from "../models/user.model.js";
import Razorpay from "razorpay";
import crypto from "crypto";

// ── Razorpay Instance ────────────────────────────────────────────────────────
const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ── Helper: Calculate Amount ─────────────────────────────────────────────────
const calculateAmount = async (items) => {
  let amount = await items.reduce(async (acc, item) => {
    const product = await Product.findById(item.product);
    if (!product) throw new Error(`Product not found: ${item.product}`);
    return (await acc) + product.offerPrice * item.quantity;
  }, 0);
  // Add 2% tax
  amount += Math.floor(amount * 0.02);
  return amount;
};

// Place Order COD : /api/order/cod
export const placeOrderCOD = async (req, res) => {
  try {
    const { userId } = req;
    const { items, address } = req.body;

    if (!address) {
      return res.json({
        success: false,
        message: "Please add an address first",
      });
    }
    if (!items || items.length === 0) {
      return res.json({ success: false, message: "Cart is empty" });
    }

    const amount = await calculateAmount(items);

    await Order.create({
      userId,
      items,
      amount,
      address,
      paymentType: "COD",
    });

    // Clear cart
    await User.findByIdAndUpdate(userId, { cartItems: {} });

    return res.json({ success: true, message: "Order Placed Successfully" });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

// Create Razorpay Order : /api/order/razorpay
export const placeOrderRazorpay = async (req, res) => {
  try {
    const { userId } = req;
    const { items, address } = req.body;

    if (!address) {
      return res.json({
        success: false,
        message: "Please add an address first",
      });
    }
    if (!items || items.length === 0) {
      return res.json({ success: false, message: "Cart is empty" });
    }

    const amount = await calculateAmount(items);

    // Create order in DB first
    const order = await Order.create({
      userId,
      items,
      amount,
      address,
      paymentType: "Online",
    });

    // Create Razorpay order
    // Razorpay amount is in paise (1 INR = 100 paise)
    const razorpayOrder = await razorpayInstance.orders.create({
      amount: Math.floor(amount * 100),
      currency: "INR",
      receipt: order._id.toString(),
      notes: {
        orderId: order._id.toString(),
        userId: userId.toString(),
      },
    });

    return res.json({
      success: true,
      orderId: order._id,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

// Verify Razorpay Payment : /api/order/verify-razorpay
export const verifyRazorpayPayment = async (req, res) => {
  try {
    const { userId } = req;
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId,
    } = req.body;

    // ── Verify Signature ──────────────────────────────────────────────
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      // Signature mismatch — delete order
      await Order.findByIdAndDelete(orderId);
      return res.json({
        success: false,
        message: "Payment verification failed. Order cancelled.",
      });
    }

    // ── Payment Verified ──────────────────────────────────────────────
    await Order.findByIdAndUpdate(orderId, { isPaid: true });
    await User.findByIdAndUpdate(userId, { cartItems: {} });

    return res.json({
      success: true,
      message: "Payment verified successfully!",
    });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

// Get Orders by UserID : /api/order/user
export const getUserOrders = async (req, res) => {
  try {
    const { userId } = req;
    const orders = await Order.find({
      userId,
      $or: [{ paymentType: "COD" }, { isPaid: true }],
    })
      .populate("items.product address")
      .sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Get All Orders (seller) : /api/order/seller
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      $or: [{ paymentType: "COD" }, { isPaid: true }],
    })
      .populate("items.product address")
      .sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Update Order Status : /api/order/status
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    await Order.findByIdAndUpdate(orderId, { status });
    res.json({ success: true, message: "Order Status Updated" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Update Payment Status : /api/order/payment
export const updatePaymentStatus = async (req, res) => {
  try {
    const { orderId, isPaid } = req.body;
    await Order.findByIdAndUpdate(orderId, { isPaid });
    res.json({ success: true, message: "Payment Status Updated" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
