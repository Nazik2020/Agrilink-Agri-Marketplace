import React, { useState } from 'react';
//import Sidebar from '../MainSidebar/Sidebar';
import ProfileForm from './ProfileForm';

const ProfilePage = () => {
  const [profile, setProfile] = useState({
    contactName: 'Sarah Miller',
    businessName: 'ECOLanka pvt ltd',
    businessDescription: 'Brief description of your business...',
    country: 'Sri Lanka',
    contactNumber: '+94 123456789',
    email: 'ecolankapvt@gmail.com',
    address: 'Enter company address',
  });

  const handleProfileChange = (updatedProfile) => {
    setProfile(updatedProfile);
  };

  const handleFileUpload = (file) => {
    console.log('File uploaded:', file.name);
  };

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