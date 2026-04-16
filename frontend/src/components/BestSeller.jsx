import React from "react";
import ProductCard from "./ProductCard";
import { useAppContext } from "../context/AppContext";
import { Link } from "react-router-dom";

const BestSeller = () => {
  const { products } = useAppContext();

  // Only show in-stock products
  const bestSellers = products.filter((p) => p.inStock).slice(0, 5);

  return (
    <div className="pt-16">
      <div className="flex items-end justify-between gap-2 mb-6">
        <div>
          <p className="text-2xl md:text-3xl font-semibold">Best Sellers</p>
          <p className="text-gray-500 text-sm mt-1">
            Most loved products by our customers
          </p>
        </div>
        <Link
          to="/products"
          className="text-sm text-primary font-medium hover:underline whitespace-nowrap"
        >
          View All →
        </Link>
      </div>

      {bestSellers.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {bestSellers.map((prod, index) => (
            <ProductCard key={index} product={prod} />
          ))}
        </div>
      ) : (
        <p className="text-gray-400 text-sm">No products available.</p>
      )}
    </div>
  );
};

export default BestSeller;
