import { useNavigate } from "react-router-dom";
import whyChooseUsImage from "../../assets/landing_page/whychoosus.jpg";

const WhyChooseUs = () => {
  const navigate = useNavigate();

  const handleReadMore = () => {
    navigate("/about");
  };

  return (
    <section className="bg-white py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#14452F] mb-4">
            Why Choose Us
          </h2>
        
        </div>

        {/* Content */}
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Left Image Section */}
          <div className="w-full lg:w-1/2">
            <img
              src={whyChooseUsImage}
              alt="Our farming methods"
              className="w-full rounded-lg shadow-md object-cover"
            />
          </div>

          {/* Right Text Section */}
          <div className="w-full lg:w-1/2 space-y-6 text-lg">
            <h2 className="text-4xl text-[#14452F] font-medium">
              Farming with passion, the feeding purpose
            </h2>
            <p className="text-xl text-gray-500">
              AgriLink connects farmers with global buyers, making agriculture
              smarter and more accessible.
            </p>

            {/* Bullet Points */}
            <div className="space-y-4 text-lg">
              <div className="flex items-start">
                <div className="bg-green-600 rounded-full w-6 h-6 flex items-center justify-center mt-1 mr-4 flex-shrink-0">
                  <svg
                    className="w-3 h-3 text-white"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <p className="text-gray-500">Direct farmer-to-buyer sales </p>
              </div>
              <div className="flex items-start">
                <div className="bg-green-600 rounded-full w-6 h-6 flex items-center justify-center mt-1 mr-4 flex-shrink-0">
                  <svg
                    className="w-3 h-3 text-white"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <p className="text-gray-500">Customizable product options </p>
              </div>

              <div className="flex items-start">
                <div className="bg-green-600 rounded-full w-6 h-6 flex items-center justify-center mt-1 mr-4 flex-shrink-0">
                  <svg
                    className="w-3 h-3 text-white"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <p className="text-gray-500">
                  Trusted, user-friendly marketplace{" "}
                </p>
              </div>
            </div>

            {/* Read More Button */}
            <button
              onClick={handleReadMore}
              className="mt-6 px-5 py-2 border-2 border-green-600 rounded-full text-green-600 font-medium hover:bg-green-600 hover:text-white transition"
            >
              Read More →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
