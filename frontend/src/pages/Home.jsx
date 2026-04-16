import React from "react";
import MainBanner from "../components/MainBanner";
import Categories from "../components/Categories";
import BestSeller from "../components/BestSeller";
import BottomBanner from "../components/BottomBanner";
import Testimonials from "../components/Testimonials";
import WhyChooseUs from "../components/WhyChooseUs";
import HowItWorks from "../components/HowItWorks";
import ContactStrip from "../components/ContactStrip";

const Home = () => {
  return (
    <div className="mt-10 w-full">
      <div className="max-w-6xl mx-auto">
        {/* 1. Hero Banner */}
        <MainBanner />

        {/* 2. Trust Indicators */}
        <TrustBar />

        {/* 3. Shop by Category */}
        <Categories />

        {/* 4. Best Selling Products */}
        <BestSeller />

        {/* 5. How It Works */}
        <HowItWorks />

        {/* 6. Why Choose Us */}
        <WhyChooseUs />

        {/* 7. Bottom Banner */}
        <BottomBanner />

        {/* 8. Testimonials */}
        <Testimonials />

        {/* 9. Contact Strip */}
        <ContactStrip />
      </div>
    </div>
  );
};

// ── Inline TrustBar (small, no separate file needed) ──────────────────────────
const trustItems = [
  { emoji: "💊", label: "100% Genuine Medicines" },
  { emoji: "🚚", label: "Fast & Safe Delivery" },
  { emoji: "🔒", label: "Secure Payments" },
  { emoji: "🏥", label: "Licensed Pharmacy" },
  { emoji: "📞", label: "24/7 Support" },
];

const TrustBar = () => (
  <div className="mt-8 bg-primary/5 border border-primary/10 rounded-2xl px-6 py-4">
    <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
      {trustItems.map((item, idx) => (
        <div key={idx} className="flex items-center gap-2">
          <span className="text-xl">{item.emoji}</span>
          <span className="text-sm font-medium text-gray-600">
            {item.label}
          </span>
          {idx !== trustItems.length - 1 && (
            <span className="hidden md:block text-gray-300 ml-8">|</span>
          )}
        </div>
      ))}
    </div>
  </div>
);

export default Home;
