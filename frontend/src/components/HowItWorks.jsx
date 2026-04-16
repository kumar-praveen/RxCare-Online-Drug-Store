import React from "react";
import { Search, ShoppingCart, Truck, CheckCircle } from "lucide-react";

const steps = [
  {
    icon: Search,
    step: "01",
    title: "Search Medicine",
    description:
      "Search for your required medicine or healthcare product by name or category.",
    color: "bg-blue-50",
    iconColor: "text-blue-500",
  },
  {
    icon: ShoppingCart,
    step: "02",
    title: "Add to Cart",
    description:
      "Add medicines to your cart. Upload your prescription if required.",
    color: "bg-purple-50",
    iconColor: "text-purple-500",
  },
  {
    icon: CheckCircle,
    step: "03",
    title: "Place Order",
    description:
      "Choose your delivery address and pay securely via COD or online payment.",
    color: "bg-green-50",
    iconColor: "text-green-500",
  },
  {
    icon: Truck,
    step: "04",
    title: "Fast Delivery",
    description:
      "Your medicines are packed carefully and delivered to your doorstep quickly.",
    color: "bg-orange-50",
    iconColor: "text-orange-500",
  },
];

const HowItWorks = () => {
  return (
    <div className="mt-20">
      {/* Header */}
      <div className="text-center mb-10">
        <span className="text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full uppercase tracking-wide">
          Simple & Easy
        </span>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mt-3">
          How It Works
        </h2>
        <p className="text-gray-500 text-sm mt-2 max-w-md mx-auto">
          Order your medicines in just 4 simple steps from the comfort of your
          home
        </p>
      </div>

      {/* Steps */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
        {/* Connector Line (desktop only) */}
        <div className="hidden lg:block absolute top-10 left-[12.5%] right-[12.5%] h-0.5 bg-primary/20 z-0" />

        {steps.map((step, idx) => (
          <div
            key={idx}
            className="relative z-10 flex flex-col items-center text-center p-6 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300"
          >
            {/* Step Number */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-bold px-2.5 py-0.5 rounded-full">
              {step.step}
            </div>

            {/* Icon */}
            <div className={`${step.color} p-4 rounded-2xl mt-4`}>
              <step.icon className={`w-7 h-7 ${step.iconColor}`} />
            </div>

            {/* Text */}
            <h3 className="font-semibold text-gray-800 mt-4 mb-2">
              {step.title}
            </h3>
            <p className="text-gray-500 text-xs leading-relaxed">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HowItWorks;
