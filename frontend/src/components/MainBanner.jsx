import { ArrowRight } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

const MainBanner = () => {
  return (
    <div className="w-full px-4 md:px-0 my-4">
      <div className="max-w-6xl relative mx-auto rounded-xl overflow-hidden h-[420px] md:h-[380px]">
        {/* Desktop Image */}
        <img
          src="/main3.jpeg"
          alt="Main Banner"
          className="w-full h-full hidden sm:block object-cover"
        />
        {/* Mobile Image */}
        <img
          src="/main-banner.jpg"
          alt="Main Banner Mobile"
          className="w-full h-full sm:hidden object-cover"
        />

        {/* Dark Overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />

        {/* Text Overlay */}
        <div className="absolute inset-0 flex flex-col items-center md:items-start justify-center p-8 md:pl-16 lg:pl-24">
          <p className="text-primary bg-white/90 text-xs font-semibold px-3 py-1 rounded-full mb-3 tracking-wide uppercase">
            Trusted Pharmacy
          </p>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center md:text-left max-w-sm md:max-w-md lg:max-w-lg leading-tight text-white">
            Your Health, Our Priority
          </h1>
          <p className="text-white/80 text-sm md:text-base mt-3 text-center md:text-left max-w-sm">
            Quality medicines & healthcare products delivered to your doorstep.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4 mt-8 font-medium">
            <Link
              to={"/products"}
              className="group flex items-center justify-center gap-2 px-8 py-3 bg-primary hover:bg-primary-dull transition rounded-full text-white shadow-lg"
            >
              <span>Shop Now</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
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
