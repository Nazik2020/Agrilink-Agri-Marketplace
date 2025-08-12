import React, { useState } from "react";

// Import images
import testimonialimg from "../../assets/landing_page/testimonialimg.jpg";
import haneycooper from "../../assets/landing_page/haneycooper.jpg";
import duerudilee from "../../assets/landing_page/duerudilee.jpg";
import janesmith from "../../assets/landing_page/janesmith.jpg";

const TestimonialSection = () => {
  const testimonials = [
    {
      id: 1,
      quote:
        "Agriculture and farming are essential industries that involve the cultivation of crops, raising of livestock, and production of food and other agricultural products.",
      author: "Haney Cooper",
      title: "CEO",
      rating: 4.5,
      image: haneycooper,
    },
    {
      id: 2,
      quote:
        "This service highlights the importance of agriculture and farming in our daily lives.",
      author: "Duer Udilee",
      title: "Farmer",
      rating: 4.0,
      image: duerudilee,
    },
    {
      id: 3,
      quote:
        "Nourishing the world with sustainable farming practices has been a game-changer.",
      author: "Jane Smith",
      title: "Customer",
      rating: 5.0,
      image: janesmith,
    },
  ];

  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  };

  return (
    <section className="bg-green-50 min-h-screen py-12 px-4 sm:px-6 lg:px-20 flex items-center">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-8 lg:gap-16 w-full relative">
        {/* Left Image */}
        <div className="w-full lg:w-1/2">
          <img
            src={testimonialimg}
            alt="Testimonial Visual"
            className="w-full h-[300px] sm:h-[400px] lg:h-[450px] object-cover rounded-2xl shadow-xl"
          />
        </div>

        {/* Right Testimonial */}
        <div className="w-full lg:w-1/2 relative bg-white p-6 sm:p-8 lg:p-10 rounded-2xl shadow-lg border border-green-100">
          <h3 className="text-2xl sm:text-3xl lg:text-4xl text-green-700 mb-4 sm:mb-6 flex items-center gap-2">
            <svg
              className="w-6 sm:w-7 lg:w-8 h-6 sm:h-7 lg:h-8 text-green-600"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M10 9v6h4V9h-4zm-6 6h4V9H4v6zm12-6v6h4V9h-4z" />
            </svg>
            What Our Customers Say
          </h3>

          {/* Rating */}
          <div className="text-yellow-400 text-xl sm:text-2xl mb-3 sm:mb-4">
            {"★".repeat(Math.floor(testimonials[currentTestimonial].rating)) +
              "☆".repeat(
                5 - Math.floor(testimonials[currentTestimonial].rating)
              )}
          </div>

          {/* Quote */}
          <p className="text-gray-800 text-lg sm:text-[20px] leading-relaxed italic mb-6 sm:mb-8">
            {testimonials[currentTestimonial].quote}
          </p>

          {/* Author */}
          <div className="flex items-center mb-6">
            <img
              src={testimonials[currentTestimonial].image}
              alt={testimonials[currentTestimonial].author}
              className="w-12 sm:w-14 lg:w-16 h-12 sm:h-14 lg:h-16 rounded-full mr-3 sm:mr-4 object-cover border-2 border-green-200 p-1"
            />
            <div>
              <p className="font-bold text-green-700 text-base sm:text-lg">
                {testimonials[currentTestimonial].author}
              </p>
              <p className="text-xs sm:text-sm text-gray-500">
                {testimonials[currentTestimonial].title}
              </p>
            </div>
            {/* Horizontal Line from Profile to Right */}
            <hr className="flex-1 border-t border-green-300 ml-4 hidden lg:block" />
          </div>

          {/* Hand Icon and Line on Right */}
          <div className="flex justify-end items-center">
            <hr className="flex-1 border-t border-green-300 mr-4 hidden lg:block" />
            <div
              onClick={nextTestimonial}
              className="text-green-600 hover:text-green-800 text-2xl sm:text-3xl p-2 sm:p-3 rounded-full transition cursor-pointer"
              aria-label="Next"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M21 12c0 1.1-.9 2-2 2h-6l-2 2v-4H5c-1.1 0-2-.9-2-2V5c0-1.1.9-2 2-2h14c1.1 0 2 .9 2 2v7z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Previous Arrow (Optional) */}
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 lg:block hidden">
          <button
            onClick={prevTestimonial}
            className="text-green-600 hover:text-green-800 text-3xl p-3 rounded-full transition"
            aria-label="Previous"
          >
            ←
          </button>
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
