import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Badge } from './ui';
import StatsCards from './StatsCards';
import FAQManagement from './FAQManagement';
import UserManagement from './UserManagement';
import SendAlerts from './SendAlerts';
import ContentModeration from './ContentModeration';
import ActivityMonitor from './ActivityMonitor';
import { Shield, LogOut } from 'lucide-react';

const navigation = [
  { id: 'user-management', name: 'User Management', component: UserManagement },
  { id: 'send-alerts', name: 'Send Alerts', component: SendAlerts },
  { id: 'content-moderation', name: 'Content Moderation', component: ContentModeration },
  { id: 'activity-monitor', name: 'Activity Monitor', component: ActivityMonitor },
  { id: 'faq-management', name: 'FAQ Management', component: FAQManagement }
];

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState(navigation[0].id);
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear any admin session data if needed
    localStorage.removeItem("admin_id");
    localStorage.removeItem("admin_token");
    console.log('Admin logged out');
    navigate('/login');
  };

  const renderContent = () => {
    const currentNav = navigation.find(nav => nav.id === activeSection);
    const Component = currentNav?.component;
    return Component ? <Component /> : null;
  };

  return (
    <div className="min-h-screen bg-background pt-10">
      <div className="border-b bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

          {/* Header section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-3">
                <Shield className="h-8 w-8 text-green-600" />
                <h1 className="text-4xl font-bold text-green-700">Admin Dashboard</h1>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="flex items-center px-4 py-2 rounded-full text-gray-600 hover:bg-red-50 hover:text-red-600 hover:shadow-sm hover:translate-x-1 transition-all duration-300 group"
              >
                <LogOut size={20} className="mr-3 transition-transform duration-300 group-hover:scale-110" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
            <p className="text-lg text-muted-foreground">Monitor and manage Agrilink platform activities</p>
          </div>

          {/* Stats cards always at the top */}
          <div className="mt-8 mb-8">
            <StatsCards />
          </div>
          
          {/* Tab navigation below stats cards */}
          <div className="flex w-full mt-6">
            <nav className="flex flex-row flex-wrap gap-x-4 w-full justify-center">
              {navigation.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`px-6 py-2 rounded-xl font-semibold transition min-w-0 text-sm text-center w-auto sm:flex-1 sm:max-w-xs whitespace-normal
                    ${activeSection === item.id
                      ? 'border-2 border-green-600 text-green-600 bg-white shadow-sm'
                      : 'text-gray-800 bg-white'}
                  `}
                  style={{ minWidth: 0 }}
                >
                  {item.name}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </div>
    </div>
  );
};

export default Dashboard;