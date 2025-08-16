import React, { useState, useEffect } from "react";
import axios from "axios";
//import Sidebar from '../MainSidebar/Sidebar';
import ProfileForm from "./ProfileForm";

const ProfilePage = () => {
  const [profile, setProfile] = useState({
    contactName: "",
    businessName: "",
    businessDescription: "",
    country: "",
    contactNumber: "",
    email: "",
    address: "",
  });
  const [loading, setLoading] = useState(true);

  // Load seller profile data on component mount
  useEffect(() => {
    const loadSellerProfile = async () => {
      try {
        const sellerId = window.localStorage.getItem("seller_id");
        if (!sellerId) {
          alert("Please login as a seller");
          return;
        }

        const response = await axios.get(
          `http://localhost/Agrilink-Agri-Marketplace/backend/get_seller_profile.php?seller_id=${sellerId}`
        );

        if (response.data.success) {
          const sellerData = response.data.seller;
          setProfile({
            contactName: sellerData.username || "",
            businessName: sellerData.business_name || "",
            businessDescription: sellerData.business_description || "",
            country: sellerData.country || "",
            contactNumber: sellerData.contact_number || "",
            email: sellerData.email || "",
            address: sellerData.address || "",
            business_logo: sellerData.business_logo || "",
            id: sellerData.id,
          });
        }
      } catch (error) {
        console.error("Error loading seller profile:", error);
      } finally {
        setLoading(false);
      }
    };

    loadSellerProfile();
  }, []);

  const handleProfileChange = (updatedProfile) => {
    setProfile(updatedProfile);
  };

  const handleFileUpload = (file) => {
    console.log("File uploaded:", file.name);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50 items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/*<Sidebar />*/}
      <div className="flex-1 p-6">
        <ProfileForm
          profile={profile}
          onChange={handleProfileChange}
          onUpload={handleFileUpload}
        />
      </div>
    </div>
  );
};

export default ProfilePage;
