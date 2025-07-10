import React from "react";
import Navbar from "../components/common/Navbar";
import AboutTop from "../components/About/AboutTop";
import Misson from "../components/About/Misson";
import UniqueFeatures from "../components/About/UniqueFeatures";
import Footer from "../components/common/Footer";
const Aboutus = () => {
  return (
    <div className="flex flex-col items-start max-w-3xl gap-5">
      <Navbar />
      <AboutTop />
      <Misson />
      <UniqueFeatures />
      <Footer />
    </div>
  );
};

export default Aboutus;
