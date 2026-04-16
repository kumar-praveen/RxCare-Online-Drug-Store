import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

const testimonials = [
  {
    name: "Ayesha Raza",
    role: "Regular Customer",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    rating: 5,
    review:
      "RxCare has been a lifesaver! I can order my monthly medications without stepping out. The delivery is always on time and the packaging is excellent.",
  },
  {
    name: "Rahul Mehta",
    role: "Verified Buyer",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    rating: 5,
    review:
      "The offer prices are unbeatable. I saved almost 30% on my prescriptions compared to local pharmacies. Highly recommend RxCare to everyone!",
  },
  {
    name: "Priya Sharma",
    role: "Regular Customer",
    image: "https://randomuser.me/api/portraits/women/68.jpg",
    rating: 4,
    review:
      "Very easy to navigate and find the medicines I need. The product descriptions are detailed and helpful. Will definitely keep using this service.",
  },
  {
    name: "Omar Farooq",
    role: "Verified Buyer",
    image: "https://randomuser.me/api/portraits/men/75.jpg",
    rating: 5,
    review:
      "Excellent customer service and genuine products. I love that I can track my orders in real time. RxCare has made managing my family's healthcare so easy.",
  },
  {
    name: "Sneha Kapoor",
    role: "Regular Customer",
    image: "https://randomuser.me/api/portraits/women/12.jpg",
    rating: 4,
    review:
      "Fast delivery and great discounts. The website is clean and easy to use. I especially love the category-wise browsing for healthcare products.",
  },
];

const StarRating = ({ rating }) => (
  <div className="flex items-center gap-0.5">
    {[...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating
            ? "fill-yellow-400 text-yellow-400"
            : "fill-gray-200 text-gray-200"
        }`}
      />
    ))}
  </div>
);

const Testimonials = () => {
  const [current, setCurrent] = useState(0);

  const prev = () =>
    setCurrent((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));

  const next = () =>
    setCurrent((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));

  // Show 3 cards on desktop, 1 on mobile
  const getVisible = () => {
    const items = [];
    for (let i = 0; i < 3; i++) {
      items.push(testimonials[(current + i) % testimonials.length]);
    }
    return items;
  };

  return (
    <div className="mt-20 mb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-2 mb-10">
        <div>
          <span className="text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full uppercase tracking-wide">
            Testimonials
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mt-3">
            What Our Customers Say
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Real experiences from people who trust RxCare
          </p>
        </div>

        {/* Navigation Arrows */}
        <div className="flex items-center gap-3">
          <button
            onClick={prev}
            className="p-2 rounded-full border border-gray-300 hover:border-primary hover:text-primary hover:bg-primary/5 transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={next}
            className="p-2 rounded-full border border-gray-300 hover:border-primary hover:text-primary hover:bg-primary/5 transition-all"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Desktop: 3 Cards */}
      <div className="hidden md:grid grid-cols-3 gap-6">
        {getVisible().map((t, idx) => (
          <div
            key={idx}
            className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col gap-4"
          >
            {/* Stars */}
            <StarRating rating={t.rating} />

            {/* Review */}
            <p className="text-gray-600 text-sm leading-relaxed flex-1">
              "{t.review}"
            </p>

            {/* User Info */}
            <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
              <img
                src={t.image}
                alt={t.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="text-sm font-semibold text-gray-800">{t.name}</p>
                <p className="text-xs text-gray-400">{t.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Mobile: 1 Card */}
      <div className="md:hidden">
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col gap-4">
          <StarRating rating={testimonials[current].rating} />
          <p className="text-gray-600 text-sm leading-relaxed">
            "{testimonials[current].review}"
          </p>
          <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
            <img
              src={testimonials[current].image}
              alt={testimonials[current].name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <p className="text-sm font-semibold text-gray-800">
                {testimonials[current].name}
              </p>
              <p className="text-xs text-gray-400">
                {testimonials[current].role}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Dot Indicators */}
      <div className="flex items-center justify-center gap-2 mt-8">
        {testimonials.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`rounded-full transition-all duration-300 ${
              idx === current
                ? "bg-primary w-6 h-2"
                : "bg-gray-300 w-2 h-2 hover:bg-gray-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Testimonials;
