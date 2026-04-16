import React from "react";
import { useAppContext } from "../context/AppContext";
import categories from "../assets/categories";

const Categories = () => {
  const { navigate } = useAppContext();

  return (
    <div className="pt-16">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-2 mb-6">
        <div>
          <p className="text-2xl md:text-3xl font-semibold">Shop by Category</p>
          <p className="text-gray-500 text-sm mt-1">
            Find medicines and healthcare products by category
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-4">
        {categories.map((cat, idx) => (
          <div
            onClick={() => {
              navigate(`/products/${cat.path}`);
              scrollTo(0, 0);
            }}
            key={idx}
            className="group cursor-pointer p-3 gap-2 rounded-xl overflow-hidden flex flex-col justify-center items-center hover:shadow-md transition-all duration-200"
            style={{ backgroundColor: cat.bgColor }}
          >
            <img
              src={cat.categoryImageUrl}
              alt={cat.categoryName}
              className="rounded-lg w-full object-contain group-hover:scale-105 transition-transform duration-200"
            />
            <p className="text-xs font-semibold text-center text-gray-700 mt-1">
              {cat.categoryName}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;
