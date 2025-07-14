import React from 'react';
//import Sidebar from '../MainSidebar/Sidebar';
import NotificationsList from './NotificationsList';

const NotificationsPage = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
     {/*<Sidebar />*/} 
      <div className="flex-1 p-6">
        <NotificationsList />
      </div>
    </div>
  );
};

export default NotificationsPage;