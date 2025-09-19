import { Link , useNavigate} from "react-router-dom";
import React,{useEffect} from "react";
import Logo from "../../assets/login/AgriLink.png";

const RightSection = ({
  formData,
  errors,
  isLoading,
  onInputChange,
  onSubmit,
  message,
}) => {
   const navigate = useNavigate();

  // Redirect after success
  useEffect(() => {
    if (message && message.includes("successfully")) {
      const timer = setTimeout(() => {
        navigate("/login"); // navigate to login page
      }, 1000); // 1 second delay

      return () => clearTimeout(timer); // cleanup
    }
  }, [message, navigate]);

  return (
    <div className="w-full min-h-screen lg:w-1/2 flex items-center justify-center p-4 sm:p-6 md:p-8 bg-gray-50 overflow-auto">
      <div className="w-full max-w-md space-y-4">
        {/* Logo and Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <img
              src={Logo}
              alt="Agricultural Marketplace Logo"
              className="h-12 sm:h-16 w-auto"
            />
            <div className="h-12 sm:h-16 border-l border-gray-300 mx-4"></div>
            <div className="text-left">
              <h2 className="text-xl sm:text-2xl font-light text-gray-600">
                Agricultural
                <br />
                Marketplace
              </h2>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-green-600">
            Create Your Account
          </h1>
          <h2 className="text-2xl font-sans text-green-700">I'm a Customer</h2>
        </div>

        {/* Signup Form */}
        <form onSubmit={onSubmit} className="space-y-6">
          {/* First Name */}
          <div>
            <label
              htmlFor="firstName"
              className="block text-base font-medium text-gray-600 mb-2"
            >
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={onInputChange}
              placeholder="Enter your first name"
              className={`w-full px-4 py-2 border rounded-full focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors ${
                errors.firstName ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.firstName && (
              <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
            )}
          </div>

          {/* Last Name */}
          <div>
            <label
              htmlFor="lastName"
              className="block text-base font-medium text-gray-600 mb-2"
            >
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={onInputChange}
              placeholder="Enter your last name"
              className={`w-full px-4 py-2 border rounded-full focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors ${
                errors.lastName ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.lastName && (
              <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-base font-medium text-gray-600 mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={onInputChange}
              placeholder="Enter your email"
              className={`w-full px-4 py-2 border rounded-full focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-base font-medium text-gray-600 mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={onInputChange}
              placeholder="Enter your password"
              className={`w-full px-4 py-2 border rounded-full focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors ${
                errors.password ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-base font-medium text-gray-600 mb-2"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={onInputChange}
              placeholder="Confirm your password"
              className={`w-full px-4 py-2 border rounded-full focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors ${
                errors.confirmPassword ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white font-semibold py-2 px-4 rounded-full transition-colors duration-200 flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Creating Account...
              </>
            ) : (
              "Sign Up"
            )}
          </button>

          {/* Backend Message */}
          {message && (
            <div
              className={`text-center p-3 rounded-lg border ${
                message.includes("successfully")
                  ? "bg-green-50 text-green-800 border-green-200"
                  : "bg-red-50 text-red-800 border-red-200"
              }`}
            >
              <div className="flex items-center justify-center">
                {message.includes("successfully") && (
                  <svg
                    className="w-5 h-5 mr-2 text-green-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
                {message}
              </div>
            </div>
          )}

          {/* Login Link */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                to="/Login"
                className="text-green-600 hover:text-green-700 font-bold hover:underline transition-colors"
              >
                Log In
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RightSection;
