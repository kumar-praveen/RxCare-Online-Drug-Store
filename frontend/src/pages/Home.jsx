import React from "react";
import MainBanner from "../components/MainBanner";
import Categories from "../components/Categories";
import BestSeller from "../components/BestSeller";
import BottomBanner from "../components/BottomBanner";
import NewsLetter from "../components/NewsLetter";

const Home = () => {
  return (
    <div className="mt-10 w-full">
      <div className="max-w-6xl mx-auto">
        <MainBanner />
        <Categories />
        <BestSeller />
        <BottomBanner />
        <NewsLetter/>
      </div>
    </div>
  );
};

export default Home;
