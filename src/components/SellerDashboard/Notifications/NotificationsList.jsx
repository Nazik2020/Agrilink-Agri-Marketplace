import React, { useState } from 'react';
import NotificationCard from './NotificationCard';
import NotificationDetailsModal from './NotificationDetailsModel';
import { Bell, Package } from 'lucide-react';

const NotificationsList = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'New Customization Request',
      customer: 'Sarah Miller',
      product: 'Organic Tomatoes',
      timestamp: '2 hours ago',
      isNew: true,
      status: null
    },
    {
      id: 2,
      title: 'New Customization Request',
      customer: 'David Lee',
      product: 'Free-Range Eggs',
      timestamp: '5 hours ago',
      isNew: true,
      status: null
    },
    {
      id: 3,
      title: 'New Customization Request',
      customer: 'Emily Chen',
      product: 'Artisan Cheeses',
      timestamp: '1 day ago',
      isNew: true,
      status: null
    },
    {
      id: 4,
      title: 'Customization Request',
      customer: 'John Smith',
      product: 'Local Honey',
      timestamp: '2 days ago',
      isNew: false,
      status: 'accepted'
    },
    {
      id: 5,
      title: 'Customization Request',
      customer: 'Maria Garcia',
      product: 'Fresh Vegetables',
      timestamp: '3 days ago',
      isNew: false,
      status: 'rejected'
    }
  ]);

  const [selectedNotification, setSelectedNotification] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAccept = (id) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, status: 'accepted', isNew: false } : notif
    ));
  };

  const handleReject = (id) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, status: 'rejected', isNew: false } : notif
    ));
  };

  const handleViewDetails = (notification) => {
    setSelectedNotification(notification);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedNotification(null);
  };

  // Only show new notifications that haven't been processed
  const newNotifications = notifications.filter(n => n.isNew && !n.status);
  
  // Only show processed notifications (accepted/rejected)
  const allNotifications = notifications.filter(n => !n.isNew && n.status);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        {/* Header */}
        <div className="flex items-center space-x-3 mb-8">
          <div className="p-3 bg-green-100 rounded-full">
            <Bell className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-green-600">Notifications</h1>
        </div>

        {/* New Customization Requests */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            New Customization Requests
            {newNotifications.length > 0 && (
              <span className="ml-2 bg-red-500 text-white text-sm px-2 py-1 rounded-full">
                {newNotifications.length}
              </span>
            )}
          </h2>
          
          {newNotifications.length > 0 ? (
            <div className="space-y-4">
              {newNotifications.map((notification) => (
                <NotificationCard
                  key={notification.id}
                  notification={notification}
                  onAccept={handleAccept}
                  onReject={handleReject}
                  onViewDetails={handleViewDetails}
                  showActions={true}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-xl">
              <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No new customization requests</p>
            </div>
          )}
        </div>

        {/* All Notifications (Processed) */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            All Notifications
            {allNotifications.length > 0 && (
              <span className="ml-2 bg-gray-500 text-white text-sm px-2 py-1 rounded-full">
                {allNotifications.length}
              </span>
            )}
          </h2>
          
          {allNotifications.length > 0 ? (
            <div className="space-y-4">
              {allNotifications.map((notification) => (
                <NotificationCard
                  key={notification.id}
                  notification={notification}
                  onAccept={handleAccept}
                  onReject={handleReject}
                  onViewDetails={handleViewDetails}
                  showActions={false}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-xl">
              <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No processed notifications yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Details Modal */}
      <NotificationDetailsModal
        notification={selectedNotification}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default NotificationsList;