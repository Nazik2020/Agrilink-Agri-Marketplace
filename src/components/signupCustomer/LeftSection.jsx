import React, { useState, useEffect } from "react";
import signing from "../../assets/signupCustomer/seeds.jpg";

const LeftSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "Fresh Products, Trusted Sources",
      description:
        "Handpicked tea leaves, fragrant spices, rich coffee beans all from passionate farmers, no middlemen. Fill your pantry with real flavors, straight from the source.",
    },
    {
      title: "Shop safe, sleep easy.",
      description:
        "Place your order, sit back, relax. Every transaction is protected, every step is confirmed — from checkout to doorstep. Shopping that feels as trustworthy as your local grocer.",
    },
    {
      title: "Reviews you can believe in",
      description:
        "Before you buy, hear from people like you. Honest ratings, helpful reviews so you always pick what’s best for your family. Every voice builds trust, every rating makes the marketplace stronger.",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleDotClick = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className="lg:w-1/2 w-full relative overflow-hidden min-h-[300px] lg:min-h-full">
      {/* Background Image */}
      <div
        className="w-full h-full absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${signing})` }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/50 via-black/30 to-green-500/80"></div>
      </div>

      {/* Content */}
      <div className="relative flex flex-col justify-center items-center text-white w-full h-full px-4 py-6">
        <div className="w-full text-center space-y-10">
          {/* Main Heading */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-black/50 via-black/30 to-green-900/40"></div>
            <h2 className="relative text-3xl md:text-5xl font-semibold leading-tight text-white drop-shadow-2xl">
              "Taste the Farm, Wherever <br /> You Are"
            </h2>
          </div>

          {/* Slide Box */}
          <div className="w-full max-w-sm mx-auto bg-white/10 backdrop-blur-md rounded-xl p-8 space-y-10 shadow-2xl border border-white/10 min-h-[200px] transition-all duration-500 ease-in-out">
            <div className="transition-all duration-500 ease-in-out transform">
              <h2 className="text-xl font-semibold text-yellow-300 mb-4">
                {slides[currentSlide].title}
              </h2>
              <p className="text-sm md:text-base leading-relaxed text-white/90 font-medium">
                {slides[currentSlide].description}
              </p>
            </div>
          </div>

          {/* Slide Dots */}
          <div className="flex justify-center space-x-3 mt-8">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => handleDotClick(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 transform hover:scale-125 focus:outline-none focus:ring-2 focus:ring-white/50 ${
                  currentSlide === index
                    ? "bg-white shadow-lg"
                    : "bg-white/40 hover:bg-white/60"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Description Text */}
          <p className="text-xs text-green-100 font-light-bold leading-tight mt-4" style={{ color: "#b7d5af", fontWeight: "500" }}>
            Sign up to buy fresh produce, seeds, tools, and more directly from
            trusted sellers.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LeftSection;
