import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { User, Plus, BarChart3, Wallet, Bell, LogOut } from 'lucide-react';
import Image from '../../../assets/SellerDashboard/seller.jpg'; // Adjust the path as necessary
const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    console.log('User logged out');
    navigate('/login');
  };

  const menuItems = [
  { icon: User, label: 'Profile', path: '/seller-dashboard/profile' },
  { icon: Plus, label: 'Add Product', path: '/seller-dashboard/add-product' },
  { icon: BarChart3, label: 'Analytics', path: '/seller-dashboard/analytics' },
  { icon: Wallet, label: 'Wallet', path: '/seller-dashboard/wallet' },
  { icon: Bell, label: 'Notifications', path: '/seller-dashboard/notifications' },
];

  return (
    <div className="w-90 bg-white shadow-lg min-h-screen p-6">
      {/* Profile Section */}
      <div className="flex flex-col items-center mb-8 mt-5">
        <div className="relative mb-4">
          <img 
            src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop"
            alt="Sarah Miller" 
            className="w-30 h-30 rounded-full object-cover border-4 border-green-100 shadow-lg"
          />
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
        </div>
        <h3 className="text-xl font-bold text-green-600 mb-1">Sarah Miller</h3>
        <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">Seller</span>
      </div>

      {/* Navigation Menu */}
      <nav className="space-y-2 mb-8">
        {menuItems.map((item, index) => {
          const IconComponent = item.icon;
          const isActive = location.pathname === item.path || (location.pathname === '/' && item.path === '/profile');
          
          return (
            <Link
              key={index}
              to={item.path}
              className={`flex items-center px-4 py-2 rounded-full transition-all duration-300 group ${
                isActive 
                  ? 'bg-green-100 text-green-700 shadow-md' 
                  : 'text-gray-600 hover:bg-green-50 hover:text-green-600 hover:shadow-sm hover:translate-x-1'
              }`}
            >
              <IconComponent 
                size={20} 
                className={`mr-3 transition-transform duration-300 ${
                  isActive ? 'text-green-600' : 'group-hover:scale-110'
                }`} 
              />
              <span className="font-medium">{item.label}</span>
              {isActive && (
                <div className="ml-auto w-2 h-2 bg-green-500 rounded-full"></div>
              )}
            </Link>
          );
        })}
        
        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-2 rounded-full text-gray-600 hover:bg-red-50 hover:text-red-600 hover:shadow-sm hover:translate-x-1 transition-all duration-300 group"
        >
          <LogOut size={20} className="mr-3 transition-transform duration-300 group-hover:scale-110" />
          <span className="font-medium">Logout</span>
        </button>
      </nav>

      {/* Motivational Section */}
      <div className="mt-30 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100">
        <div className="flex justify-center mb-4">
          <img 
            src={Image}
            alt="Motivation" 
            className="w-30 h-30 rounded-full object-cover border-3 border-green-200"
          />
        </div>
        <div className="space-y-3 text-center">
          <p className="text-base text-gray-600 italic leading-relaxed">
            "Quality products, exceptional service — every time."
          </p>
          <p className="text-lg text-gray-600 italic leading-relaxed">
            "Selling with a smile — always."
          </p>
          <p className="text-base text-gray-600 italic leading-relaxed">
            "Your satisfaction is my priority."
          </p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;