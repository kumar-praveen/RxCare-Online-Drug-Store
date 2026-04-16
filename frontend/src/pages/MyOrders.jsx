import React, { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import {
  ShoppingBag,
  MapPin,
  CreditCard,
  Calendar,
  Package,
  ChevronDown,
  ChevronUp,
  RefreshCw,
} from "lucide-react";

// ── Status Config ──────────────────────────────────────────────────────────
const statusConfig = {
  "Order Placed": {
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-200",
    dot: "bg-blue-500",
  },
  Processing: {
    color: "text-orange-600",
    bg: "bg-orange-50",
    border: "border-orange-200",
    dot: "bg-orange-500",
  },
  Shipped: {
    color: "text-purple-600",
    bg: "bg-purple-50",
    border: "border-purple-200",
    dot: "bg-purple-500",
  },
  Delivered: {
    color: "text-green-600",
    bg: "bg-green-50",
    border: "border-green-200",
    dot: "bg-green-500",
  },
  Cancelled: {
    color: "text-red-600",
    bg: "bg-red-50",
    border: "border-red-200",
    dot: "bg-red-500",
  },
};

const getStatusConfig = (status) =>
  statusConfig[status] || {
    color: "text-gray-600",
    bg: "bg-gray-50",
    border: "border-gray-200",
    dot: "bg-gray-400",
  };

// ── Order Card ─────────────────────────────────────────────────────────────
const OrderCard = ({ order }) => {
  const [expanded, setExpanded] = useState(true);
  const { navigate } = useAppContext();
  const status = getStatusConfig(order.status);

  const formattedDate = new Date(order.createdAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
      {/* ── Order Header ────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 bg-gray-50 border-b border-gray-100">
        {/* Left: Order ID + Date */}
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 text-primary" />
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
              Order ID
            </p>
          </div>
          <p className="text-sm font-bold text-gray-800 font-mono">
            #{order._id.slice(-10).toUpperCase()}
          </p>
        </div>

        {/* Center: Meta Info */}
        <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-gray-400" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CreditCard className="w-3.5 h-3.5 text-gray-400" />
            <span>{order.paymentType}</span>
            <span
              className={`px-1.5 py-0.5 rounded-full text-[10px] font-semibold ${
                order.isPaid
                  ? "bg-green-100 text-green-600"
                  : "bg-yellow-100 text-yellow-600"
              }`}
            >
              {order.isPaid ? "Paid" : "Pending"}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-gray-400" />
            <span>
              {order.address?.city}, {order.address?.state}
            </span>
          </div>
        </div>

        {/* Right: Status + Expand */}
        <div className="flex items-center gap-3">
          <span
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${status.bg} ${status.color} ${status.border}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
            {order.status}
          </span>
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-gray-400 hover:text-primary transition p-1"
          >
            {expanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* ── Order Items ─────────────────────────────────────────────── */}
      {expanded && (
        <div className="divide-y divide-gray-50">
          {order.items.map((item, index) => (
            <div
              key={index}
              className="flex flex-col sm:flex-row sm:items-center gap-4 px-5 py-4 hover:bg-gray-50/50 transition"
            >
              {/* Product Image */}
              <div
                onClick={() => {
                  navigate(
                    `/products/${item.product.category.toLowerCase()}/${item.product._id}`,
                  );
                  scrollTo(0, 0);
                }}
                className="w-16 h-16 shrink-0 bg-primary/5 border border-primary/10 rounded-xl flex items-center justify-center cursor-pointer hover:border-primary/30 transition"
              >
                <img
                  src={item.product.image[0]}
                  alt={item.product.name}
                  className="w-12 h-12 object-contain"
                />
              </div>

              {/* Product Info */}
              <div className="flex-1 min-w-0">
                <p
                  onClick={() => {
                    navigate(
                      `/products/${item.product.category.toLowerCase()}/${item.product._id}`,
                    );
                    scrollTo(0, 0);
                  }}
                  className="text-sm font-semibold text-gray-800 cursor-pointer hover:text-primary transition truncate"
                >
                  {item.product.name}
                </p>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
                  <span className="text-[10px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full uppercase tracking-wide">
                    {item.product.category}
                  </span>
                  <span className="text-xs text-gray-400">
                    Qty: {item.quantity}
                  </span>
                  <span className="text-xs text-gray-400">
                    ₹{item.product.offerPrice} / unit
                  </span>
                </div>
              </div>

              {/* Item Total */}
              <div className="text-right shrink-0">
                <p className="text-base font-bold text-gray-800">
                  ₹{item.product.offerPrice * item.quantity}
                </p>
                <p className="text-xs text-gray-400 line-through">
                  ₹{item.product.price * item.quantity}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Order Footer ────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-5 py-4 border-t border-gray-100 bg-gray-50/50">
        {/* Address */}
        <div className="flex items-start gap-2 text-xs text-gray-500 max-w-sm">
          <MapPin className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
          <p>
            {order.address?.firstName} {order.address?.lastName},{" "}
            {order.address?.street}, {order.address?.city},{" "}
            {order.address?.state} - {order.address?.zipcode}
          </p>
        </div>

        {/* Total Amount */}
        <div className="text-right">
          <p className="text-xs text-gray-400">Order Total</p>
          <p className="text-lg font-bold text-primary">₹{order.amount}</p>
        </div>
      </div>
    </div>
  );
};

// ── Main Component ─────────────────────────────────────────────────────────
const MyOrders = () => {
  const [myOrders, setMyOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { axios, user, navigate } = useAppContext();

  const fetchMyOrders = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/order/user");
      if (data.success) {
        setMyOrders(data.orders);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchMyOrders();
  }, [user]);

  // ── Loading ──────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="mt-10 pb-16">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            My Orders
          </h1>
        </div>
        <div className="flex flex-col gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden animate-pulse"
            >
              <div className="h-16 bg-gray-100" />
              <div className="p-5 flex gap-4">
                <div className="w-16 h-16 bg-gray-100 rounded-xl" />
                <div className="flex-1 flex flex-col gap-2">
                  <div className="h-4 bg-gray-100 rounded w-1/2" />
                  <div className="h-3 bg-gray-100 rounded w-1/3" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── Empty State ──────────────────────────────────────────────────────────
  if (myOrders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="bg-primary/10 p-6 rounded-full">
          <ShoppingBag className="w-14 h-14 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-gray-700">No orders yet</h2>
        <p className="text-gray-400 text-sm text-center max-w-xs">
          You haven't placed any orders yet. Browse our medicines and place your
          first order!
        </p>
        <button
          onClick={() => {
            navigate("/products");
            scrollTo(0, 0);
          }}
          className="mt-2 px-8 py-3 bg-primary text-white rounded-full text-sm font-medium hover:bg-primary-dull transition"
        >
          Browse Products
        </button>
      </div>
    );
  }

  // ── Orders List ──────────────────────────────────────────────────────────
  return (
    <div className="mt-10 pb-16">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            My Orders
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {myOrders.length} order{myOrders.length !== 1 ? "s" : ""} placed
          </p>
        </div>
        <button
          onClick={fetchMyOrders}
          className="flex items-center gap-2 text-sm text-primary border border-primary px-4 py-2 rounded-full hover:bg-primary/5 transition"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Refresh
        </button>
      </div>

      {/* Orders */}
      <div className="flex flex-col gap-5">
        {myOrders.map((order, index) => (
          <OrderCard key={index} order={order} />
        ))}
      </div>
    </div>
  );
};

export default MyOrders;
