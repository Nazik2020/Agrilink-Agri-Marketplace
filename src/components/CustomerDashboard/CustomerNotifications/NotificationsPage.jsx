// Helper to get icon color based on notification type
function getIconColor(type) {
  if (type.includes('accepted')) return 'bg-green-100';
  if (type.includes('declined')) return 'bg-red-100';
  if (type.includes('customization')) return 'bg-blue-100';
  return 'bg-gray-100';
}
// Helper to get notification color based on type and read status
function getNotificationColor(type, read) {
  if (type.includes('accepted')) return 'bg-green-50 border-green-200';
  if (type.includes('declined')) return 'bg-red-50 border-red-200';
  if (!read) return 'bg-blue-50 border-blue-200';
  return 'bg-white border-gray-200';
}

import React, { useEffect, useState } from 'react';
import { Bell, Package, Heart, ShoppingCart, Gift, Settings, Palette, Check, X, Clock, ShoppingBag } from 'lucide-react';
import authService from '../../../services/AuthService';

const NotificationsPage = () => {
  // Mark notification as read
  const handleMarkRead = async (id) => {
    try {
      await fetch('http://localhost/Agrilink-Agri-Marketplace/backend/notifications/mark_customer_notification_read.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notification_id: id })
      });
      // Re-fetch notifications from backend to ensure UI is in sync
      const currentUser = authService.getCurrentUser();
      let customerId = null;
      if (currentUser && currentUser.role === 'customer') {
        customerId = currentUser.id;
      }
      if (!customerId) return;
      const res = await fetch(`http://localhost/Agrilink-Agri-Marketplace/backend/notifications/get_customer_notifications.php?customerId=${customerId}`);
      const data = await res.json();
      if (data.success) {
        setNotifications(data.notifications.map(n => ({
          ...n,
          read: n.is_read === '1' || n.is_read === 1,
          icon: n.type.includes('customization') ? Package : Bell,
          time: n.created_at
        })));
      }
    } catch (err) {
      alert('Failed to mark notification as read');
    }
  };
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get customer ID from AuthService
    const currentUser = authService.getCurrentUser();
    let customerId = null;
    if (currentUser && currentUser.role === 'customer') {
      customerId = currentUser.id;
    }
    if (!customerId) return;
    fetch(`http://localhost/Agrilink-Agri-Marketplace/backend/notifications/get_customer_notifications.php?customerId=${customerId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setNotifications(data.notifications.map(n => ({
            ...n,
            read: Boolean(Number(n.is_read)),
            icon: n.type.includes('customization') ? Package : Bell,
            time: n.created_at
          })));
        }
        setLoading(false);
      });
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  if (loading) return <div className="p-8 text-center">Loading notifications...</div>;

  return (
    <>
      <div className="min-h-screen bg-gray-50 p-4">
  <div className="bg-white rounded-2xl shadow-lg p-8 max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <Bell className="text-green-600" size={32} />
            <h2 className="text-3xl font-bold text-green-600">Notifications</h2>
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                {unreadCount} new
              </span>
            )}
          </div>
          {/* New Notifications Section */}
          <div className="mb-10">
            <h3 className="text-xl font-semibold text-green-700 mb-4">New Notifications</h3>
            <div className="space-y-4">
              {notifications.filter(n => !n.read).length === 0 ? (
                <div className="text-center py-8 text-gray-400">No new notifications</div>
              ) : (
                notifications.filter(n => !n.read).map((notification) => {
                  const IconComponent = notification.icon;
                  const isCustomization = notification.type.includes('customization');
                  const isSpecialNotice = [
                    'maintenance',
                    'general',
                    'security',
                    'policy',
                    'emergency',
                    'global_alert'
                  ].includes(notification.type);
                  return (
                    <div key={notification.id} className={`border rounded-2xl p-6 transition-all duration-300 hover:shadow-md ${isSpecialNotice ? 'bg-yellow-100 border-yellow-400' : getNotificationColor(notification.type, notification.read)}`}>
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-full bg-white shadow-sm ${getIconColor(notification.type)}`}>
                          <IconComponent size={24} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className={`font-semibold mb-1 text-gray-900`}>
                                {notification.title}
                                <span className="ml-2 w-2 h-2 bg-green-500 rounded-full inline-block"></span>
                              </h3>
                              <p className={`text-sm mb-2 ${isSpecialNotice ? 'bg-yellow-100 text-yellow-900 p-3 rounded-lg font-semibold' : 'text-gray-700'}`}>{notification.message}</p>
                            </div>
                            <span className="text-xs text-gray-500 whitespace-nowrap">{notification.time}</span>
                          </div>
                          {isCustomization && notification.product && (
                            <div className="bg-white bg-opacity-70 rounded-xl p-4 mb-3">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="font-semibold text-gray-800">{notification.product.name}</h4>
                                {getStatusBadge(notification.status)}
                              </div>
                              <p className="text-sm text-gray-600 mb-2"><strong>Customization:</strong> {notification.product.customization}</p>
                              <div className="flex items-center justify-between">
                                <div className="text-sm text-gray-600"><strong>Seller:</strong> {notification.product.seller}</div>
                                <div className="text-lg font-bold text-green-600">${notification.product.price}</div>
                              </div>
                            </div>
                          )}
                          {isCustomization && notification.status === 'accepted' && (
                            <button onClick={() => handlePlaceOrder(notification.product.name)} className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-300 text-sm font-medium">
                              <ShoppingBag size={16} />
                              Place Order
                            </button>
                          )}
                          {isCustomization && notification.status === 'pending' && (
                            <div className="flex items-center gap-2 text-sm text-yellow-600">
                              <Clock size={16} />
                              Waiting for seller response...
                            </div>
                          )}
                          {/* Mark as Read Button */}
                          <button onClick={() => handleMarkRead(notification.id)} className="mt-2 px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors">
                            Mark as Read
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
          {/* All Notifications Section */}
          <div className="border-t border-gray-300 pt-8 mt-8">
                        <h3 className="text-xl font-semibold text-green-700 mb-4">All Notifications</h3>
            <div className="space-y-4">
              {notifications.filter(n => n.read).length === 0 ? (
                <div className="text-center py-8 text-gray-400">No notifications have been marked as read yet.</div>
              ) : (
                notifications.filter(n => n.read).map((notification) => {
                  const IconComponent = notification.icon;
                  const isCustomization = notification.type.includes('customization');
                  const isSpecialNotice = [
                    'maintenance',
                    'general',
                    'security',
                    'policy',
                    'emergency',
                    'global_alert'
                  ].includes(notification.type);
                  return (
                    <div key={notification.id} className={`border rounded-2xl p-6 transition-all duration-300 hover:shadow-md ${isSpecialNotice ? 'bg-yellow-100 border-yellow-400' : getNotificationColor(notification.type, notification.read)}`}>
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-full bg-white shadow-sm ${getIconColor(notification.type)}`}>
                          <IconComponent size={24} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-semibold mb-1 text-gray-700 flex items-center gap-2">
                                {notification.title}
                                <span className="px-2 py-1 text-xs font-semibold bg-red-100 text-red-700 rounded">Marked as Read</span>
                              </h3>
                              <p className={`text-sm mb-2 ${isSpecialNotice ? 'bg-yellow-100 text-yellow-900 p-3 rounded-lg font-semibold' : 'text-gray-600'}`}>{notification.message}</p>
                            </div>
                            <span className="text-xs text-gray-500 whitespace-nowrap">{notification.time}</span>
                          </div>
                          {isCustomization && notification.product && (
                            <div className="bg-white bg-opacity-70 rounded-xl p-4 mb-3">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="font-semibold text-gray-800">{notification.product.name}</h4>
                                {getStatusBadge(notification.status)}
                              </div>
                              <p className="text-sm text-gray-600 mb-2"><strong>Customization:</strong> {notification.product.customization}</p>
                              <div className="flex items-center justify-between">
                                <div className="text-sm text-gray-600"><strong>Seller:</strong> {notification.product.seller}</div>
                                <div className="text-lg font-bold text-green-600">${notification.product.price}</div>
                              </div>
                            </div>
                          )}
                          {isCustomization && notification.status === 'accepted' && (
                            <button onClick={() => handlePlaceOrder(notification.product.name)} className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-300 text-sm font-medium">
                              <ShoppingBag size={16} />
                              Place Order
                            </button>
                          )}
                          {isCustomization && notification.status === 'pending' && (
                            <div className="flex items-center gap-2 text-sm text-yellow-600">
                              <Clock size={16} />
                              Waiting for seller response...
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default NotificationsPage;