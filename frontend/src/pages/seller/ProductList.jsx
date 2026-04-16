import React from "react";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
import { PackageX, CheckCircle, XCircle } from "lucide-react";

const ProductList = () => {
  const { products, axios, fetchProducts } = useAppContext();

  const toggleStock = async (id, inStock) => {
    try {
      const { data } = await axios.post("/api/product/stock", { id, inStock });
      if (data.success) {
        fetchProducts();
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="p-6 md:p-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Product List</h1>
        <p className="text-gray-400 text-sm mt-1">
          {products.length} product{products.length !== 1 ? "s" : ""} listed •{" "}
          <span className="text-green-500 font-medium">
            {products.filter((p) => p.inStock).length} in stock
          </span>{" "}
          •{" "}
          <span className="text-red-400 font-medium">
            {products.filter((p) => !p.inStock).length} out of stock
          </span>
        </p>
      </div>

      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-60 gap-3 bg-white rounded-2xl border border-gray-100">
          <PackageX className="w-12 h-12 text-gray-300" />
          <p className="text-gray-400 font-medium">No products added yet</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-5 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Product
                </th>
                <th className="text-left px-5 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden sm:table-cell">
                  Category
                </th>
                <th className="text-left px-5 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">
                  MRP
                </th>
                <th className="text-left px-5 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">
                  Offer Price
                </th>
                <th className="text-left px-5 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden lg:table-cell">
                  Discount
                </th>
                <th className="text-center px-5 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  In Stock
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {products.map((product) => {
                const discount = Math.round(
                  ((product.price - product.offerPrice) / product.price) * 100,
                );
                return (
                  <tr
                    key={product._id}
                    className="hover:bg-gray-50/50 transition"
                  >
                    {/* Product */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0 overflow-hidden">
                          <img
                            src={product.image[0]}
                            alt={product.name}
                            className="w-10 h-10 object-contain"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-800 truncate max-w-[160px]">
                            {product.name}
                          </p>
                          <p className="text-xs text-gray-400 sm:hidden">
                            {product.category}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-5 py-4 hidden sm:table-cell">
                      <span className="text-xs font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                        {product.category}
                      </span>
                    </td>

                    {/* MRP */}
                    <td className="px-5 py-4 hidden md:table-cell">
                      <span className="text-gray-400 line-through text-sm">
                        ₹{product.price}
                      </span>
                    </td>

                    {/* Offer Price */}
                    <td className="px-5 py-4 hidden md:table-cell">
                      <span className="font-bold text-gray-800">
                        ₹{product.offerPrice}
                      </span>
                    </td>

                    {/* Discount */}
                    <td className="px-5 py-4 hidden lg:table-cell">
                      <span className="text-xs font-semibold text-green-600 bg-green-50 px-2.5 py-1 rounded-full border border-green-200">
                        {discount}% OFF
                      </span>
                    </td>

                    {/* Toggle */}
                    <td className="px-5 py-4 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={product.inStock}
                            onChange={() =>
                              toggleStock(product._id, !product.inStock)
                            }
                          />
                          <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-primary transition-colors duration-300" />
                          <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-300 peer-checked:translate-x-5" />
                        </label>
                        <span
                          className={`text-[10px] font-semibold flex items-center gap-0.5 ${
                            product.inStock ? "text-green-500" : "text-red-400"
                          }`}
                        >
                          {product.inStock ? (
                            <>
                              <CheckCircle className="w-3 h-3" /> In Stock
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3 h-3" /> Out of Stock
                            </>
                          )}
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ProductList;
