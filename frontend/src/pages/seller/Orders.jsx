import React, { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
import {
  ShoppingBag,
  MapPin,
  Phone,
  CreditCard,
  Calendar,
  RefreshCw,
  Package,
  ChevronDown,
  BadgeCheck,
  Clock,
} from "lucide-react";

const STATUS_OPTIONS = [
  "Order Placed",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
];

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

const getStatus = (status) =>
  statusConfig[status] || {
    color: "text-gray-600",
    bg: "bg-gray-50",
    border: "border-gray-200",
    dot: "bg-gray-400",
  };

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingStatusId, setUpdatingStatusId] = useState(null);
  const [updatingPaymentId, setUpdatingPaymentId] = useState(null);
  const { axios } = useAppContext();

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/order/seller");
      if (data.success) {
        setOrders(data.orders);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // ── Update Order Status ──────────────────────────────────────────────────
  const updateStatus = async (orderId, status) => {
    try {
      setUpdatingStatusId(orderId);
      const { data } = await axios.post("/api/order/status", {
        orderId,
        status,
      });
      if (data.success) {
        toast.success(`Status updated to "${status}"`);
        setOrders((prev) =>
          prev.map((o) => (o._id === orderId ? { ...o, status } : o)),
        );
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setUpdatingStatusId(null);
    }
  };

  // ── Update Payment Status (COD only) ────────────────────────────────────
  const updatePayment = async (orderId, isPaid) => {
    try {
      setUpdatingPaymentId(orderId);
      const { data } = await axios.post("/api/order/payment", {
        orderId,
        isPaid,
      });
      if (data.success) {
        toast.success(
          isPaid ? "Payment marked as Paid ✅" : "Payment marked as Pending",
        );
        setOrders((prev) =>
          prev.map((o) => (o._id === orderId ? { ...o, isPaid } : o)),
        );
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setUpdatingPaymentId(null);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // ── Loading Skeleton ─────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="p-6 md:p-10">
        <div className="mb-8">
          <div className="h-7 w-40 bg-gray-100 rounded-lg animate-pulse" />
          <div className="h-4 w-24 bg-gray-100 rounded mt-2 animate-pulse" />
        </div>
        <div className="flex flex-col gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-gray-100 p-6 animate-pulse"
            >
              <div className="h-4 w-1/3 bg-gray-100 rounded mb-4" />
              <div className="flex gap-4">
                <div className="w-14 h-14 bg-gray-100 rounded-xl" />
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
  if (orders.length === 0) {
    return (
      <div className="p-6 md:p-10">
        <h1 className="text-2xl font-bold text-gray-800 mb-8">Orders</h1>
        <div className="flex flex-col items-center justify-center h-60 bg-white rounded-2xl border border-gray-100 gap-3">
          <ShoppingBag className="w-12 h-12 text-gray-300" />
          <p className="text-gray-400 font-medium">No orders received yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Orders</h1>
          <p className="text-gray-400 text-sm mt-1">
            {orders.length} order{orders.length !== 1 ? "s" : ""} received
          </p>
        </div>
        <button
          onClick={fetchOrders}
          className="flex items-center gap-2 text-sm text-primary border border-primary px-4 py-2 rounded-full hover:bg-primary/5 transition"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Refresh
        </button>
      </div>

      {/* Orders */}
      <div className="flex flex-col gap-5">
        {orders.map((order, index) => {
          const status = getStatus(order.status);
          const isStatusUpdating = updatingStatusId === order._id;
          const isPaymentUpdating = updatingPaymentId === order._id;
          const isCOD = order.paymentType === "COD";

          return (
            <div
              key={index}
              className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden"
            >
              {/* ── Order Header ─────────────────────────────────────── */}
              <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 bg-gray-50 border-b border-gray-100">
                {/* Order ID */}
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-primary" />
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    Order ID
                  </p>
                  <p className="text-sm font-bold text-gray-800 font-mono">
                    #{order._id.slice(-10).toUpperCase()}
                  </p>
                </div>

                {/* Meta */}
                <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(order.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5" />
                    {order.paymentType}
                  </div>

                  {/* Payment Badge */}
                  <span
                    className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full font-semibold border text-[11px] ${
                      order.isPaid
                        ? "bg-green-50 text-green-600 border-green-200"
                        : "bg-yellow-50 text-yellow-600 border-yellow-200"
                    }`}
                  >
                    {order.isPaid ? (
                      <>
                        <BadgeCheck className="w-3 h-3" /> Paid
                      </>
                    ) : (
                      <>
                        <Clock className="w-3 h-3" /> Pending
                      </>
                    )}
                  </span>
                </div>

                {/* Status Badge */}
                <span
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${status.bg} ${status.color} ${status.border}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                  {order.status}
                </span>
              </div>

              <div className="flex flex-col lg:flex-row">
                {/* ── Items ────────────────────────────────────────── */}
                <div className="flex-1 divide-y divide-gray-50 border-b lg:border-b-0 lg:border-r border-gray-100">
                  {order.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-4 px-5 py-4"
                    >
                      <div className="w-12 h-12 shrink-0 bg-primary/5 border border-primary/10 rounded-xl flex items-center justify-center">
                        <img
                          src={item.product.image[0]}
                          alt={item.product.name}
                          className="w-9 h-9 object-contain"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-800 truncate">
                          {item.product.name}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full uppercase">
                            {item.product.category}
                          </span>
                          <span className="text-xs text-gray-400">
                            Qty: {item.quantity}
                          </span>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-bold text-gray-800">
                          ₹{item.product.offerPrice * item.quantity}
                        </p>
                        <p className="text-xs text-gray-400">
                          ₹{item.product.offerPrice} × {item.quantity}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* ── Right Panel ──────────────────────────────────── */}
                <div className="lg:w-72 shrink-0 px-5 py-4 flex flex-col gap-4">
                  {/* Address */}
                  <div>
                    <div className="flex items-center gap-1.5 mb-2">
                      <MapPin className="w-3.5 h-3.5 text-primary" />
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Delivery Address
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-gray-800">
                      {order.address.firstName} {order.address.lastName}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                      {order.address.street}, {order.address.city},{" "}
                      {order.address.state} - {order.address.zipcode},{" "}
                      {order.address.country}
                    </p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <Phone className="w-3 h-3 text-gray-400" />
                      <p className="text-xs text-gray-500">
                        {order.address.phone}
                      </p>
                    </div>
                  </div>

                  {/* ── Order Status Update ───────────────────────── */}
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                      Update Status
                    </p>
                    <div className="relative">
                      <select
                        value={order.status}
                        disabled={isStatusUpdating}
                        onChange={(e) =>
                          updateStatus(order._id, e.target.value)
                        }
                        className={`w-full appearance-none px-3 py-2.5 pr-8 border rounded-xl text-sm font-medium outline-none transition cursor-pointer
                          ${status.bg} ${status.color} ${status.border}
                          focus:ring-2 focus:ring-primary/20
                          disabled:opacity-60 disabled:cursor-not-allowed`}
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option
                            key={s}
                            value={s}
                            className="bg-white text-gray-700"
                          >
                            {s}
                          </option>
                        ))}
                      </select>
                      <ChevronDown
                        className={`absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none ${status.color}`}
                      />
                    </div>
                    {isStatusUpdating && (
                      <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                        <svg
                          className="animate-spin w-3 h-3"
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
                        Updating status...
                      </p>
                    )}
                  </div>

                  {/* ── Payment Status (COD only) ─────────────────── */}
                  {isCOD && (
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                        Payment Collection
                      </p>
                      <div
                        className={`flex items-center justify-between px-3 py-2.5 rounded-xl border ${
                          order.isPaid
                            ? "bg-green-50 border-green-200"
                            : "bg-yellow-50 border-yellow-200"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {order.isPaid ? (
                            <BadgeCheck className="w-4 h-4 text-green-500" />
                          ) : (
                            <Clock className="w-4 h-4 text-yellow-500" />
                          )}
                          <span
                            className={`text-xs font-semibold ${
                              order.isPaid
                                ? "text-green-600"
                                : "text-yellow-600"
                            }`}
                          >
                            {order.isPaid ? "Cash Collected" : "Cash Pending"}
                          </span>
                        </div>

                        {/* Toggle Switch */}
                        <button
                          disabled={isPaymentUpdating}
                          onClick={() =>
                            updatePayment(order._id, !order.isPaid)
                          }
                          className={`relative w-10 h-5 rounded-full transition-colors duration-300 focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed ${
                            order.isPaid ? "bg-green-500" : "bg-gray-300"
                          }`}
                        >
                          <span
                            className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-300 ${
                              order.isPaid ? "translate-x-5" : "translate-x-0"
                            }`}
                          />
                        </button>
                      </div>
                      {isPaymentUpdating && (
                        <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                          <svg
                            className="animate-spin w-3 h-3"
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
                          Updating payment...
                        </p>
                      )}
                    </div>
                  )}

                  {/* Online Payment Note */}
                  {!isCOD && (
                    <div className="flex items-start gap-2 bg-blue-50 border border-blue-100 rounded-xl px-3 py-2.5">
                      <BadgeCheck className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                      <p className="text-xs text-blue-600 font-medium">
                        Online payment is automatically verified via Stripe
                        webhook.
                      </p>
                    </div>
                  )}

                  {/* Total */}
                  <div className="bg-primary/5 rounded-xl px-4 py-3 flex items-center justify-between mt-auto">
                    <p className="text-xs text-gray-500 font-medium">
                      Order Total
                    </p>
                    <p className="text-lg font-bold text-primary">
                      ₹{order.amount}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Orders;
