import React, { useState } from "react";
import categories from "../../assets/categories";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
import { Upload, Plus, Tag, FileText, Layers, DollarSign } from "lucide-react";

const AddProduct = () => {
  const [files, setFiles] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [offerPrice, setOfferPrice] = useState("");
  const [loading, setLoading] = useState(false);

  const { axios } = useAppContext();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const productData = {
        name,
        description: description.split("\n").filter((d) => d.trim() !== ""),
        category,
        price,
        offerPrice,
      };

      const formData = new FormData();
      formData.append("productData", JSON.stringify(productData));
      for (let i = 0; i < files.length; i++) {
        formData.append("images", files[i]);
      }

      const { data } = await axios.post("/api/product/add", formData);
      if (data.success) {
        toast.success(data.message);
        setName("");
        setDescription("");
        setCategory("");
        setPrice("");
        setOfferPrice("");
        setFiles([]);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const discount =
    price && offerPrice
      ? Math.round(((price - offerPrice) / price) * 100)
      : null;

  return (
    <div className="p-6 md:p-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Add New Product</h1>
        <p className="text-gray-400 text-sm mt-1">
          Fill in the details to list a new medicine or healthcare product
        </p>
      </div>

      <form onSubmit={onSubmitHandler} className="max-w-3xl">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8 flex flex-col gap-7">
          {/* Product Images */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Upload className="w-4 h-4 text-primary" />
              <label className="text-sm font-semibold text-gray-700">
                Product Images
              </label>
            </div>
            <p className="text-xs text-gray-400 mb-3">
              Upload up to 4 images. First image will be the thumbnail.
            </p>
            <div className="flex flex-wrap gap-3">
              {Array(4)
                .fill("")
                .map((_, index) => (
                  <label
                    key={index}
                    htmlFor={`image${index}`}
                    className={`relative w-24 h-24 rounded-xl border-2 border-dashed flex items-center justify-center cursor-pointer transition-all overflow-hidden
                      ${
                        files[index]
                          ? "border-primary"
                          : "border-gray-200 hover:border-primary/40 bg-gray-50"
                      }`}
                  >
                    <input
                      accept="image/*"
                      type="file"
                      id={`image${index}`}
                      hidden
                      onChange={(e) => {
                        const updatedFiles = [...files];
                        updatedFiles[index] = e.target.files[0];
                        setFiles(updatedFiles);
                      }}
                    />
                    {files[index] ? (
                      <>
                        <img
                          src={URL.createObjectURL(files[index])}
                          alt="preview"
                          className="w-full h-full object-cover"
                        />
                        {index === 0 && (
                          <span className="absolute bottom-0 left-0 right-0 text-[9px] text-center bg-primary text-white py-0.5 font-semibold">
                            THUMBNAIL
                          </span>
                        )}
                      </>
                    ) : (
                      <div className="flex flex-col items-center gap-1 text-gray-400">
                        <Plus className="w-5 h-5" />
                        <span className="text-[10px]">
                          {index === 0 ? "Main" : `Image ${index + 1}`}
                        </span>
                      </div>
                    )}
                  </label>
                ))}
            </div>
          </div>

          {/* Product Name */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-primary" />
              <label
                htmlFor="product-name"
                className="text-sm font-semibold text-gray-700"
              >
                Product Name
              </label>
            </div>
            <input
              id="product-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Paracetamol 500mg Tablets"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition"
              required
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary" />
              <label
                htmlFor="product-description"
                className="text-sm font-semibold text-gray-700"
              >
                Product Description
              </label>
            </div>
            <p className="text-xs text-gray-400 -mt-1">
              Each line will be shown as a separate bullet point
            </p>
            <textarea
              id="product-description"
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={
                "Used for fever and mild pain relief\nDosage: 1 tablet twice daily\nKeep out of reach of children"
              }
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition resize-none"
            />
          </div>

          {/* Category */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-primary" />
              <label
                htmlFor="category"
                className="text-sm font-semibold text-gray-700"
              >
                Category
              </label>
            </div>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition bg-white"
              required
            >
              <option value="">Select a category</option>
              {categories.map((item, index) => (
                <option key={index} value={item.path}>
                  {item.categoryName}
                </option>
              ))}
            </select>
          </div>

          {/* Pricing */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-primary" />
              <label className="text-sm font-semibold text-gray-700">
                Pricing
              </label>
            </div>
            <div className="flex gap-4 flex-wrap">
              {/* MRP */}
              <div className="flex-1 min-w-[140px]">
                <label className="text-xs text-gray-400 mb-1 block">
                  MRP (Original Price)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                    ₹
                  </span>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="0"
                    className="w-full pl-7 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition"
                    required
                    min={0}
                  />
                </div>
              </div>

              {/* Offer Price */}
              <div className="flex-1 min-w-[140px]">
                <label className="text-xs text-gray-400 mb-1 block">
                  Offer Price (Selling Price)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                    ₹
                  </span>
                  <input
                    type="number"
                    value={offerPrice}
                    onChange={(e) => setOfferPrice(e.target.value)}
                    placeholder="0"
                    className="w-full pl-7 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition"
                    required
                    min={0}
                  />
                </div>
              </div>
            </div>

            {/* Discount Preview */}
            {discount !== null && discount > 0 && (
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-green-600 bg-green-50 border border-green-200 px-3 py-1 rounded-full font-semibold">
                  🎉 {discount}% discount applied
                </span>
                <span className="text-xs text-gray-400">
                  Customer saves ₹{price - offerPrice}
                </span>
              </div>
            )}
            {discount !== null && discount < 0 && (
              <p className="text-xs text-red-500 mt-1">
                ⚠️ Offer price cannot be greater than MRP
              </p>
            )}
          </div>

          {/* Submit */}
          <div className="flex items-center gap-4 pt-2 border-t border-gray-100">
            <button
              type="submit"
              disabled={loading}
              className={`flex items-center gap-2 px-8 py-3 rounded-xl text-white font-semibold text-sm transition-all ${
                loading
                  ? "bg-primary/60 cursor-not-allowed"
                  : "bg-primary hover:bg-primary-dull cursor-pointer"
              }`}
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8z"
                    />
                  </svg>
                  Adding Product...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Add Product
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => {
                setName("");
                setDescription("");
                setCategory("");
                setPrice("");
                setOfferPrice("");
                setFiles([]);
              }}
              className="px-6 py-3 rounded-xl text-gray-500 border border-gray-200 hover:bg-gray-50 text-sm font-medium transition"
            >
              Clear
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
