import React, { useState } from "react";
import axios from "axios";
import Logo from "../../assets/Login/AgriLink.png";

export default function RightSection() {
  const [formData, setFormData] = useState({
    email: "",
    userType: "customer", // default value
  });
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    try {
      const res = await axios.post(
        "http://localhost/Agrilink-Agri-Marketplace/backend/forgot_password.php",
        formData
      );
      if (res.data.success) {
        setMessage(res.data.message);
      } else {
        setMessage(res.data.message);
      }
    } catch (error) {
      setMessage("Something went wrong. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full md:w-1/2 bg-white p-4 md:p-8 flex flex-col justify-center items-center min-h-screen">
      <div className="w-full max-w-sm sm:max-w-md md:max-w-lg">
        <div className="flex items-center justify-center mb-6">
          <img src={Logo} alt="Logo" className="h-12 sm:h-16 w-auto" />
          <div className="h-12 sm:h-16 border-l border-gray-300 mx-4"></div>
          <div className="text-left">
            <h2 className="text-xl sm:text-2xl font-light text-gray-600">
              Agricultural
              <br />
              Marketplace
            </h2>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-md">
          <h1 className="text-2xl font-bold text-green-600 mb-4 text-center">
            Forgot Password
          </h1>

          {message && (
            <div className="text-center mb-4 p-3 bg-green-50 border border-green-200 text-green-800 rounded-lg">
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your registered email"
                className={`w-full p-2 border rounded-lg ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                User Type
              </label>
              <select
                name="userType"
                value={formData.userType}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg"
              >
                <option value="customer">Customer</option>
                <option value="seller">Seller</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 transition"
            >
              {isLoading ? "Processing..." : "Send Reset Link"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
