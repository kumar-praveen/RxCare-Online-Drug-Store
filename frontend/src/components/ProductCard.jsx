import React from "react";
import { useAppContext } from "../context/AppContext";

const ProductCard = ({ product }) => {
  const { addToCart, removeFromCart, cartItems, navigate } = useAppContext();

  return (
    product && (
      <div
        onClick={() => {
          navigate(
            `/products/${product.category.toLowerCase()}/${product._id}`,
          );
          scrollTo(0, 0);
        }}
        className="border border-gray-500/20 rounded-md md:px-4 px-3 py-2 bg-white min-w-56 max-w-56 w-full"
      >
        <div className="group cursor-pointer flex items-center justify-center px-2">
          <img
            className="group-hover:scale-105 transition max-w-26 md:max-w-36"
            src={product.image[0]}
            alt={product.name}
          />
        </div>
        <div className="text-gray-500/60 text-sm">
          <p>{product.category}</p>
          <p className="text-gray-700 font-medium text-lg truncate w-full">
            {product.name}
          </p>
          <div className="flex items-center gap-0.5">
            {Array(5)
              .fill("")
              .map((_, i) => (
                <img
                  key={i}
                  src={i < 4 ? "/star_icon.svg" : "/star_dull_icon.svg"}
                  className="md:wd-4 w-3.5"
                />
              ))}
            <p className="text-base ml-2">(4)</p>
          </div>
            {product.inStock === false && <p className="text-base text-red-600 text-nowrap">Out of stock</p>}
          <div className="flex items-end justify-between mt-3">
            <p className="md:text-xl text-base font-medium text-primary-dull">
              &#8377;{product.offerPrice}{" "}
              <span className="text-gray-500/60 md:text-sm text-xs line-through">
                &#8377;{product.price}
              </span>
            </p>
            <div
              onClick={(e) => e.stopPropagation()}
              className="text-primary-dull"
            >
              {!cartItems[product._id] ? (
                <button
                  className="flex items-center justify-center gap-1 bg-primary/10 border border-primary/30 md:w-20 w-16 h-8.5 rounded text-primary font-medium cursor-pointer"
                  onClick={() => addToCart(product._id)}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M.583.583h2.333l1.564 7.81a1.17 1.17 0 0 0 1.166.94h5.67a1.17 1.17 0 0 0 1.167-.94l.933-4.893H3.5m2.333 8.75a.583.583 0 1 1-1.167 0 .583.583 0 0 1 1.167 0m6.417 0a.583.583 0 1 1-1.167 0 .583.583 0 0 1 1.167 0"
                      stroke="#4fbf8b"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Add
                </button>
              ) : (
                <div className="flex items-center justify-center gap-2 md:w-20 w-16 h-8.5 bg-primary-dull/25 rounded select-none">
                  <button
                    onClick={() => removeFromCart(product._id)}
                    className="cursor-pointer text-md px-2 h-full"
                  >
                    -
                  </button>
                  <span className="w-5 text-center">
                    {cartItems[product._id]}
                  </span>
                  <button
                    onClick={() => addToCart(product._id)}
                    className="cursor-pointer text-md px-2 h-full"
                  >
                    +
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default ProductCard;
