import React, { useState, useMemo } from "react";
import { useAppContext } from "../context/AppContext";
import ProductCard from "../components/ProductCard";
import categories from "../assets/categories";
import { SlidersHorizontal, X } from "lucide-react";

const SORT_OPTIONS = [
  { label: "Relevance", value: "default" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Biggest Discount", value: "discount" },
];

const AllProducts = () => {
  const { products, searchQuery } = useAppContext();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("default");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    let result = [...products];

    // Search
    if (searchQuery) {
      result = result.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    // Category
    if (selectedCategory !== "All") {
      result = result.filter(
        (p) => p.category.toLowerCase() === selectedCategory.toLowerCase(),
      );
    }

    // In Stock
    if (inStockOnly) {
      result = result.filter((p) => p.inStock);
    }

    // Sort
    if (sortBy === "price_asc")
      result.sort((a, b) => a.offerPrice - b.offerPrice);
    else if (sortBy === "price_desc")
      result.sort((a, b) => b.offerPrice - a.offerPrice);
    else if (sortBy === "discount")
      result.sort(
        (a, b) =>
          (b.price - b.offerPrice) / b.price -
          (a.price - a.offerPrice) / a.price,
      );

    return result;
  }, [products, searchQuery, selectedCategory, sortBy, inStockOnly]);

  const FilterPanel = () => (
    <div className="flex flex-col gap-6">
      {/* In Stock Toggle */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
          Availability
        </h3>
        <label className="flex items-center gap-2 cursor-pointer">
          <div
            onClick={() => setInStockOnly(!inStockOnly)}
            className={`w-10 h-5 rounded-full relative transition-colors duration-300 ${
              inStockOnly ? "bg-primary" : "bg-gray-200"
            }`}
          >
            <div
              className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all duration-300 ${
                inStockOnly ? "left-5" : "left-0.5"
              }`}
            />
          </div>
          <span className="text-sm text-gray-600">In Stock Only</span>
        </label>
      </div>

      {/* Categories */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
          Categories
        </h3>
        <div className="flex flex-col gap-1.5">
          <button
            onClick={() => setSelectedCategory("All")}
            className={`text-left text-sm px-3 py-2 rounded-lg transition-all ${
              selectedCategory === "All"
                ? "bg-primary text-white font-medium"
                : "text-gray-600 hover:bg-primary/5 hover:text-primary"
            }`}
          >
            All Categories
          </button>
          {categories.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedCategory(cat.path)}
              className={`text-left text-sm px-3 py-2 rounded-lg transition-all ${
                selectedCategory === cat.path
                  ? "bg-primary text-white font-medium"
                  : "text-gray-600 hover:bg-primary/5 hover:text-primary"
              }`}
            >
              {cat.categoryName}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="mt-10 pb-16">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          All Products
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          {filtered.length} product{filtered.length !== 1 ? "s" : ""} found
          {searchQuery && (
            <span className="text-primary font-medium">
              {" "}
              for "{searchQuery}"
            </span>
          )}
        </p>
      </div>

      {/* Top Bar */}
      <div className="flex items-center justify-between gap-4 mb-6">
        {/* Mobile Filter Toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 md:hidden text-sm border border-gray-300 px-4 py-2 rounded-lg hover:border-primary hover:text-primary transition"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters
        </button>

        {/* Sort */}
        <div className="flex items-center gap-2 ml-auto">
          <span className="text-sm text-gray-500 hidden sm:block">
            Sort by:
          </span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-sm border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-primary cursor-pointer bg-white"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {showFilters && (
        <div className="md:hidden bg-white border border-gray-100 rounded-2xl shadow-md p-5 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-800">Filters</h2>
            <button onClick={() => setShowFilters(false)}>
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          <FilterPanel />
        </div>
      )}

      <div className="flex gap-8">
        {/* Desktop Sidebar */}
        <aside className="hidden md:block w-56 shrink-0">
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 sticky top-24">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold text-gray-800">Filters</h2>
              {(selectedCategory !== "All" || inStockOnly) && (
                <button
                  onClick={() => {
                    setSelectedCategory("All");
                    setInStockOnly(false);
                  }}
                  className="text-xs text-primary hover:underline"
                >
                  Clear all
                </button>
              )}
            </div>
            <FilterPanel />
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          {filtered.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filtered.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-[50vh] gap-3">
              <img
                src="/empty.svg"
                alt="No products"
                className="w-32 opacity-40"
                onError={(e) => (e.target.style.display = "none")}
              />
              <p className="text-gray-400 font-medium text-lg">
                No products found
              </p>
              <button
                onClick={() => {
                  setSelectedCategory("All");
                  setInStockOnly(false);
                  setSortBy("default");
                }}
                className="text-sm text-primary hover:underline"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllProducts;
