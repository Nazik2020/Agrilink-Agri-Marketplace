import React, { useState } from 'react';
import NotificationCard from './NotificationCard';
import NotificationDetailsModal from './NotificationDetailsModel';
import { Bell, Package } from 'lucide-react';


const NotificationsList = ({ notifications: initialNotifications = [] }) => {
  const [notifications, setNotifications] = useState(initialNotifications);

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

  // Only show new notifications (isNew)
  const newNotifications = notifications.filter(n => n.isNew);
  // All notifications that are not new
  const allNotifications = notifications.filter(n => !n.isNew);

  // Mark notification as read
  const handleMarkRead = async (id) => {
    try {
  await fetch('http://localhost/Agrilink-Agri-Marketplace/backend/notifications/mark_notification_read.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notification_id: id })
      });
      setNotifications(notifications.map(notif =>
        notif.id === id ? { ...notif, isNew: false } : notif
      ));
    } catch (err) {
      alert('Failed to mark notification as read');
    }
  };

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

        {/* New Notifications */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-green-700 mb-4">
            New Notifications
            {newNotifications.length > 0 && (
              <span className="ml-2 bg-red-500 text-white text-sm px-2 py-1 rounded-full">
                {newNotifications.length}
              </span>
            )}
          </h3>
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
                  onMarkRead={handleMarkRead}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-xl">
              <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No new notifications</p>
            </div>
          )}
        </div>

        {/* All Notifications (Processed) */}
        <div>            
          <h3 className="text-xl font-semibold text-green-700 mb-4">
            All Notifications
            {allNotifications.length > 0 && (
              <span className="ml-2 bg-gray-500 text-white text-sm px-2 py-1 rounded-full">
                {allNotifications.length}
              </span>
            )}
          </h3>
          
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