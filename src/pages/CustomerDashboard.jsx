// src/pages/CustomerDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import CustomerSidebar from '../components/CustomerDashboard/MainSidebar/CustomerSidebar';
import { FaBars, FaTimes, FaUser, FaHeart, FaShoppingBag, FaBell, FaSignOutAlt } from 'react-icons/fa';
import { FaArchive } from 'react-icons/fa';
import customer from '../assets/CustomerDashboard/3412435.jpg';

const CustomerDashboard = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [profileImage, setProfileImage] = useState(null);

  // Helper to build image URL
  const buildImgUrl = (raw) => {
    if (!raw) return null;
    if (/^https?:\/\//i.test(raw)) return raw;
  return `${window.location.origin}/${String(raw).replace(/^\/?/, '')}?t=${Date.now()}`;
  };

  useEffect(() => {
    const loadFromSession = () => {
      try {
        const user = JSON.parse(sessionStorage.getItem('user'));
        if (user) {
          setUsername(user.full_name || user.username || 'Customer');
          if (user.profile_image) {
            setProfileImage(buildImgUrl(user.profile_image));
          } else {
            setProfileImage(null);
          }
        }
      } catch (e) {}
    };
    loadFromSession();
    window.addEventListener('userStateChanged', loadFromSession);
    return () => {
      window.removeEventListener('userStateChanged', loadFromSession);
    };
  }, []);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    console.log('Customer logged out');
    navigate('/marketplace');
  };

  const menuItems = [
    { icon: FaUser, label: 'Profile', path: '/customer-dashboard/profile' },
    { icon: FaHeart, label: 'WishList', path: '/customer-dashboard/wishlist' },
    { icon: FaShoppingBag, label: 'Order History', path: '/customer-dashboard/orders' },
    { icon: FaBell, label: 'Notifications', path: '/customer-dashboard/notifications' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar for large screens */}
      <div className="hidden lg:block">
        <CustomerSidebar />
      </div>

      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 right-4 z-50">
        <button
          className="text-2xl font-normal text-green-600 bg-white p-2 rounded-full shadow border border-gray-200"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden fixed top-0 left-0 w-full bg-white shadow-md z-40 mt-16">
          <div className="px-6 py-4 flex flex-col gap-4 text-base text-black">
            {/* Only show menu items, no profile image/name */}
            {[{ icon: FaUser, label: 'Profile', path: '/customer-dashboard/profile' },
              { icon: FaHeart, label: 'WishList', path: '/customer-dashboard/wishlist' },
              { icon: FaShoppingBag, label: 'Order History', path: '/customer-dashboard/orders' },
              { icon: FaArchive, label: 'Customized Products', path: '/customer-dashboard/customized-products' },
              { icon: FaBell, label: 'Notifications', path: '/customer-dashboard/notifications' }].map((item, index) => {
              const IconComponent = item.icon;
              const isActive = location.pathname === item.path || (location.pathname === '/customer-dashboard' && item.path === '/customer-dashboard/profile');
              return (
                <button
                  key={index}
                  onClick={() => {
                    navigate(item.path);
                    setIsMenuOpen(false);
                  }}
                  className={`flex items-center gap-3 hover:text-green-700 transition-colors font-normal ${
                    isActive ? 'text-green-700' : 'text-black'
                  }`}
                >
                  {IconComponent && <IconComponent className="text-lg" />}
                  <span>{item.label}</span>
                </button>
              );
            })}

            {/* Logout button */}
            <div className="border-t border-gray-200 pt-4 mt-4">
              <button
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
                className="flex items-center gap-3 text-red-600 hover:text-red-700 transition-colors font-normal text-base"
              >
                <FaSignOutAlt className="text-lg" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Page Content */}
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default CustomerDashboard;
