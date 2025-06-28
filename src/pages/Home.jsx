import React from "react";
import Hero from "../components/home/Hero";
import { Route } from "react-router";
import WhyChooseUs from "../components/home/WhyChooseUs";
import Servises from "../components/home/Servises";
import Aboutsec from "../components/home/Aboutsec";
import ProductShowcase from "../components/home/ProductShowcase";
import Testimonial from "../components/home/Testimonial";
import Footer from "../components/common/Footer";

const Home = () => {
  return (
    <div className="font-sans">
      <Hero />
      <div className="space-y-0">
        {/* This ensures no unwanted spacing */}
        <WhyChooseUs />
        <Servises />
        <Aboutsec />
        <ProductShowcase />
        <Testimonial />
        <Footer />

        {/* Add other sections here */}
      </div>
    </div>
  );
};

export default Home;
