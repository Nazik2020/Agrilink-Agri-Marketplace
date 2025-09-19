import React, { useEffect, useState } from 'react';
import NotificationsList from './NotificationsList';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get seller ID from sessionStorage
    const userString = sessionStorage.getItem('user');
    let sellerId = null;
    if (userString) {
      const user = JSON.parse(userString);
      if (user.role === 'seller') sellerId = user.id;
    }
    if (!sellerId) return;
  fetch(`http://localhost/Agrilink-Agri-Marketplace/backend/notifications/get_seller_notifications.php?sellerId=${sellerId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setNotifications(data.notifications.map(n => ({
            ...n,
            isNew: n.is_read === '0' || n.is_read === 0,
            status: n.status || null
          })));
        }
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-8 text-center">Loading notifications...</div>;

  return <NotificationsList notifications={notifications} />;
};

export default NotificationsPage;