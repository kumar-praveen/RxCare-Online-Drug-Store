import React from "react";
import ProductCard from "./ProductCard";
import { useAppContext } from "../context/AppContext";

const BestSeller = () => {
  const { products } = useAppContext();
  return (
    <div className="pt-16">
      <p className="text-2xl md:text-3xl font-medium">Best Seller</p>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 items-center lg:grid-cols-5 my-6">
        {products
          .slice(0, 5)
          .map((prod, index) => (
            <ProductCard key={index} product={prod} />
          ))}
      </div>
    </div>
  );
};

export default BestSeller;
