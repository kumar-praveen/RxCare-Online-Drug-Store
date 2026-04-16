import React from "react";
import { useAppContext } from "../context/AppContext";
import { ShoppingCart, Star } from "lucide-react";

const ProductCard = ({ product }) => {
  const { addToCart, removeFromCart, cartItems, navigate } = useAppContext();

  if (!product) return null;

  const discount = Math.round(
    ((product.price - product.offerPrice) / product.price) * 100,
  );

  return (
    <div
      onClick={() => {
        navigate(`/products/${product.category.toLowerCase()}/${product._id}`);
        scrollTo(0, 0);
      }}
      className="group relative border border-gray-100 rounded-2xl bg-white shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col overflow-hidden"
    >
      {/* Discount Badge */}
      {discount > 0 && (
        <div className="absolute top-2 left-2 z-10 bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
          {discount}% OFF
        </div>
      )}

      {/* Out of Stock Badge */}
      {!product.inStock && (
        <div className="absolute inset-0 bg-white/70 z-10 flex items-center justify-center rounded-2xl">
          <span className="bg-red-100 text-red-500 text-xs font-semibold px-3 py-1 rounded-full border border-red-200">
            Out of Stock
          </span>
        </div>
      )}

      {/* Image */}
      <div className="bg-gray-50 rounded-t-2xl flex items-center justify-center px-4 pt-5 pb-3 h-40 overflow-hidden">
        <img
          src={product.image[0]}
          alt={product.name}
          className="h-full object-contain group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Content */}
      <div className="p-3 flex flex-col flex-1">
        {/* Category */}
        <span className="text-[10px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full w-fit mb-1.5 uppercase tracking-wide">
          {product.category}
        </span>

        {/* Name */}
        <p className="text-gray-800 font-semibold text-sm leading-snug line-clamp-2 mb-1.5">
          {product.name}
        </p>

        {/* Star Rating */}
        <div className="flex items-center gap-0.5 mb-2">
          {Array(5)
            .fill("")
            .map((_, i) => (
              <Star
                key={i}
                className={`w-3 h-3 ${
                  i < 4
                    ? "fill-yellow-400 text-yellow-400"
                    : "fill-gray-200 text-gray-200"
                }`}
              />
            ))}
          <span className="text-[11px] text-gray-400 ml-1">(4)</span>
        </div>

        {/* Price & Cart */}
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-100">
          {/* Price */}
          <div>
            <p className="text-base font-bold text-gray-800">
              ₹{product.offerPrice}
            </p>
            <p className="text-[11px] text-gray-400 line-through">
              ₹{product.price}
            </p>
          </div>

          {/* Cart Button */}
          <div onClick={(e) => e.stopPropagation()}>
            {!cartItems[product._id] ? (
              <button
                disabled={!product.inStock}
                onClick={() => addToCart(product._id)}
                className="flex items-center gap-1.5 bg-primary/10 hover:bg-primary hover:text-white text-primary border border-primary/30 px-3 h-8 rounded-lg text-xs font-semibold transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                Add
              </button>
            ) : (
              <div className="flex items-center gap-1 bg-primary text-white rounded-lg h-8 px-1 select-none">
                <button
                  onClick={() => removeFromCart(product._id)}
                  className="w-6 h-full flex items-center justify-center text-base font-bold hover:bg-primary-dull rounded transition"
                >
                  −
                </button>
                <span className="w-5 text-center text-xs font-bold">
                  {cartItems[product._id]}
                </span>
                <button
                  onClick={() => addToCart(product._id)}
                  className="w-6 h-full flex items-center justify-center text-base font-bold hover:bg-primary-dull rounded transition"
                >
                  +
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
