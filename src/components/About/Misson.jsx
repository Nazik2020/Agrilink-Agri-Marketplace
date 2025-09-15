import React from "react";
import aboutMission from "../../assets/Aboutus/ourmission.jpg";

const Mission = () => {
  return (
    <div className="w-full flex flex-col items-center min-w-screen pt-10 font-inter">
      {/* Green Box Section */}
      <div className="w-full max-w-7xl bg-green-100 rounded-none md:rounded mx-auto px-6 py-10 md:py-12 md:px-12">
        <div className="flex flex-col md:flex-row items-start gap-0">
          {/* Left: Image */}
          <div className="flex-1 flex flex-col items-center md:items-start">
            <img
              src={aboutMission}
              alt="Coffee cup"
              className="rounded-[10px] shadow-lg w-140 h-80 object-cover mb-6 md:mb-0"
            />
            {/* Why We Exist (under image on left) */}
            <div className="w-full mt-6 md:mt-8">
              <h3 className="text-lg font-semibold mb-2">Why We Exist</h3>
              <p className="text-gray-700 text-justify">
                Farmers face countless barriers-limited market access, unfair
                pricing, and lack of recognition. AgriLink is here to change
                that. We turn passion into profit, crops into commerce, and
                effort into empowerment. It's not just agriculture. It's a
                digital revolution.
              </p>
            </div>
          </div>
          {/* Right: Mission Text */}
          <div className="flex-1 flex flex-col justify-center">
            <h2 className="text-2xl font-semibold mb-3">Our Mission</h2>
            <p className="text-gray-700 text-justify text-[16px] p-1">
              At AgriLink, we believe every harvest tells a story—from the aroma
              of Ceylon tea to the richness of organic crops. Our mission is to
              empower farmers through smart technology, giving them a global a
              bridge between local growers and global buyers, built on values of
              fair trade, trust, and sustainability. By reducing market barriers
              and increasing visibility, we help farmers thrive and connect
              directly with customers who value quality and authenticity. Every
              interaction at AgriLink contributes to a more connected and
              equitable future for agriculture, where technology strengthens
              communities and promotes inclusive growth..
              <br />
              <br />
              We're more than a marketplace-we're a bridge between local farmers
              and global buyers, promoting fair trade, trust, and sustainable
              growth. Every transaction helps cultivate a more connected and
              equitable agricultural future.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Mission;
