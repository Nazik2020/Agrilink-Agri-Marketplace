// src/components/AboutSection.jsx
import React, { useState } from "react";
import { FaStar } from "react-icons/fa";
import { FaSeedling, FaLeaf } from "react-icons/fa";

const AboutSection = () => {
  const [author, setAuthor] = useState("");
  const [title, setTitle] = useState("");
  const [quote, setQuote] = useState("");
  const [rating, setRating] = useState(5);
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg("");
    const data = { author, title, quote, rating };
    try {
      const res = await fetch("http://localhost/Agrilink-Agri-Marketplace/backend/testimonials/add_testimonial.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      const result = await res.json();
      if (result.success) {
        setSuccessMsg("Thank you for sharing your experience!");
        setAuthor("");
        setTitle("");
        setQuote("");
        setRating(5);
      } else {
        setSuccessMsg(result.message || "Failed to submit testimonial.");
      }
    } catch {
      setSuccessMsg("Error submitting testimonial.");
    }
    setLoading(false);
  };

  return (
    <section className="bg-[#14452F] py-16 px-4 sm:px-6 lg:px-8 text-white">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">
        {/* Left Section - Who We Are */}
        <div className="w-full lg:w-2/3">
          <h3 className="text-2xl font-semibold mb-6">Who We Are</h3>
          <h2 className="text-4xl md:text-5xl font-serif mb-4">
            Nourishing world from seed to table
          </h2>
          <p className="text-gray-300 mb-6">
            Agriculture and farming are essential industries that involve the
            cultivation of crops, raising of livestock, and production of food.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-green-800 p-6 rounded-lg text-center">
              <div className="flex justify-center mb-4">
                <FaSeedling className="text-yellow-400 text-5xl" />
              </div>
              <h4 className="text-xl font-sans mb-2">
                Growing stron a feeding
              </h4>
            </div>
            <div className="bg-green-800 p-6 rounded-lg text-center">
              <div className="flex justify-center mb-4">
                <FaLeaf className="text-yellow-400 text-5xl" />
              </div>
              <h4 className="text-xl font-sans mb-2">
                Taking care of the Earth
              </h4>
            </div>
          </div>
        </div>

        {/* Right Section - Share Experience as Testimonial */}
        <div className="w-full lg:w-1/3 bg-green-800 p-6 rounded-lg">
          <h3 className="text-2xl font-semibold mb-6">
            Share your Experience with Us!
          </h3>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Name"
              className="w-full p-3 bg-green-700 rounded-lg border-none focus:outline-none"
              value={author}
              onChange={e => setAuthor(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Title (e.g. Farmer, Customer)"
              className="w-full p-3 bg-green-700 rounded-lg border-none focus:outline-none"
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
            <textarea
              placeholder="Share your experience..."
              className="w-full p-3 bg-green-700 rounded-lg border-none focus:outline-none h-24 resize-none"
              value={quote}
              onChange={e => setQuote(e.target.value)}
              required
            ></textarea>
            <div>
              <label className="block mb-2">Rating:</label>
              <div className="flex gap-1">
                {[1,2,3,4,5].map(star => (
                  <FaStar
                    key={star}
                    size={28}
                    className={
                      star <= rating
                        ? "text-yellow-400 cursor-pointer"
                        : "text-gray-400 cursor-pointer"
                    }
                    onClick={() => setRating(star)}
                    aria-label={star + " star"}
                  />
                ))}
              </div>
            </div>
            <button
              type="submit"
              className="w-full cursor-pointer bg-yellow-400 text-green-900 font-semibold py-3 rounded-lg hover:bg-yellow-500 transition"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit Now"}
            </button>
            {successMsg && (
              <div className="mt-2 text-yellow-300 text-center font-semibold">{successMsg}</div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
