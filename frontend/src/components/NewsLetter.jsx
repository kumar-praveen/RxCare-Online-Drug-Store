import React, { useState } from "react";
import toast from "react-hot-toast";

const NewsLetter = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return toast.error("Please enter your email.");
    toast.success("Subscribed successfully!");
    setEmail("");
  };

  return (
    <div className="flex flex-col items-center justify-center text-center mt-20 mb-10 bg-primary/5 border border-primary/20 rounded-2xl py-12 px-6">
      <span className="text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full uppercase tracking-wide mb-3">
        Newsletter
      </span>
      <h1 className="md:text-4xl text-2xl font-bold text-gray-800">
        Never Miss a Deal!
      </h1>
      <p className="md:text-base text-sm text-gray-500 mt-2 mb-8 max-w-md">
        Subscribe to get the latest offers, new arrivals, and exclusive
        discounts on medicines & healthcare products.
      </p>
      <form
        onSubmit={handleSubmit}
        className="flex items-center justify-between max-w-xl w-full h-12 md:h-13 shadow-sm"
      >
        <input
          className="border border-gray-300 rounded-l-full h-full outline-none w-full px-5 text-gray-600 text-sm bg-white"
          type="email"
          placeholder="Enter your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button
          type="submit"
          className="px-8 md:px-12 h-full text-white bg-primary hover:bg-primary-dull transition-all cursor-pointer rounded-r-full font-medium text-sm whitespace-nowrap"
        >
          Subscribe
        </button>
      </form>
    </div>
  );
};

export default NewsLetter;
