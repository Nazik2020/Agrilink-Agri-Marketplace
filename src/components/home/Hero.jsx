import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaPhoneAlt } from "react-icons/fa";
import heroVideo from "../../assets/landing_page/hero_video.mp4";
import heroImage from "../../assets/landing_page/hero_image.jpg";

const Hero = () => {
  const videoRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.25; // slower playback speed
    }
  }, []);

  const handleReadMore = () => {
    navigate("/about");
  };

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#1a1a1a]">
      {/* Background Video */}
      <video
        ref={videoRef}
        className="absolute top-0 left-0 w-full h-full object-cover"
        src={heroVideo}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        poster={heroImage}
      />

      {/* Gradient overlay from bottom (black) to top (green) */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(20,69,47,0.7) 50%, rgba(20,69,47,0.5) 80%, rgba(20,69,47,0.8) 100%)",
          zIndex: 1,
        }}
      ></div>

      {/* Foreground Content */}
      <div className="relative z-10 max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 pt-30 pb-12">
        <div className="text-center sm:text-left max-w-3xl mx-auto sm:mx-0">
          <p className="text-green-100 text-lg sm:text-xl mb-4">
            Empowering Farmers, Connecting the World
          </p>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-white">
            AgriLink is our
            <span className="text-gray-300 font-light"> future,</span> <br />
            <span className="font-light text-gray-300">our strength</span>
          </h1>

          <p className="text-gray-300  sm:text-lg mb-8 tracking-wider max-w-2xl leading-relaxed">
            AgriLink is a premier agricultural marketplace, where
            tradition meets technology. We empower worldwide farmers by giving them
            a platform to reach national and international buyers directly.
          </p>


          <p className="text-gray-200  sm:text-lg mb-8 tracking-wider max-w-2xl leading-relaxed">
            Together, we’re building a smarter, greener future — one crop at a
            time.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-6">
            <button onClick={handleReadMore} className="px-6 py-3 border-2 border-green-200 rounded-full text-green-200 font-medium hover:bg-green-200 hover:text-black transition">
              Read More →
            </button>
            <div className="flex items-center gap-3">
              <div className="bg-green-500 p-3 rounded-full text-white">
                <FaPhoneAlt />
              </div>
              <div className="text-left">
                <p className="text-sm text-gray-200">Need help?</p>
                <p className="text-base font-semibold text-white">
                  +94-77 5835521
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="text-center mt-12">
  <p className="text-base font-extralight text-white mb-0">
    "AgriLink — Cultivating connections, empowering farmers, and growing a sustainable future together."
  </p>
</div>

      </div>
      
    </section>
  );
};

export default Hero;
