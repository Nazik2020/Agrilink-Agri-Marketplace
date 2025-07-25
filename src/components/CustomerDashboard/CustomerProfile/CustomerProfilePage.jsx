import React, { useState } from 'react';
import { ChevronDown, Upload } from 'lucide-react';
import CountryDropdown from '../../SellerDashboard/SellerProfile/CountryDropdown';

const CustomerProfilePage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    address: '',
    contactNumber: '',
    country: ''
  });

  const [profileImage, setProfileImage] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(URL.createObjectURL(file));
    }
  };

  const handleSaveProfile = () => {
    console.log('Profile saved:', formData);
    // Handle profile save logic here
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-green-600 text-center mb-8">Customer Profile</h2>
      
      <div className= "pl-16 pr-16">
        {/* Form Section */}
        <div className="space-y-6">
          {/* Full Name */}
          <div>
            <label className="block text-gray-600 font-medium mb-2">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              placeholder="Enter your full name"
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-600 font-medium mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
            />
          </div>

          {/* Address */}
          <div>
            <label className="block text-gray-600 font-medium mb-2">Address</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="Enter your Address"
              rows="3"
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 resize-none"
            />
          </div>

          {/* Contact Number */}
          <div>
            <label className="block text-gray-600 font-medium mb-2">Contact Number</label>
            <input
              type="tel"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleInputChange}
              placeholder="Enter your contact number"
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
            />
          </div>

          {/* Country */}
          <CountryDropdown
            value={formData.country}
            onChange={(country) => setFormData(prev => ({ ...prev, country }))}
            error={null}
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
            
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Upload Profile Photo</h3>
            <p className="text-gray-500 mb-4">Click to upload or drag and drop</p>
            <p className="text-sm text-gray-400 mb-6">Maximum file size: 1MB</p>
            
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

      {/* Save Button */}
      <div className="mt-8 text-right mr-15">
        <button
          onClick={handleSaveProfile}
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
        >
          Save Profile
        </button>
      </div>
    </div>
  );
};

export default CustomerProfilePage;