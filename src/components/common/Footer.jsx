
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import TermsAndConditions from "./TermsAndConditions";
import PrivacyPolicy from "./PrivacyPolicy";

const Footer = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const navigate = useNavigate();

  const handleTermsClick = (e) => {
    e.preventDefault();
    setShowTerms(true);
  };

  const handlePrivacyClick = (e) => {
    e.preventDefault();
    setShowPrivacy(true);
  };

  const handleContactClick = (e) => {
    e.preventDefault();
    navigate("/contact");
  };

  return (
    <footer
      className={`bg-[#14452F] text-white min-w-screen px-4 sm:px-6 lg:px-8 transition-all duration-300 ${
        isHovered ? "py-22" : "py-18"
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-8">
        {/* Logo and Description */}
        <div className="flex flex-col items-start">
          <div className="flex items-center mb-4">
            <svg
              className="w-8 h-8 text-white mr-2"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2L2 7v10l10 5 10-5V7l-10-5zm0 2.5l7 3.5-7 3.5-7-3.5 7-3.5zm0 10l-7-3.5 7-3.5 7 3.5-7 3.5z" />
            </svg>
            <h2 className="text-2xl font-bold text-white">AgriLink</h2>
          </div>
          <p className="text-[17px] text-gray-300 mb-4">
            Connecting farmers globally<br></br> through our comprehensive
            agricultural marketplace.<br></br> Quality products, trusted
            suppliers, worldwide reach.
          </p>
          <div className="flex space-x-4">
            {/* Facebook Icon */}
            <a href="#" className="text-white hover:text-green-600 ">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22.675 0H1.325C.593 0 0 .593 0 1.325v21.351C0 23.407.593 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.73 0 1.323-.593 1.323-1.325V1.325C24 .593 23.407 0 22.675 0z" />
              </svg>
            </a>
            {/* Twitter Icon */}
            <a href="#" className="text-white hover:text-green-600">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-2.717 0-4.92 2.203-4.92 4.917 0 .386.045.762.127 1.124C7.691 8.094 4.066 6.13 1.64 3.161c-.427.733-.666 1.585-.666 2.475 0 1.71.87 3.213 2.188 4.096-.807-.026-1.566-.248-2.228-.616v.061c0 2.385 1.693 4.374 3.946 4.827-.413.111-.849.171-1.296.171-.314 0-.615-.03-.916-.086.631 1.953 2.445 3.377 4.604 3.417-1.68 1.319-3.809 2.105-6.102 2.105-.396 0-.788-.023-1.175-.068 2.187 1.405 4.787 2.224 7.561 2.224 9.054 0 14.01-7.496 14.01-13.986 0-.213-.005-.426-.014-.637.962-.695 1.8-1.562 2.457-2.549z" />
              </svg>
            </a>
            {/* LinkedIn Icon */}
            <a href="#" className="text-white hover:text-green-600">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.924 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.226.792 24 1.771 24h20.451C23.2 24 24 23.226 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </a>
            {/* Instagram Icon */}
            <a href="#" className="text-white hover:text-green-600">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.317 3.608 1.292.975.975 1.23 2.242 1.292 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.317 2.633-1.292 3.608-.975.975-2.242 1.23-3.608 1.292-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.317-3.608-1.292-.975-.975-1.23-2.242-1.292-3.608-.058-1.266-.07-1.646-.07-4.85s.012-3.584.07-4.85c.062-1.366.317-2.633 1.292-3.608.975-.975 2.242-1.23 3.608-1.292 1.266-.058 1.646-.07 4.85-.07m0-2.163c-3.331 0-3.753.015-5.066.072-1.357.064-2.263.307-3.068.655-.808.349-1.497.833-2.185 1.52-.688.688-1.171 1.377-1.52 2.185-.348.805-.591 1.711-.655 3.068-.057 1.313-.072 1.735-.072 5.066s.015 3.753.072 5.066c.064 1.357.307 2.263.655 3.068.349.808.833 1.497 1.52 2.185.688.688 1.377 1.171 2.185 1.52.805.348 1.711.591 3.068.655 1.313.057 1.735.072 5.066.072s3.753-.015 5.066-.072c1.357-.064 2.263-.307 3.068-.655.808-.349 1.497-.833 2.185-1.52.688-.688 1.171-1.377 1.52-2.185.348-.805.591-1.711.655-3.068.057-1.313.072-1.735.072-5.066s-.015-3.753-.072-5.066c-.064-1.357-.307-2.263-.655-3.068-.349-.808-.833-1.497-1.52-2.185-.688-.688-1.377-1.171-2.185-1.52-.805-.348-1.711-.591-3.068-.655-1.313-.057-1.735-.072-5.066-.072m0 5.828c-2.921 0-5.286 2.364-5.286 5.286s2.365 5.286 5.286 5.286 5.286-2.364 5.286-5.286-2.365-5.286-5.286-5.286zm0 8.571c-1.837 0-3.285-1.448-3.285-3.285s1.448-3.285 3.285-3.285 3.285 1.448 3.285 3.285-1.448 3.285-3.285 3.285zm5.964-8.571c0 .76-.617 1.378-1.378 1.378s-1.378-.618-1.378-1.378.617-1.378 1.378-1.378 1.378.618 1.378 1.378z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Services */}
        <div>
          <h3 className="text-[25px] semi-bold mb-4">Service</h3>
          <ul className="space-y-2  text-[17px] semibold">
            <li>
              <span className="text-white hover:text-green-600 cursor-default">
                Secure Transactions
              </span>
            </li>
            <li>
              <span className="text-white hover:text-green-600 cursor-default">
                Marketplace Access
              </span>
            </li>
            <li>
              <span className="text-white hover:text-green-600 cursor-default">
                Seller Analytics
              </span>
            </li>
            <li>
              <span className="text-white hover:text-green-600 cursor-default">
                Global Reach
              </span>
            </li>
          </ul>
        </div>

        {/* Link */}
        <div>
          <h3 className="text-[25px] semi-bold  mb-4">Quick Link</h3>
          <ul className="space-y-2 text-[17px] semibold">
            <li>
              <a href="about" className="text-white hover:text-green-600">
                About Us
              </a>
            </li>
            <li>
              <a href="#" className="text-white hover:text-green-600">
                Service
              </a>
            </li>
            <li>
              <a href="faq" className="text-white hover:text-green-600">
                FAQ
              </a>
            </li>
            <li>
              <a href="blog" className="text-white hover:text-green-600">
                Blog And News
              </a>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-[25px] semi-bold  mb-4">Contact</h3>
          <ul className="space-y-2 text-[17px] semibold">
            <li>
              <a
                href="mailto:debra.holt@example.com"
                className="text-white hover:text-green-600 flex items-center"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                </svg>
                Agrilink.gmail.com
              </a>
            </li>
            <li className="text-white hover:text-green-600 flex items-center">
              <svg
                className="w-4 h-4 mr-2"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
              </svg>
              Bandaranayake Mawathe, Colombo
            </li>
            <li className="text-white hover:text-green-600 flex items-center">
              <svg
                className="w-4 h-4 mr-2"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
              </svg>
              +94 77-432-3376
            </li>
            <li className="text-white hover:text-green-600 flex items-center">
              <svg
                className="w-4 h-4 mr-2"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
              </svg>
              +94 77-583-5511
            </li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-6 border-t border-gray-700 pt-4 text-center text-sm text-gray-400">
        <p>
          © Agrilink 2024. All Rights Reserved |{" "}
          <a 
            href="#" 
            className="text-gray-300 hover:text-green-600 cursor-pointer"
            onClick={handleTermsClick}
          >
            Terms & Condition
          </a>{" "}
          |{" "}
          <a 
            href="#" 
            className="text-gray-300 hover:text-green-600 cursor-pointer"
            onClick={handlePrivacyClick}
          >
            Privacy Policy
          </a>{" "}
          |{" "}
          <a href="#" className="text-gray-300 hover:text-green-600" onClick={handleContactClick}>
            Contact Us
          </a>
        </p>
        <p className="mt-2">
          <a
            href="https://agrilink-next.vercel.app/#"
            className="text-gray-300 hover:text-text-green-600"
          >
            https://agrilink-next.vercel.app
          </a>
        </p>
      </div>

      {/* Popup Components */}
      <TermsAndConditions isOpen={showTerms} onClose={() => setShowTerms(false)} />
      <PrivacyPolicy isOpen={showPrivacy} onClose={() => setShowPrivacy(false)} />
    </footer>
  );
};

export default Footer;
