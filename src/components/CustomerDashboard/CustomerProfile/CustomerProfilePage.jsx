import React, { useState, useEffect } from "react";
import { ChevronDown, Upload } from "lucide-react";
import CountryDropdown from "../../SellerDashboard/SellerProfile/CountryDropdown";

const CustomerProfilePage = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    address: "",
    contactNumber: "",
    country: "",
    postalCode: "", // <-- Add this line
  });

  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  // Store the original email from localStorage
  const originalEmail = sessionStorage.getItem("userEmail");

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Full Name is required";
    // Email validation removed since it's read-only
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.contactNumber.trim())
      newErrors.contactNumber = "Contact Number is required";
    else if (!/^\d{7,15}$/.test(formData.contactNumber))
      newErrors.contactNumber = "Contact Number must be 7-15 digits";
    if (!formData.country.trim()) newErrors.country = "Country is required";
    if (!formData.postalCode.trim())
      newErrors.postalCode = "Postal Code is required"; // <-- Add this line
    else if (!/^[A-Za-z0-9\- ]{3,10}$/.test(formData.postalCode))
      newErrors.postalCode = "Postal Code is invalid"; // <-- Add this line
    return newErrors;
  };

  useEffect(() => {
    // Get email from user object in localStorage
    const userString = sessionStorage.getItem("user");
    let email = null;

    if (userString) {
      try {
        const user = JSON.parse(userString);
        email = user.email;
        console.log("User object from localStorage:", user); // Debug log
      } catch (error) {
        console.error("Error parsing user from localStorage:", error);
      }
    }

    // Fallback to old method for backward compatibility
    if (!email) {
      email = sessionStorage.getItem("userEmail");
    }

    console.log("Email to use:", email); // Debug log
    console.log(
      "All localStorage items:",
      Object.keys(sessionStorage).map((key) => ({
        key,
        value: sessionStorage.getItem(key),
      }))
    ); // Debug log

    if (!email) {
      setLoading(false);
      setToast({
        show: true,
        message: "No user email found. Please login again.",
        type: "error",
      });
      return;
    }

    console.log("Fetching profile for email:", email); // Debug log

    fetch("http://localhost/backend/get_customer_profile.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    })
      .then((res) => {
        console.log("Response status:", res.status); // Debug log
        return res.json();
      })
      .then((data) => {
        console.log("Profile data received:", data); // Debug log

        if (data.success && data.profile) {
          setFormData((prev) => ({
            ...prev,
            fullName: data.profile.full_name || "",
            email: data.profile.email || "",
            address: data.profile.address || "",
            contactNumber: data.profile.contactno || "",
            country: data.profile.country || "",
            postalCode: data.profile.postal_code || "", // <-- Add this line
          }));

          if (data.profile.profile_image) {
            setProfileImage(data.profile.profile_image);
          }
        } else {
          console.log("Profile fetch failed:", data.message); // Debug log
          console.log("Debug info:", data.debug); // Debug log
          if (data.all_emails) {
            console.log("Available emails in database:", data.all_emails); // Debug log
          }
          setToast({
            show: true,
            message:
              "Failed to load profile: " + (data.message || "Unknown error"),
            type: "error",
          });
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Profile fetch error:", error); // Debug log
        setToast({
          show: true,
          message: "Network error while loading profile.",
          type: "error",
        });
        setLoading(false);
      });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(URL.createObjectURL(file));
    }
  };

  const handleSaveProfile = () => {
    const validationErrors = validateForm();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      setToast({
        show: true,
        message: "Please fix the errors in the form.",
        type: "error",
      });
      setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
      return;
    }

    setSaving(true);

    // Get original email from user object in localStorage
    const userString = sessionStorage.getItem("user");
    let originalEmail = null;

    if (userString) {
      try {
        const user = JSON.parse(userString);
        originalEmail = user.email;
      } catch (error) {
        console.error("Error parsing user from localStorage:", error);
      }
    }

    // Fallback to old method for backward compatibility
    if (!originalEmail) {
      originalEmail = sessionStorage.getItem("userEmail");
    }

    const requestData = {
      ...formData,
      originalEmail: originalEmail, // Send original email for comparison
    };

    console.log("Sending update request:", requestData); // Debug log

    fetch("http://localhost/backend/update_customer_profile.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestData),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Update response:", data); // Debug log

        if (data.success) {
          setToast({
            show: true,
            message: "Profile updated successfully!",
            type: "success",
          });

          // Email cannot be changed, so no need to update localStorage
        } else {
          setToast({
            show: true,
            message:
              "Failed to update profile: " + (data.message || "Unknown error"),
            type: "error",
          });
        }
        setSaving(false);
        setTimeout(
          () => setToast({ show: false, message: "", type: "" }),
          3000
        );
      })
      .catch((error) => {
        console.error("Update error:", error); // Debug log
        setToast({
          show: true,
          message: "Network error. Please try again.",
          type: "error",
        });
        setSaving(false);
        setTimeout(
          () => setToast({ show: false, message: "", type: "" }),
          3000
        );
      });
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 max-w-4xl mx-auto">
      {/* Toast notification */}
      {toast.show && (
        <div
          className={`mb-4 px-4 py-3 rounded text-center text-white ${
            toast.type === "success" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {toast.message}
        </div>
      )}
      <h2 className="text-3xl font-bold text-green-600 text-center mb-8">
        Customer Profile
      </h2>
      {loading ? (
        <div className="text-center text-gray-500 py-12">
          Loading profile...
        </div>
      ) : (
        <div className="pl-16 pr-16">
          {/* Form Section */}
          <div className="space-y-6">
            {/* Full Name */}
            <div>
              <label className="block text-gray-600 font-medium mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                className={`w-full px-4 py-2 bg-gray-50 border ${
                  errors.fullName ? "border-red-500" : "border-gray-200"
                } rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300`}
              />
              {errors.fullName && (
                <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-gray-600 font-medium mb-2 flex items-center">
                Email
                <span className="ml-2 px-2 py-1 text-xs bg-gray-200 text-gray-600 rounded-full">
                  Read Only
                </span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                className={`w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-full focus:outline-none transition-all duration-300 cursor-not-allowed`}
                readOnly
                disabled
              />
              <p className="text-sm text-gray-500 mt-1 flex items-center">
                <svg
                  className="w-4 h-4 mr-1 text-blue-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
                Email address cannot be changed for security reasons
              </p>
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* Address */}
            <div>
              <label className="block text-gray-600 font-medium mb-2">
                Address
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Enter your Address"
                rows="3"
                className={`w-full px-4 py-2 bg-gray-50 border ${
                  errors.address ? "border-red-500" : "border-gray-200"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 resize-none`}
              />
              {errors.address && (
                <p className="text-red-500 text-sm mt-1">{errors.address}</p>
              )}
            </div>

            {/* Postal Code */}
            <div>
              <label className="block text-gray-600 font-medium mb-2">
                Postal Code
              </label>
              <input
                type="text"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleInputChange}
                placeholder="Enter your postal code"
                className={`w-full px-4 py-2 bg-gray-50 border ${
                  errors.postalCode ? "border-red-500" : "border-gray-200"
                } rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300`}
              />
              {errors.postalCode && (
                <p className="text-red-500 text-sm mt-1">{errors.postalCode}</p>
              )}
            </div>

            {/* Contact Number */}
            <div>
              <label className="block text-gray-600 font-medium mb-2">
                Contact Number
              </label>
              <input
                type="tel"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleInputChange}
                placeholder="Enter your contact number"
                className={`w-full px-4 py-2 bg-gray-50 border ${
                  errors.contactNumber ? "border-red-500" : "border-gray-200"
                } rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300`}
              />
              {errors.contactNumber && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.contactNumber}
                </p>
              )}
            </div>

            {/* Country */}
            <CountryDropdown
              value={formData.country}
              onChange={(country) =>
                setFormData((prev) => ({ ...prev, country }))
              }
              error={errors.country}
            />
          </div>

          {/* Image Upload Section */}
          <div className="lg:pl-3">
            <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center bg-gray-50 hover:bg-gray-100 transition-colors duration-300">
              <div className="mb-6">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="w-15 h-15 rounded-full object-cover mx-auto border-4 border-green-200 shadow-lg"
                  />
                ) : (
                  <div className="w-15 h-15 rounded-full bg-green-100 mx-auto flex items-center justify-center border-4 border-green-200">
                    <Upload size={40} className="text-green-500" />
                  </div>
                )}
              </div>

              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Upload Profile Photo
              </h3>
              <p className="text-gray-500 mb-4">
                Click to upload or drag and drop
              </p>
              <p className="text-sm text-gray-400 mb-6">
                Maximum file size: 1MB
              </p>

              <label className="inline-block">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <span className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg cursor-pointer transition-colors duration-300 inline-flex items-center gap-2">
                  <Upload size={16} />
                  Upload
                </span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Save Button */}
      <div className="mt-8 text-right mr-15">
        <button
          onClick={handleSaveProfile}
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 hover:shadow-lg disabled:opacity-50"
          disabled={saving}
        >
          {saving ? "Saving..." : "Save Profile"}
        </button>
      </div>
    </div>
  );
};

export default CustomerProfilePage;
