import React, { useState } from 'react';
import ProfileFormField from './ProfileFormField';
import CountryDropdown from './CountryDropdown';
import FileUploader from '../AddProduct/FileUploader';

const ProfileForm = ({ profile, onChange, onUpload }) => {
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onChange({ ...profile, [name]: value });
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleCountryChange = (country) => {
    onChange({ ...profile, country });
    setErrors((prev) => ({ ...prev, country: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    const requiredFields = [
      'contactName',
      'businessName',
      'businessDescription',
      'country',
      'contactNumber',
      'email',
      'address',
    ];

    requiredFields.forEach((field) => {
      if (!profile[field] || profile[field].trim() === '') {
        newErrors[field] = 'This field is required.';
      }
    });

    // Email validation
    if (profile.email && !/\S+@\S+\.\S+/.test(profile.email)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      alert('Profile Saved Successfully!');
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
                <p className="text-red-500 text-sm mt-1">{errors.businessDescription}</p>
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
            
            <ProfileFormField
              label="Email"
              name="email"
              type="email"
              value={profile.email}
              onChange={handleInputChange}
              error={errors.email}
              required
            />
            
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
          <FileUploader onUpload={onUpload} />
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
      </div>
    </div>
  );
};

export default ProfileForm;