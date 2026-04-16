import React from "react";
import { useAppContext } from "../context/AppContext";
import { useParams, Link } from "react-router-dom";
import categories from "../assets/categories";
import ProductCard from "../components/ProductCard";
import { ChevronRight } from "lucide-react";

const ProductCategory = () => {
  const { products } = useAppContext();
  const { category } = useParams();

  const searchCategory = categories.find(
    (item) => item.path.toLowerCase() === category,
  );

  const filteredProducts = products.filter(
    (product) => product.category.toLowerCase() === category,
  );

  const inStockCount = filteredProducts.filter((p) => p.inStock).length;

  return (
    <div className="mt-10 pb-16">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-sm text-gray-400 mb-6">
        <Link to="/" className="hover:text-primary transition">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to="/products" className="hover:text-primary transition">
          Products
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-primary font-medium">
          {searchCategory?.categoryName || category}
        </span>
      </div>

      {/* Category Header */}
      {searchCategory && (
        <div className="flex items-center gap-5 bg-primary/5 border border-primary/10 rounded-2xl p-5 mb-8">
          <img
            src={searchCategory.categoryImageUrl}
            alt={searchCategory.categoryName}
            className="w-16 h-16 object-contain rounded-xl bg-white p-2 shadow-sm"
          />
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {searchCategory.categoryName}
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {filteredProducts.length} product
              {filteredProducts.length !== 1 ? "s" : ""} available
              <span className="mx-2 text-gray-300">•</span>
              <span className="text-green-500 font-medium">
                {inStockCount} in stock
              </span>
            </p>
          </div>
        </div>
      )}

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-[50vh] gap-3">
          <p className="text-gray-400 font-medium text-lg">
            No products found in this category
          </p>
          <Link
            to="/products"
            className="text-sm text-primary border border-primary px-6 py-2 rounded-full hover:bg-primary hover:text-white transition"
          >
            Browse All Products
          </Link>
        </div>
      )}
    </div>
  );
};

export default ProductCategory;
