import React from "react";
import features from "../assets/features";

const BottomBanner = () => {
  return (
    <div className="relative md:mt-16">
      <div className="max-w-6xl h-87.5">
        <img
          src="/bottom1.jpg"
          alt="banner"
          className="w-full hidden md:block h-full rounded-lg object-cover"
        />
      </div>
      <img src="bottom-banner2.jpg" alt="banner" className="w-full md:hidden" />

      <div className="absolute inset-0 flex flex-col items-center md:items-end md:justify-center pt-0 md:pt-0 md:pr-24">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-white">
            Why We Are the Best?
          </h1>
          {features.map((feature, idx) => (
            <div key={idx} className="flex items-center gap-4 mt-2">
              <span>{<feature.icon />}</span>
              <div>
                <h3 className="text-lg md:text-xl font-semibold">
                  {feature.title}
                </h3>
                <p className="text-gray-500 text-xs md:text-sm">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BottomBanner;
