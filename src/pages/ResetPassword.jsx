import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import Logo from "../assets/login/AgriLink.png";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const token = searchParams.get("token");
  const userType = searchParams.get("userType");

  useEffect(() => {
    if (!token || !userType) {
      navigate("/forgot-password", {
        state: { message: "Invalid or expired reset link." },
      });
    }
  }, [token, userType, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = "Password must be at least 6 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(
        "http://localhost/Agrilink-Agri-Marketplace/backend/reset_password.php",
        {
          token,
          userType,
          newPassword: formData.newPassword,
        }
      );

      if (response.data.success) {
        setMessage("Password reset successful! Redirecting to login...");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setMessage(response.data.message);
      }
    } catch (error) {
      setMessage("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!token || !userType) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Invalid Reset Link
          </h1>
          <p className="text-gray-600 mb-4">
            This password reset link is invalid or has expired.
          </p>
          <button
            onClick={() => navigate("/forgot-password")}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
          >
            Request New Reset Link
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-6">
            <img src={Logo} alt="AgriLink Logo" className="h-12 w-auto" />
            <div className="h-12 border-l border-gray-300 mx-4"></div>
            <div className="text-left">
              <h2 className="text-xl font-light text-gray-600">
                Agricultural
                <br />
                Marketplace
              </h2>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-green-600 mb-2">
            Reset Password
          </h1>
          <p className="text-gray-600">Enter your new password below</p>
        </div>

        {/* Reset Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>
            <input
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleInputChange}
              placeholder="Enter new password"
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                errors.newPassword ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.newPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm New Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Confirm new password"
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                errors.confirmPassword ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
          >
            {isLoading ? "Resetting Password..." : "Reset Password"}
          </button>
        </form>

        {/* Message Display */}
        {message && (
          <div
            className={`mt-4 p-3 rounded-lg text-center ${
              message.includes("successful")
                ? "bg-green-50 text-green-800 border border-green-200"
                : "bg-red-50 text-red-800 border border-red-200"
            }`}
          >
            {message}
          </div>
        )}

        {/* Back to Login */}
        <div className="text-center mt-6">
          <button
            onClick={() => navigate("/login")}
            className="text-green-600 hover:text-green-700 font-medium"
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
