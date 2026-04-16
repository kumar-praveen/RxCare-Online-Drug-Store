import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { Link, useParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import {
  ShoppingCart,
  Zap,
  ChevronRight,
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
} from "lucide-react";

const ProductDetails = () => {
  const { products, navigate, addToCart } = useAppContext();
  const { id } = useParams();

  const product = products.find((item) => item._id === id);
  const [thumbnail, setThumbnail] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);

  const discount = product
    ? Math.round(((product.price - product.offerPrice) / product.price) * 100)
    : 0;

  useEffect(() => {
    if (products.length > 0 && product) {
      const related = products
        .filter(
          (item) =>
            item.category === product.category && item._id !== product._id,
        )
        .slice(0, 5);
      setRelatedProducts(related);
    }
  }, [products, product]);

  useEffect(() => {
    setThumbnail(product?.image[0] || null);
  }, [product]);

  if (!product) return null;

  return (
    <div className="mt-10 pb-16">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-sm text-gray-400 mb-8">
        <Link to="/" className="hover:text-primary transition">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to="/products" className="hover:text-primary transition">
          Products
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link
          to={`/products/${product.category.toLowerCase()}`}
          className="hover:text-primary transition"
        >
          {product.category}
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-primary font-medium truncate max-w-[150px]">
          {product.name}
        </span>
      </div>

      {/* Main Product Section */}
      <div className="flex flex-col md:flex-row gap-10">
        {/* Image Gallery */}
        <div className="flex gap-3 md:w-1/2">
          {/* Thumbnails */}
          <div className="flex flex-col gap-2">
            {product.image.map((image, index) => (
              <div
                key={index}
                onClick={() => setThumbnail(image)}
                className={`w-16 h-16 border-2 rounded-xl overflow-hidden cursor-pointer transition-all ${
                  thumbnail === image
                    ? "border-primary shadow-md"
                    : "border-gray-200 hover:border-primary/40"
                }`}
              >
                <img
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-contain p-1"
                />
              </div>
            ))}
          </div>

          {/* Main Image */}
          <div className="flex-1 border-2 border-gray-100 rounded-2xl overflow-hidden bg-gray-50 flex items-center justify-center p-4 min-h-[300px]">
            <img
              src={thumbnail}
              alt={product.name}
              className="max-h-72 object-contain"
            />
          </div>
        </div>

        {/* Product Info */}
        <div className="md:w-1/2 flex flex-col gap-4">
          {/* Category Badge */}
          <span className="text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full w-fit uppercase tracking-wide">
            {product.category}
          </span>

          {/* Name */}
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 leading-snug">
            {product.name}
          </h1>

          {/* Rating */}
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-0.5">
              {Array(5)
                .fill("")
                .map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < 4
                        ? "fill-yellow-400 text-yellow-400"
                        : "fill-gray-200 text-gray-200"
                    }`}
                  />
                ))}
            </div>
            <span className="text-sm text-gray-500">(4.0) • 120 reviews</span>
          </div>

          {/* Stock Status */}
          <div>
            {product.inStock ? (
              <span className="text-green-600 bg-green-50 border border-green-200 text-xs font-semibold px-3 py-1 rounded-full">
                ✓ In Stock
              </span>
            ) : (
              <span className="text-red-500 bg-red-50 border border-red-200 text-xs font-semibold px-3 py-1 rounded-full">
                ✗ Out of Stock
              </span>
            )}
          </div>

          {/* Pricing */}
          <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
            <div className="flex items-baseline gap-3">
              <p className="text-3xl font-bold text-gray-800">
                ₹{product.offerPrice}
              </p>
              <p className="text-lg text-gray-400 line-through">
                ₹{product.price}
              </p>
              {discount > 0 && (
                <span className="text-green-500 font-bold text-sm bg-green-50 px-2 py-0.5 rounded-full">
                  {discount}% OFF
                </span>
              )}
            </div>
            <p className="text-xs text-gray-400 mt-1">Inclusive of all taxes</p>
          </div>

          {/* Description */}
          <div>
            <p className="text-sm font-semibold text-gray-800 mb-2">
              About this product
            </p>
            <ul className="flex flex-col gap-1.5">
              {product.description.map((desc, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2 text-sm text-gray-500"
                >
                  <span className="text-primary mt-0.5 shrink-0">✦</span>
                  {desc}
                </li>
              ))}
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-2">
            <button
              onClick={() => addToCart(product._id)}
              disabled={!product.inStock}
              className="flex-1 flex items-center justify-center gap-2 py-3 border-2 border-primary text-primary font-semibold rounded-xl hover:bg-primary/5 transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ShoppingCart className="w-4 h-4" />
              Add to Cart
            </button>
            <button
              onClick={() => {
                addToCart(product._id);
                navigate("/cart");
              }}
              disabled={!product.inStock}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-primary hover:bg-primary-dull text-white font-semibold rounded-xl transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Zap className="w-4 h-4" />
              Buy Now
            </button>
          </div>

          {/* Assurance Strip */}
          <div className="grid grid-cols-3 gap-3 mt-2">
            {[
              {
                icon: ShieldCheck,
                label: "100% Genuine",
                color: "text-green-500",
              },
              { icon: Truck, label: "Fast Delivery", color: "text-blue-500" },
              {
                icon: RotateCcw,
                label: "Easy Returns",
                color: "text-orange-500",
              },
            ].map(({ icon: Icon, label, color }, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center gap-1 bg-gray-50 border border-gray-100 rounded-xl py-3 text-center"
              >
                <Icon className={`w-5 h-5 ${color}`} />
                <span className="text-xs text-gray-500 font-medium">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-20">
          <div className="flex items-end justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Related Products
              </h2>
              <div className="w-16 h-1 bg-primary rounded-full mt-1.5" />
            </div>
            <Link
              to={`/products/${product.category.toLowerCase()}`}
              className="text-sm text-primary hover:underline font-medium"
            >
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {relatedProducts.map((prod, index) => (
              <ProductCard key={index} product={prod} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
