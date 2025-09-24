import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Logo from "../../assets/Login/AgriLink.png";
import authService from "../../services/AuthService";

export default function RightSection() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [remember, setRemember] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleRememberChange = (e) => {
    setRemember(e.target.checked);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setIsLoading(true);

    try {
      const res = await axios.post(
        "http://localhost/Agrilink-Agri-Marketplace/backend/Login.php",
        {
          email: formData.email,
          password: formData.password,
          rememberMe: formData.rememberMe,
        },
        { withCredentials: true }
      );

      if (res.data.success) {
        setMessage(res.data.message);

        // Use AuthService to handle login
        authService.handleSuccessfulAuth(res.data.user);

        // Set seller_id in localStorage if user is a seller
        if (
          res.data.user &&
          res.data.user.role === "seller" &&
          res.data.user.id
        ) {
          window.localStorage.setItem("seller_id", res.data.user.id);
        }

        // Sync guest wishlist if user is a customer
        if (res.data.user && res.data.user.role === "customer") {
          await syncGuestWishlist(res.data.user.id);
        }

        setTimeout(() => {
          if (res.data.user.role === "admin") {
            navigate("/admin-dashboard");
          } else if (res.data.user.role === "seller") {
            navigate("/marketplace"); // Redirect sellers to marketplace
          } else if (res.data.user.role === "customer") {
            navigate("/marketplace"); // Redirect customers to marketplace
          } else {
            navigate("/");
          }
        }, 2000);
      } else {
        setMessage(res.data.message);
      }
    } catch (error) {
      console.error("Login error:", error);
      if (error.response) {
        setMessage(error.response.data?.message || "Server error occurred");
      } else if (error.request) {
        setMessage("Network error. Please check your connection.");
      } else {
        setMessage("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Function to sync guest wishlist
  const syncGuestWishlist = async (customerId) => {
    try {
      console.log(
        "Login: Starting guest wishlist sync for customer ID:",
        customerId
      );

      // Get guest wishlist from localStorage
      const guestWishlist = JSON.parse(
        localStorage.getItem("guestWishlist") || "[]"
      );
      console.log("Login: Guest wishlist from localStorage:", guestWishlist);

      if (guestWishlist.length > 0) {
        console.log("Login: Found", guestWishlist.length, "items to sync");

        // Sync to backend
        const syncRes = await axios.post(
          "http://localhost/Agrilink-Agri-Marketplace/backend/sync_guest_wishlist.php",
          {
            customerId: customerId,
            productIds: guestWishlist,
          }
        );

        console.log("Login: Sync API response:", syncRes.data);

        if (syncRes.data.success) {
          console.log(
            "Login: Guest wishlist synced successfully:",
            syncRes.data.summary
          );
          // Clear guest wishlist from localStorage
          localStorage.removeItem("guestWishlist");
          console.log("Login: Guest wishlist cleared from localStorage");
        } else {
          console.error("Login: Sync failed:", syncRes.data.message);
        }
      } else {
        console.log("Login: No guest wishlist items to sync");
      }
    } catch (error) {
      console.error("Login: Error syncing guest wishlist:", error);
      console.error(
        "Login: Error details:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <div className="w-full md:w-1/2 bg-white p-4 md:p-8 flex flex-col justify-center items-center">
      <div className="w-full max-w-sm sm:max-w-md md:max-w-lg">
        <div className="flex items-center justify-center mb-6">
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

        <div
          className="bg-gray-100 bg-opacity-30 rounded-lg p-6"
          style={{
            background: "rgba(239, 243, 240, 0.06)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.18)",
            boxShadow: "4px 10px 10px 0 rgba(31, 135, 71, 0.1)",
          }}
        >
          <div className="text-center mb-6" style={{ paddingTop: "10px" }}>
            <h1 className="text-2xl sm:text-3xl font-bold text-green-600 mb-2">
              Welcome Back!
            </h1>
            <h2 className="text-lg sm:text-xl font-bold text-green-500">
              Log In
            </h2>
          </div>

          {message && (
            <div
              className={`text-center mb-4 p-3 rounded-lg border ${
                message.includes("successful")
                  ? "bg-green-50 text-green-800 border-green-200"
                  : "bg-red-50 text-red-800 border-red-200"
              }`}
            >
              <div className="flex items-center justify-center">
                {message.includes("successful") && (
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

          <form
            className="space-y-4"
            style={{ padding: "10px 30px 20px 30px" }}
            onSubmit={handleSubmit}
          >
            <div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                className={`w-full p-2 sm:p-3 border rounded-lg ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>
            <div>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
                className={`w-full p-2 sm:p-3 border rounded-lg ${
                  errors.password ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
            </div>

            {/* Remember Me checkbox */}
            <div className="flex items-center justify-between mt-3">
              <label className="inline-flex items-center gap-2 select-none">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={handleRememberChange}
                  className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <span className="text-sm text-gray-700">Remember Me</span>
              </label>

              <Link
                to="/ForgotPassword"
                className="text-green-600 text-sm"
              >
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gray-200 text-gray-500 p-2 sm:p-3 rounded-lg hover:bg-green-600 hover:text-white shadow-lg hover:shadow-xl disabled:opacity-50"
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>

            <p className="text-center text-sm text-gray-500 mt-2">
              Don't have an account?{" "}
              <Link to="/Welcoming" className="text-green-600 font-bold">
                Sign up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

// Keys used here should be cleared by logout: 'remember', possibly 'customer','seller','token'