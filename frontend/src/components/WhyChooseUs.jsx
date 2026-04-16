import React from "react";
import {
  ShieldCheck,
  Clock,
  BadgePercent,
  HeartPulse,
  Truck,
  UserCheck,
} from "lucide-react";

const reasons = [
  {
    icon: ShieldCheck,
    title: "100% Authentic Products",
    description:
      "Every product is sourced directly from licensed manufacturers and verified distributors.",
    color: "text-green-500",
    bg: "bg-green-50",
  },
  {
    icon: BadgePercent,
    title: "Best Price Guaranteed",
    description:
      "We offer the most competitive prices with exclusive discounts and offers on all products.",
    color: "text-purple-500",
    bg: "bg-purple-50",
  },
  {
    icon: Truck,
    title: "Express Delivery",
    description:
      "Get your medicines delivered within 24 hours. We ensure safe and timely delivery.",
    color: "text-blue-500",
    bg: "bg-blue-50",
  },
  {
    icon: Clock,
    title: "24/7 Availability",
    description:
      "Our platform is available round the clock so you can order medicines anytime you need.",
    color: "text-orange-500",
    bg: "bg-orange-50",
  },
  {
    icon: HeartPulse,
    title: "Expert Health Support",
    description:
      "Get guidance from certified pharmacists and healthcare professionals anytime.",
    color: "text-red-500",
    bg: "bg-red-50",
  },
  {
    icon: UserCheck,
    title: "Easy Prescription Upload",
    description:
      "Simply upload your prescription and we handle the rest — quick, easy and hassle-free.",
    color: "text-primary",
    bg: "bg-primary/10",
  },
];

const WhyChooseUs = () => {
  return (
    <div className="mt-20">
      {/* Header */}
      <div className="text-center mb-10">
        <span className="text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full uppercase tracking-wide">
          Our Advantages
        </span>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mt-3">
          Why Choose RxCare?
        </h2>
        <p className="text-gray-500 text-sm mt-2 max-w-md mx-auto">
          We are committed to providing you the best healthcare experience with
          trust, convenience and care
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {reasons.map((reason, idx) => (
          <div
            key={idx}
            className="group flex gap-4 p-6 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-300"
          >
            {/* Icon */}
            <div
              className={`${reason.bg} p-3 rounded-xl h-fit shrink-0 group-hover:scale-110 transition-transform duration-300`}
            >
              <reason.icon className={`w-5 h-5 ${reason.color}`} />
            </div>

            {/* Text */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-1">
                {reason.title}
              </h3>
              <p className="text-gray-500 text-xs leading-relaxed">
                {reason.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WhyChooseUs;
