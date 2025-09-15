import React, { useState, useEffect } from 'react';
import signing from '../../assets/signupCustomer/seeds.jpg';

const LeftSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "Fresh Products, Trusted Sources",
      description: "Handpicked tea leaves, fragrant spices, rich coffee beans all from passionate farmers, no middlemen. Fill your pantry with real flavors, straight from the source."
    },
    {
      title: "“Shop safe, sleep easy.”",
      description: "lace your order, sit back, relax. Every transaction is protected, every step is confirmed — from checkout to doorstep. Shopping that feels as trustworthy as your local grocer."
    },
    {
      title: "Reviews you can believe in",
      description: "Before you buy, hear from people like you. Honest ratings, helpful reviews so you always pick what’s best for your family. Every voice builds trust, every rating makes the marketplace stronger."
    }
  ];

  // Auto-slide functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [slides.length]);

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
        {/* Main Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/50 via-black/30 to-green-500/80"></div>
      </div>

      {/* Content */}
      <div className="relative  flex flex-col justify-center items-center text-white  w-full h-full">
        <div className=" w-full text-center space-y-10">
          {/* Main Heading with Gray Overlay Background */}
          <div className="relative">
            {/* Gray overlay specifically for the heading */}
            <div className="min-w-screen h-full absolute inset-0 bg-gradient-to-br from-black/50 via-black/30 to-green-900/40"></div>
            <h2 className="relative text-3xl md:text-5xl font-semibold leading-tight text-white drop-shadow-2xl">
              "Taste the Farm, Wherever<br/> You Are"
            </h2>
          </div>

          {/* Content Box with Slide Animation */}
          <div className=" w-full max-w-sm mx-auto bg-white/10 backdrop-blur-md rounded-xl p-8 space-y-10  space-x-30shadow-2xl border border-white/10 min-h-[200px] transition-all duration-500 ease-in-out">
            <div className="transition-all duration-500 ease-in-out transform">
              <h2 className="text-xl font-semibold text-yellow-300 mb-4 transition-all duration-500">
                {slides[currentSlide].title}
              </h2>
              <p className="text-sm md:text-base leading-relaxed text-white/90 transition-all duration-500 font-medium">
                {slides[currentSlide].description}
              </p>
            </div>
          </div>

          {/* Navigation Dots */}
          <div className="flex justify-center space-x-3 mt-8">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => handleDotClick(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 transform hover:scale-125 focus:outline-none focus:ring-2 focus:ring-white/50 ${
                  currentSlide === index
                    ? 'bg-white shadow-lg'
                    : 'bg-white/40 hover:bg-white/60'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>


          {/* Additional Decorative Elements */}
          <div className="flex justify-center items-center space-x-4 mt-6 opacity-60">
            <div className="w-8 h-px bg-gradient-to-r from-transparent via-white to-transparent"></div>
            <div className="w-2 h-2 bg-white/40 rounded-full"></div>
            <div className="w-8 h-px bg-gradient-to-r from-transparent via-white to-transparent"></div>
          </div>
        </div>
      </div>

      {/* Floating Elements for Visual Enhancement */}
      <div className="absolute top-20 left-10 w-4 h-4 bg-yellow-300/30 rounded-full animate-pulse"></div>
      <div className="absolute bottom-32 right-16 w-6 h-6 bg-green-400/20 rounded-full animate-pulse delay-1000"></div>
      <div className="absolute top-1/3 right-8 w-3 h-3 bg-white/20 rounded-full animate-pulse delay-2000"></div>
    </div>
  );
};

export default LeftSection;
