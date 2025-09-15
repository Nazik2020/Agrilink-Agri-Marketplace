"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import Logo from "../../assets/Login/AgriLink.png";

export default function RightSection() {
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [tokenData, setTokenData] = useState({
    token: "",
    userType: "",
  });
  const [isValidToken, setIsValidToken] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Extract token and type from URL parameters and validate
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const token = urlParams.get("token");
    const userType = urlParams.get("userType");

    if (token && userType) {
      const validateToken = async () => {
        try {
          const res = await axios.get(
            `http://localhost/Agrilink-Agri-Marketplace/backend/validate_token.php?token=${token}&userType=${userType}`
          );
          if (res.data.valid) {
            setTokenData({ token, userType });
            setIsValidToken(true);
          } else {
            setMessage(res.data.message || "Invalid or expired token.");
            setIsValidToken(false);
          }
        } catch (error) {
          setMessage("Error validating token. Please try again.");
          setIsValidToken(false);
        }
      };
      validateToken();
    } else {
      setMessage("Invalid or missing reset link. Please request a new one.");
      setIsValidToken(false);
    }
  }, [location.search]);

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

    if (!formData.newPassword.trim()) {
      newErrors.newPassword = "New password is required";
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = "Password must be at least 6 characters";
    }

    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
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
        "http://localhost/Agrilink-Agri-Marketplace/backend/reset_password.php",
        {
          token: tokenData.token,
          userType: tokenData.userType,
          newPassword: formData.newPassword,
        }
      );

      setMessage(res.data.message);

      if (res.data.success) {
        setTimeout(() => {
          navigate("/Login");
        }, 3000);
      }
    } catch (error) {
      setMessage("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isValidToken && tokenData.token === "" && tokenData.userType === "") {
    return (
      <div className="w-full md:w-1/2 bg-white p-4 md:p-8 flex flex-col justify-center items-center min-h-screen">
        <div className="w-full max-w-sm sm:max-w-md md:max-w-lg">
          <div className="flex items-center justify-center mb-6">
            <img
              src={Logo || "/placeholder.svg"}
              alt="Logo"
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
          <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-md text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">
              Invalid Reset Link
            </h1>
            <p className="text-gray-600 mb-4">
              This reset link is invalid or has expired. Please request a new
              password reset.
            </p>
            <button
              onClick={() => navigate("/ForgotPassword")}
              className="w-full bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 transition"
            >
              Request New Reset Link
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full md:w-1/2 bg-white p-4 md:p-8 flex flex-col justify-center items-center min-h-screen">
      <div className="w-full max-w-sm sm:max-w-md md:max-w-lg">
        <div className="flex items-center justify-center mb-6">
          <img
            src={Logo || "/placeholder.svg"}
            alt="Logo"
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

        <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-md">
          <h1 className="text-2xl font-bold text-green-600 mb-4 text-center">
            Reset Password
          </h1>

          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 text-blue-800 rounded-lg text-sm">
            <p>
              <strong>Account Type:</strong> {tokenData.userType}
            </p>
          </div>

          {message && (
            <div
              className={`text-center mb-4 p-3 border rounded-lg ${
                message.includes("success") || message.includes("updated")
                  ? "bg-green-50 border-green-200 text-green-800"
                  : "bg-red-50 border-red-200 text-red-800"
              }`}
            >
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                New Password
              </label>
              <input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="Enter your new password"
                className={`w-full p-2 border rounded-lg ${
                  errors.newPassword ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.newPassword && (
                <p className="text-red-500 text-sm">{errors.newPassword}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Confirm New Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your new password"
                className={`w-full p-2 border rounded-lg ${
                  errors.confirmPassword ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
            >
              {isLoading ? "Updating Password..." : "Update Password"}
            </button>
          </form>

          <div className="mt-4 text-center">
            <button
              onClick={() => navigate("/Login")}
              className="text-green-600 hover:text-green-700 text-sm underline"
            >
              {/* Back to Login */}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
