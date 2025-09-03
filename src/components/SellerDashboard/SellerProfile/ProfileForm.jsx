import React, { useState, useEffect } from "react";
import { CheckCircle, XCircle, X } from 'lucide-react';
// Custom PopupMessage Component
const PopupMessage = ({ message, type, onClose }) => {
  if (!message) return null;
  const isSuccess = type === 'success';
  const bgColor = isSuccess ? 'bg-green-50' : 'bg-red-50';
  const borderColor = isSuccess ? 'border-green-200' : 'border-red-200';
  const textColor = isSuccess ? 'text-green-800' : 'text-red-800';
  const iconColor = isSuccess ? 'text-green-600' : 'text-red-600';
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-green-50/50 z-50">
      <div className={`${bgColor} ${borderColor} border rounded-xl p-6 max-w-md w-full mx-4 shadow-lg`}>
        <div className="flex items-start space-x-3">
          <div className={`${iconColor} flex-shrink-0 mt-0.5`}>
            {isSuccess ? (
              <CheckCircle className="h-6 w-6" />
            ) : (
              <XCircle className="h-6 w-6" />
            )}
          </div>
          <div className="flex-1">
            <p className={`${textColor} text-sm font-medium leading-relaxed`}>
              {message}
            </p>
          </div>
          <button
            onClick={onClose}
            className={`${textColor} hover:opacity-70 transition-opacity flex-shrink-0`}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              isSuccess 
                ? 'bg-green-600 hover:bg-green-700 text-white' 
                : 'bg-red-600 hover:bg-red-700 text-white'
            }`}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};
import axios from "axios";
import ProfileFormField from "./ProfileFormField";
import CountryDropdown from "./CountryDropdown";
import FileUploader from "../AddProduct/FileUploader";

const ProfileForm = ({ profile, onChange, onUpload }) => {
  const [errors, setErrors] = useState({});
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);

  // Set logo preview when profile loads with existing logo
  useEffect(() => {
    if (profile.business_logo) {
      setLogoPreview(`http://localhost/Agrilink-Agri-Marketplace/backend/${profile.business_logo}`);
    }
  }, [profile.business_logo]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onChange({ ...profile, [name]: value });
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleCountryChange = (country) => {
    onChange({ ...profile, country });
    setErrors((prev) => ({ ...prev, country: "" }));
  };

  const handleLogoUpload = (file) => {
    setLogoFile(file);
    // Create preview URL for the selected file
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setLogoPreview(previewUrl);
    }
    if (onUpload) onUpload(file);
  };

  const validateForm = () => {
    const newErrors = {};
    const requiredFields = [
      "contactName",
      "businessName",
      "businessDescription",
      "country",
      "contactNumber",
      "address",
    ]; // Removed email from required fields

    requiredFields.forEach((field) => {
      if (!profile[field] || profile[field].trim() === "") {
        newErrors[field] = "This field is required.";
      }
    });

    // Email validation removed since it's read-only

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const [popupMessage, setPopupMessage] = useState(null);
  const [popupType, setPopupType] = useState('success');
  const showPopup = (message, type = 'success') => {
    setPopupMessage(message);
    setPopupType(type);
  };
  const closePopup = () => {
    setPopupMessage(null);
    setPopupType('success');
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      // Get seller_id from localStorage
      const sellerId = window.localStorage.getItem("seller_id") || profile.id;

      if (!sellerId) {
        showPopup("Seller ID not found. Please login again.", 'error');
        return;
      }

      const formData = new FormData();
      formData.append("seller_id", sellerId);
      formData.append("username", profile.contactName);
      formData.append("business_name", profile.businessName);
      formData.append("business_description", profile.businessDescription);
      formData.append("country", profile.country);
      formData.append("contact_number", profile.contactNumber);
      // Email field removed since it cannot be changed
      formData.append("address", profile.address);
      if (logoFile) formData.append("business_logo", logoFile);

      try {
        const res = await axios.post(
          "http://localhost/Agrilink-Agri-Marketplace/backend/update_seller_profile.php",
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        if (res.data.success) {
          showPopup("Profile Saved Successfully!", 'success');
          // Always update sessionStorage seller object for sidebar (even if logo not changed)
          try {
            const seller = JSON.parse(sessionStorage.getItem("seller")) || {};
            seller.username = profile.contactName;
            seller.business_name = profile.businessName;
            seller.business_description = profile.businessDescription;
            seller.country = profile.country;
            seller.contact_number = profile.contactNumber;
            seller.address = profile.address;
            // Update logo if changed
            if (res.data.logo_path) {
              seller.business_logo = res.data.logo_path;
              onChange({ ...profile, business_logo: res.data.logo_path });
              setLogoPreview(`http://localhost/Agrilink-Agri-Marketplace/backend/${res.data.logo_path}`);
            }
            sessionStorage.setItem("seller", JSON.stringify(seller));
            window.dispatchEvent(new Event("storage"));
          } catch (e) {}
        } else {
          showPopup("Profile update failed! " + (res.data.message || ""), 'error');
          console.log(res.data);
        }
      } catch (err) {
        showPopup("Error updating profile", 'error');
        console.log(err.response?.data || err.message);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-4xl font-bold text-green-600 mb-8 text-center">
          Seller Profile
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            <ProfileFormField
              label="Contact Name"
              name="contactName"
              value={profile.contactName}
              onChange={handleInputChange}
              error={errors.contactName}
              required
            />

            <ProfileFormField
              label="Business Name"
              name="businessName"
              value={profile.businessName}
              onChange={handleInputChange}
              error={errors.businessName}
              required
            />

            <div className="space-y-2">
              <label className="block text-base font-semibold text-gray-500">
                Business Description *
              </label>
              <textarea
                name="businessDescription"
                value={profile.businessDescription}
                onChange={handleInputChange}
                rows="4"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 hover:border-green-400 hover:shadow-md resize-none"
                placeholder="Brief description of your business..."
              />
              {errors.businessDescription && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.businessDescription}
                </p>
              )}
            </div>

            <CountryDropdown
              value={profile.country}
              onChange={handleCountryChange}
              error={errors.country}
            />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <ProfileFormField
              label="Contact Number"
              name="contactNumber"
              value={profile.contactNumber}
              onChange={handleInputChange}
              error={errors.contactNumber}
              required
            />

            <div className="space-y-2">
              <label className="block text-base font-semibold text-gray-500 flex items-center">
                Email
                <span className="ml-2 px-2 py-1 text-xs bg-gray-200 text-gray-600 rounded-full">
                  Read Only
                </span>
              </label>
              <input
                type="email"
                name="email"
                value={profile.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-xl focus:outline-none transition-all duration-300 cursor-not-allowed"
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

            <ProfileFormField
              label="Address"
              name="address"
              value={profile.address}
              onChange={handleInputChange}
              error={errors.address}
              required
            />
          </div>
        </div>

        {/* File Uploader */}
        <div className="mt-8">
          <label className="block text-base font-semibold text-gray-500 mb-4">
            Business Logo
          </label>

          {/* Logo Preview */}
          {logoPreview && (
            <div className="mb-4 flex justify-center">
              <div className="relative">
                <img
                  src={logoPreview}
                  alt="Business Logo"
                  className="w-32 h-32 object-cover rounded-lg border-2 border-green-200 shadow-md"
                />
                <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
                  ✓
                </div>
              </div>
            </div>
          )}

          <FileUploader onUpload={handleLogoUpload} />
        </div>

        {/* Save Button */}
        <div className="flex justify-end mt-8">
          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-green-500 text-white font-semibold rounded-xl hover:bg-green-600 hover:shadow-lg transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            Save Profile
          </button>
        </div>
        <PopupMessage
          message={popupMessage}
          type={popupType}
          onClose={closePopup}
        />
      </div>
    </div>
  );
};

export default ProfileForm;
