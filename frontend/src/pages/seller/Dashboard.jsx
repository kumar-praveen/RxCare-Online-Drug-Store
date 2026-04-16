import React, { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import {
  ShoppingBag,
  Package,
  TrendingUp,
  DollarSign,
  CheckCircle,
  Clock,
  Truck,
  XCircle,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { products, axios } = useAppContext();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get("/api/order/seller");
      if (data.success) setOrders(data.orders);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // ── Computed Stats ─────────────────────────────────────────────────────
  const totalRevenue = orders.reduce((acc, o) => acc + o.amount, 0);
  const totalOrders = orders.length;
  const inStockProducts = products.filter((p) => p.inStock).length;
  const outOfStockProducts = products.filter((p) => !p.inStock).length;

  const statusCounts = {
    "Order Placed": orders.filter((o) => o.status === "Order Placed").length,
    Processing: orders.filter((o) => o.status === "Processing").length,
    Shipped: orders.filter((o) => o.status === "Shipped").length,
    Delivered: orders.filter((o) => o.status === "Delivered").length,
    Cancelled: orders.filter((o) => o.status === "Cancelled").length,
  };

  const paidOrders = orders.filter((o) => o.isPaid).length;
  const pendingPayments = orders.filter((o) => !o.isPaid).length;

  const stats = [
    {
      label: "Total Revenue",
      value: `₹${totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: "text-green-600",
      bg: "bg-green-50",
      border: "border-green-100",
      sub: `${paidOrders} paid orders`,
    },
    {
      label: "Total Orders",
      value: totalOrders,
      icon: ShoppingBag,
      color: "text-blue-600",
      bg: "bg-blue-50",
      border: "border-blue-100",
      sub: `${pendingPayments} payment pending`,
    },
    {
      label: "Total Products",
      value: products.length,
      icon: Package,
      color: "text-purple-600",
      bg: "bg-purple-50",
      border: "border-purple-100",
      sub: `${outOfStockProducts} out of stock`,
    },
    {
      label: "Delivered Orders",
      value: statusCounts["Delivered"],
      icon: TrendingUp,
      color: "text-primary",
      bg: "bg-primary/10",
      border: "border-primary/10",
      sub: `${statusCounts["Cancelled"]} cancelled`,
    },
  ];

  const orderStatusCards = [
    {
      label: "Order Placed",
      count: statusCounts["Order Placed"],
      icon: Clock,
      color: "text-blue-500",
      bg: "bg-blue-50",
    },
    {
      label: "Processing",
      count: statusCounts["Processing"],
      icon: Package,
      color: "text-orange-500",
      bg: "bg-orange-50",
    },
    {
      label: "Shipped",
      count: statusCounts["Shipped"],
      icon: Truck,
      color: "text-purple-500",
      bg: "bg-purple-50",
    },
    {
      label: "Delivered",
      count: statusCounts["Delivered"],
      icon: CheckCircle,
      color: "text-green-500",
      bg: "bg-green-50",
    },
    {
      label: "Cancelled",
      count: statusCounts["Cancelled"],
      icon: XCircle,
      color: "text-red-500",
      bg: "bg-red-50",
    },
  ];

  if (loading) {
    return (
      <div className="p-6 md:p-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-gray-100 p-6 animate-pulse h-32"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-400 text-sm mt-1">
          Welcome back, Admin! Here's what's happening today.
        </p>
      </div>

      {/* ── Stat Cards ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className={`bg-white rounded-2xl border ${stat.border} shadow-sm p-5 flex flex-col gap-3`}
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
              <div className={`${stat.bg} p-2 rounded-xl`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
            </div>
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-xs text-gray-400">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* ── Order Status Breakdown ───────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-8">
        <h2 className="text-base font-bold text-gray-800 mb-5">
          Order Status Breakdown
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {orderStatusCards.map((item, idx) => (
            <div
              key={idx}
              className={`${item.bg} rounded-2xl p-4 flex flex-col items-center gap-2 text-center`}
            >
              <item.icon className={`w-6 h-6 ${item.color}`} />
              <p className={`text-2xl font-bold ${item.color}`}>{item.count}</p>
              <p className="text-xs text-gray-500 font-medium">{item.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ── Recent Orders ──────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-bold text-gray-800">Recent Orders</h2>
            <button
              onClick={() => navigate("/seller/orders")}
              className="flex items-center gap-1 text-xs text-primary hover:underline font-medium"
            >
              View All <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="flex flex-col gap-3">
            {orders.slice(0, 5).map((order, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"
              >
                <div>
                  <p className="text-xs font-bold text-gray-700 font-mono">
                    #{order._id.slice(-8).toUpperCase()}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {order.items.length} item
                    {order.items.length !== 1 ? "s" : ""} •{" "}
                    {new Date(order.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-800">
                    ₹{order.amount}
                  </p>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      order.status === "Delivered"
                        ? "bg-green-50 text-green-600"
                        : order.status === "Cancelled"
                          ? "bg-red-50 text-red-500"
                          : "bg-blue-50 text-blue-600"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
            {orders.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-4">
                No orders yet
              </p>
            )}
          </div>
        </div>

        {/* ── Product Stock Overview ──────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-bold text-gray-800">
              Stock Overview
            </h2>
            <button
              onClick={() => navigate("/seller/product-list")}
              className="flex items-center gap-1 text-xs text-primary hover:underline font-medium"
            >
              Manage <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* Stock Bar */}
          <div className="mb-4">
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>In Stock ({inStockProducts})</span>
              <span>Out of Stock ({outOfStockProducts})</span>
            </div>
            <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all"
                style={{
                  width: `${
                    products.length > 0
                      ? (inStockProducts / products.length) * 100
                      : 0
                  }%`,
                }}
              />
            </div>
          </div>

          {/* Out of Stock Products */}
          <div className="flex flex-col gap-3 mt-4">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Out of Stock Products
            </p>
            {products.filter((p) => !p.inStock).length === 0 ? (
              <div className="flex items-center gap-2 text-sm text-green-500 font-medium bg-green-50 px-3 py-2 rounded-xl">
                <CheckCircle className="w-4 h-4" />
                All products are in stock!
              </div>
            ) : (
              products
                .filter((p) => !p.inStock)
                .slice(0, 4)
                .map((product, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0"
                  >
                    <div className="w-9 h-9 bg-gray-50 rounded-lg border border-gray-100 flex items-center justify-center shrink-0">
                      <img
                        src={product.image[0]}
                        alt={product.name}
                        className="w-7 h-7 object-contain"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-700 truncate">
                        {product.name}
                      </p>
                      <p className="text-[10px] text-gray-400">
                        {product.category}
                      </p>
                    </div>
                    <span className="text-[10px] font-semibold text-red-500 bg-red-50 px-2 py-0.5 rounded-full border border-red-200 shrink-0">
                      Out of Stock
                    </span>
                  </div>
                ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
