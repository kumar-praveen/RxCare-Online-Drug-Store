import { ArrowRight } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

const MainBanner = () => {
  return (
    <div className="w-full px-4 md:px-0 my-4">
      {/* Container: Added overflow-hidden so the image rounded corners actually work */}
      <div className="max-w-6xl relative mx-auto rounded-lg overflow-hidden h-100 md:h-87.5">
        {/* Desktop Image: Added h-full to fill parent */}
        <img
          src="/main3.jpeg"
          alt="Main Banner"
          className="w-full h-full hidden sm:block object-cover"
        />

        {/* Mobile Image: Added h-full to fill parent */}
        <img
          src="/main-banner.jpg"
          alt="Main Banner Mobile"
          className="w-full h-full sm:hidden object-cover"
        />

        {/* Text Overlay */}
        <div className="absolute inset-0 flex flex-col items-center md:items-start justify-center p-8 md:pl-16 lg:pl-24">
          {/* Text Content */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center md:text-left max-w-sm md:max-w-md lg:max-w-lg leading-tight text-slate-900 bg-white/50 md:bg-transparent backdrop-blur-sm md:backdrop-blur-none p-4 md:p-0 rounded-lg">
            Freshness You Can Trust, Savings You Will Love!
          </h1>

          {/* Buttons: Added gap-4 for spacing and flex-wrap for small screens */}
          <div className="flex flex-col sm:flex-row items-center gap-4 mt-8 font-medium">
            {/* Primary Button */}
            <Link
              to={"/products"}
              className="group flex items-center justify-center gap-2 px-8 py-3 bg-primary hover:bg-primary-dull transition rounded-full text-white shadow-lg"
            >
              <span>Shop Now</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>

            {/* Secondary Button (Visual variation) */}
            <Link
              to={"/products"}
              className="group flex items-center justify-center gap-2 px-8 py-3 bg-white text-primary border-2 border-primary hover:bg-gray-50 transition rounded-full shadow-lg"
            >
              <span>Explore Deals</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainBanner;
