import React from "react";
import features from "../assets/features";

const BottomBanner = () => {
  return (
    <div className="relative mt-16 rounded-xl overflow-hidden">
      {/* Desktop Image */}
      <div className="max-w-6xl h-[350px] hidden md:block">
        <img
          src="/bottom1.jpg"
          alt="banner"
          className="w-full h-full object-cover rounded-xl"
        />
      </div>

      {/* Mobile Image */}
      <img
        src="/bottom-banner2.jpg"
        alt="banner"
        className="w-full md:hidden rounded-xl"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-l from-black/70 to-transparent rounded-xl" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center md:items-end justify-center pt-6 md:pt-0 md:pr-24 px-6">
        <div className="max-w-xs">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Why Choose RxCare?
          </h1>
          <div className="flex flex-col gap-3">
            {features.map((feature, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <div className="bg-primary/20 p-2 rounded-full mt-0.5">
                  <feature.icon className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-sm md:text-base font-semibold text-white">
                    {feature.title}
                  </h3>
                  <p className="text-gray-300 text-xs">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BottomBanner;
