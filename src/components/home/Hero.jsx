import { FaPhoneAlt } from "react-icons/fa";
import heroImage from "../../assets/landing_page/hero_image.jpg";

const Hero = () => {
  return (
    <section className="bg-[#f2faf1] py-35 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col-reverse lg:flex-row items-center gap-12 lg:gap-25">
        {/* Left Text Section */}
        <div className="w-full lg:w-[80%] text-center lg:text-left">
          <p className="text-green-600 text-lg sm:text-xl font-sans mb-2">
            Empowering Farmers, Connecting the World
          </p>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#14452F] leading-tight mb-4">
            AgriLink is our
            <span className="text-gray-800 font-light"> future,</span> <br />
            <span className="font-light text-gray-800">our strength</span>
          </h1>
          <p className="text-gray-600 font-sans sm:text-[15px] mb-8">
            AgriLink bridges the gap between passionate farmers and global
            buyers, enabling sustainable agriculture, better income, and smarter
            solutions for everyone.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6">
            <button className="px-6 py-3 border-2 border-green-600 rounded-full text-green-600 font-medium hover:bg-green-600 hover:text-white transition">
              Read More →
            </button>
            <div className="flex items-center gap-3">
              <div className="bg-green-500 p-3 rounded-full text-white">
                <FaPhoneAlt />
              </div>
              <div className="text-left">
                <p className="text-sm text-gray-600">Need help?</p>
                <p className="text-base font-semibold text-[#14452F]">
                  +94-77 5835521
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Image Section */}
        <div className="w-full lg:w-[150%]">
          <img
            src={heroImage}
            alt="Farmer"
            className="w-full h-auto rounded-lg shadow-md object-cover"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
