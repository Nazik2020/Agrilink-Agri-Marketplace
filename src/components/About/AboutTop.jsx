import React from "react";
import aboutCoffee from "../../assets/Aboutus/aboutcoffee.jpg"; // Adjust path if needed
import Image from "../../assets/Aboutus/aboutushero.jpg"; // This is your hero background

const AboutTop = () => {
  return (
    <div>
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-green-50 to-green-400 py-40 w-full min-w-screen">
      <div
          className="absolute inset-0 bg-cover bg-center opacity-20 w-full h-full"
          style={{ backgroundImage: `url(${Image})` }}
        ></div>
        <div className="relative max-w-7xl mx-auto flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold text-green-700 mb-4">
            <div className="min-w-screen bg-gradient-to-r via-gray-50 p-5">
              About Us
            </div> </h1>
            <p className="text-base md:text-xl text-gray-700 max-w-3xl text-center">
              Our mission is to build a sustainable future by empowering farmers and buyers through easy, transparent 
              access to the marketplace, helping them grow and succeed together.
              </p>
         
        </div>
      </div>

      {/* Our Story Section */}
      <div className="max-w-7xl mx-auto py-12 px-8 flex flex-col md:flex-row items-center gap-x-0 ">
        {/* Text */}
        <div className="flex-1 flex flex-col justify-center md:items-start items-center text-center md:text-left">
          <h2 className="text-3xl font-bold py-10 ">Our Story</h2>
          <p className="text-gray-700 text-base text-justify">
            <span className="font-semibold">
              Rooted in innovation. Grown for the World.
            </span>
            <br />
            At AgriLink, we believe a farmer's harvest should reach beyond
            borders. We're more than just a marketplace-we're a movement to
            connect the hands that grow with the hearts that buy. Born out of a
            vision to revolutionize agriculture through technology, AgriLink is
            your bridge between fertile fields and global markets. We aim to
            empower farmers and sellers by providing a platform where they can
            showcase their products, reach new customers, and grow their
            businesses. With innovation at our core, we are committed to
            transforming the agricultural landscape into one that is
            transparent, inclusive, and sustainable. AgriLink is not just a
            service—it's a story of connection, growth, and impact.
          </p>
        </div>
        {/* Image */}
        <div className="flex-1 flex justify-center md:justify-end">
          <img
            src={aboutCoffee}
            alt="Coffee cup"
            className="rounded-[10px] shadow-lg w-140 h-80 object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default AboutTop;
