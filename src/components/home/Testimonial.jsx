import React, { useState, useEffect } from "react";
import testimonialimg1 from "../../assets/landing_page/testimonialimg.jpg";
import testimonialimg2 from "../../assets/landing_page/haneycooper.jpg";
import testimonialimg3 from "../../assets/landing_page/duerudilee.jpg";
import testimonialimg4 from "../../assets/landing_page/janesmith.jpg";
import testimonialimg5 from "../../assets/landing_page/testimonialimg2.jpg";

const TestimonialSection = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const images = [testimonialimg1, testimonialimg2, testimonialimg3, testimonialimg4, testimonialimg5];
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    fetch("http://localhost/Agrilink-Agri-Marketplace/backend/testimonials/get_testimonials.php")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setTestimonials(data.testimonials);
        } else {
          setError(data.message || "Failed to load testimonials.");
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Error loading testimonials.");
        setLoading(false);
      });
  }, []);

  // Automatically switch images every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [images.length]);

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
        {/* Left Image - Auto switching */}
        <div className="w-full lg:w-1/2">
          <img
            src={images[currentImage]}
            alt={`Testimonial Visual ${currentImage + 1}`}
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
            What Our Users Say About Us
          </h3>

          {loading ? (
            <div className="text-center py-10 text-gray-500 text-lg">Loading testimonials...</div>
          ) : error ? (
            <div className="text-center py-10 text-red-500 text-lg">{error}</div>
          ) : testimonials.length > 0 ? (
            <>
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
                
                <div>
                  <p className="font-bold text-green-700 text-base sm:text-lg">
                    {testimonials[currentTestimonial].author}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500">
                    {testimonials[currentTestimonial].title}
                  </p>
                </div>
             
                <hr className="flex-1 border-t border-green-300 ml-4 hidden lg:block" />
              </div>

             
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
            </>
          ) : (
            <div className="text-center py-10 text-gray-500 text-lg">No testimonials found.</div>
          )}
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
