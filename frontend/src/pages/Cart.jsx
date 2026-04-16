import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import toast, { LoaderIcon } from "react-hot-toast";
import {
  ShoppingCart,
  MapPin,
  CreditCard,
  ArrowLeft,
  Trash2,
  Plus,
  Minus,
  ShieldCheck,
  Truck,
  Tag,
} from "lucide-react";

const Cart = () => {
  const {
    products,
    cartItems,
    removeFromCart,
    getCartCount,
    getCartAmount,
    updateCartItem,
    axios,
    user,
    setCartItems,
    navigate,
  } = useAppContext();

  const [cartArray, setCartArray] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [showAddress, setShowAddress] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentOption, setPaymentOption] = useState("COD");
  const [loading, setLoading] = useState(false);

  const getCart = () => {
    const tempArray = [];
    for (const key in cartItems) {
      const product = products.find((item) => item._id === key);
      if (product) tempArray.push({ ...product, quantity: cartItems[key] });
    }
    setCartArray(tempArray);
  };

  const getUserAddress = async () => {
    try {
      const { data } = await axios.get("/api/address/get");
      if (data.success) {
        setAddresses(data.addresses);
        if (data.addresses.length > 0) setSelectedAddress(data.addresses[0]);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // ── Razorpay Payment Handler ─────────────────────────────────────────────
  const handleRazorpayPayment = async () => {
    try {
      // Step 1: Create order on backend
      const { data } = await axios.post("/api/order/razorpay", {
        items: cartArray.map((item) => ({
          product: item._id,
          quantity: item.quantity,
        })),
        address: selectedAddress._id,
      });

      if (!data.success) {
        toast.error(data.message);
        return;
      }

      // Step 2: Open Razorpay Checkout
      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: "RxCare",
        description: "Medicine & Healthcare Purchase",
        image: "/logo.png", // optional
        order_id: data.razorpayOrderId,
        handler: async (response) => {
          // Step 3: Verify payment on backend
          try {
            const { data: verifyData } = await axios.post(
              "/api/order/verify-razorpay",
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderId: data.orderId,
              },
            );

            if (verifyData.success) {
              toast.success("Payment successful! 🎉");
              setCartItems({});
              navigate("/my-orders");
            } else {
              toast.error(verifyData.message);
            }
          } catch (error) {
            toast.error("Payment verification failed");
          }
        },
        prefill: {
          name: user?.name || "",
          email: user?.email || "",
          contact: selectedAddress?.phone || "",
        },
        notes: {
          address: `${selectedAddress?.street}, ${selectedAddress?.city}`,
        },
        theme: {
          color: "#615fff", // primary color
        },
        modal: {
          ondismiss: () => {
            toast("Payment cancelled", { icon: "⚠️" });
            setLoading(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);

      // Handle payment failure
      rzp.on("payment.failed", (response) => {
        toast.error(`Payment failed: ${response.error.description}`);
        setLoading(false);
      });

      rzp.open();
    } catch (error) {
      toast.error(error.message);
    }
  };

  // ── Place Order ──────────────────────────────────────────────────────────
  const placeOrder = async () => {
    if (!user) {
      toast("Please login first", { icon: "⚠️" });
      return;
    }
    if (!selectedAddress) {
      toast.error("Please select a delivery address");
      return;
    }
    if (cartArray.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    try {
      setLoading(true);

      if (paymentOption === "COD") {
        const { data } = await axios.post("/api/order/cod", {
          items: cartArray.map((item) => ({
            product: item._id,
            quantity: item.quantity,
          })),
          address: selectedAddress._id,
        });

        if (data.success) {
          toast.success(data.message);
          setCartItems({});
          navigate("/my-orders");
        } else {
          toast.error(data.message);
        }
        setLoading(false);
      } else {
        // ✅ Razorpay — loading will be managed by modal
        await handleRazorpayPayment();
        // Note: don't setLoading(false) here
        // it's handled in modal dismiss and handler
      }
    } catch (error) {
      toast.error(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) getUserAddress();
  }, [user]);

  useEffect(() => {
    if (products.length > 0 && cartItems) getCart();
  }, [products, cartItems]);

  // ── Empty Cart ─────────────────────────────────────────────────────────────
  if (!products.length || !cartItems || getCartCount() === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="bg-primary/10 p-6 rounded-full">
          <ShoppingCart className="w-14 h-14 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-gray-700">Your cart is empty</h2>
        <p className="text-gray-400 text-sm">
          Add medicines and healthcare products to your cart
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

  const subtotal = getCartAmount();
  const tax = Math.round((subtotal * 2) / 100);
  const total = subtotal + tax;
  const savings = cartArray.reduce(
    (acc, item) => acc + (item.price - item.offerPrice) * item.quantity,
    0,
  );

  return (
    <div className="mt-10 pb-16">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          Shopping Cart
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          {getCartCount()} item{getCartCount() !== 1 ? "s" : ""} in your cart
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* ── Left: Cart Items ─────────────────────────────────────── */}
        <div className="flex-1">
          {savings > 0 && (
            <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-sm font-medium px-4 py-3 rounded-xl mb-5">
              <Tag className="w-4 h-4 shrink-0" />
              You're saving ₹{savings} on this order!
            </div>
          )}

          <div className="flex flex-col gap-4">
            {cartArray.map((product) => (
              <div
                key={product._id}
                className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex gap-4 items-start"
              >
                <div
                  onClick={() => {
                    navigate(
                      `/products/${product.category.toLowerCase()}/${product._id}`,
                    );
                    scrollTo(0, 0);
                  }}
                  className="w-20 h-20 md:w-24 md:h-24 shrink-0 bg-gray-50 border border-gray-100 rounded-xl overflow-hidden flex items-center justify-center cursor-pointer hover:border-primary/30 transition"
                >
                  <img
                    src={product.image[0]}
                    alt={product.name}
                    className="w-full h-full object-contain p-1"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full uppercase tracking-wide">
                        {product.category}
                      </span>
                      <p
                        onClick={() => {
                          navigate(
                            `/products/${product.category.toLowerCase()}/${product._id}`,
                          );
                          scrollTo(0, 0);
                        }}
                        className="font-semibold text-gray-800 mt-1 text-sm md:text-base cursor-pointer hover:text-primary transition line-clamp-2"
                      >
                        {product.name}
                      </p>
                    </div>
                    <button
                      onClick={() => removeFromCart(product._id)}
                      className="text-gray-300 hover:text-red-400 transition shrink-0 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-base font-bold text-gray-800">
                      ₹{product.offerPrice}
                    </span>
                    <span className="text-xs text-gray-400 line-through">
                      ₹{product.price}
                    </span>
                    <span className="text-xs text-green-500 font-semibold">
                      {Math.round(
                        ((product.price - product.offerPrice) / product.price) *
                          100,
                      )}
                      % off
                    </span>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-1 border border-gray-200 rounded-lg overflow-hidden">
                      <button
                        onClick={() =>
                          updateCartItem(
                            product._id,
                            Math.max(1, product.quantity - 1),
                          )
                        }
                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 transition text-gray-600"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-8 text-center text-sm font-semibold text-gray-800">
                        {product.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateCartItem(product._id, product.quantity + 1)
                        }
                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 transition text-gray-600"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <p className="text-sm font-bold text-gray-800">
                      ₹{product.offerPrice * product.quantity}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => {
              navigate("/products");
              scrollTo(0, 0);
            }}
            className="group flex items-center gap-2 mt-6 text-primary text-sm font-medium hover:gap-3 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Continue Shopping
          </button>
        </div>

        {/* ── Right: Order Summary ──────────────────────────────────── */}
        <div className="lg:w-96 shrink-0">
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 sticky top-24">
            <h2 className="text-lg font-bold text-gray-800 mb-5">
              Order Summary
            </h2>

            {/* Address */}
            <div className="mb-5">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-4 h-4 text-primary" />
                <p className="text-sm font-semibold text-gray-700">
                  Delivery Address
                </p>
              </div>
              <div className="relative">
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-3">
                  {selectedAddress ? (
                    <p className="text-xs text-gray-600 leading-relaxed">
                      <span className="font-semibold text-gray-800">
                        {selectedAddress.firstName} {selectedAddress.lastName}
                      </span>
                      <br />
                      {selectedAddress.street}, {selectedAddress.city},{" "}
                      {selectedAddress.state} - {selectedAddress.zipcode}
                      <br />
                      {selectedAddress.country} • 📞 {selectedAddress.phone}
                    </p>
                  ) : (
                    <p className="text-xs text-gray-400">No address selected</p>
                  )}
                </div>
                <button
                  onClick={() => setShowAddress(!showAddress)}
                  className="text-xs text-primary font-medium mt-1.5 hover:underline"
                >
                  {showAddress ? "Close" : "Change Address"}
                </button>

                {showAddress && (
                  <div className="absolute z-20 top-full mt-1 left-0 right-0 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                    {addresses.length > 0 ? (
                      addresses.map((address, index) => (
                        <div
                          key={index}
                          onClick={() => {
                            setSelectedAddress(address);
                            setShowAddress(false);
                          }}
                          className={`p-3 text-xs cursor-pointer hover:bg-primary/5 transition border-b border-gray-100 last:border-0 ${
                            selectedAddress?._id === address._id
                              ? "bg-primary/5 text-primary font-medium"
                              : "text-gray-600"
                          }`}
                        >
                          <p className="font-semibold text-gray-800">
                            {address.firstName} {address.lastName}
                          </p>
                          <p>
                            {address.street}, {address.city}, {address.state} -{" "}
                            {address.zipcode}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-gray-400 p-3 text-center">
                        No saved addresses
                      </p>
                    )}
                    <button
                      onClick={() => {
                        navigate("/add-address");
                        scrollTo(0, 0);
                      }}
                      className="w-full text-xs text-primary font-semibold p-3 hover:bg-primary/5 transition text-center border-t border-gray-100"
                    >
                      + Add New Address
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Payment Method */}
            <div className="mb-5">
              <div className="flex items-center gap-2 mb-2">
                <CreditCard className="w-4 h-4 text-primary" />
                <p className="text-sm font-semibold text-gray-700">
                  Payment Method
                </p>
              </div>
              <div className="flex gap-3">
                {["COD", "Online"].map((method) => (
                  <button
                    key={method}
                    onClick={() => setPaymentOption(method)}
                    className={`flex-1 py-2.5 text-xs font-semibold rounded-xl border-2 transition-all ${
                      paymentOption === method
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-gray-200 text-gray-500 hover:border-gray-300"
                    }`}
                  >
                    {method === "COD" ? "Cash on Delivery" : "Online Payment"}
                  </button>
                ))}
              </div>

              {/* Razorpay Badge */}
              {paymentOption === "Online" && (
                <div className="flex items-center gap-2 mt-3 bg-blue-50 border border-blue-100 rounded-xl px-3 py-2">
                  <img
                    src="https://razorpay.com/favicon.png"
                    alt="Razorpay"
                    className="w-4 h-4"
                  />
                  <p className="text-xs text-blue-600 font-medium">
                    Secured by Razorpay — UPI, Cards, NetBanking & more
                  </p>
                </div>
              )}
            </div>

            <hr className="border-gray-100 mb-4" />

            {/* Price Breakdown */}
            <div className="flex flex-col gap-2.5 text-sm">
              <div className="flex justify-between text-gray-500">
                <span>
                  Subtotal ({getCartCount()} item
                  {getCartCount() !== 1 ? "s" : ""})
                </span>
                <span>₹{subtotal}</span>
              </div>
              {savings > 0 && (
                <div className="flex justify-between text-green-500 font-medium">
                  <span>Savings</span>
                  <span>− ₹{savings}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-500">
                <span>Shipping</span>
                <span className="text-green-500 font-medium">FREE</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Tax (2%)</span>
                <span>₹{tax}</span>
              </div>
              <hr className="border-gray-100" />
              <div className="flex justify-between text-base font-bold text-gray-800">
                <span>Total</span>
                <span>₹{total}</span>
              </div>
            </div>

            {/* Place Order Button */}
            <button
              onClick={placeOrder}
              disabled={loading}
              className={`w-full mt-5 py-3.5 rounded-xl text-white font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                loading
                  ? "bg-primary/60 cursor-not-allowed"
                  : "bg-primary hover:bg-primary-dull cursor-pointer"
              }`}
            >
              {loading ? (
                <>
                  <LoaderIcon className="w-4 h-4 animate-spin" />
                  Processing...
                </>
              ) : paymentOption === "COD" ? (
                "Place Order"
              ) : (
                "Pay with Razorpay"
              )}
            </button>

            {/* Assurance */}
            <div className="flex flex-col gap-2 mt-5 pt-4 border-t border-gray-100">
              {[
                {
                  icon: ShieldCheck,
                  text: "100% Secure Payments",
                  color: "text-green-500",
                },
                {
                  icon: Truck,
                  text: "Free & Fast Delivery",
                  color: "text-blue-500",
                },
              ].map(({ icon: Icon, text, color }, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 text-xs text-gray-400"
                >
                  <Icon className={`w-3.5 h-3.5 ${color}`} />
                  {text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
