import React, { useState } from 'react';
import { Bell, Package, Heart, ShoppingCart, Gift, Settings, Palette, Check, X, Clock, ShoppingBag } from 'lucide-react';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'customization_accepted',
      title: 'Customization Request Accepted',
      message: 'Your custom engraving request for "Premium Wooden Cutting Board" has been accepted by FreshMart Store',
      time: '30 minutes ago',
      read: false,
      icon: Palette,
      product: {
        name: 'Premium Wooden Cutting Board',
        customization: 'Custom engraving: "Chef\'s Kitchen 2024"',
        price: 45.99,
        seller: 'FreshMart Store'
      },
      status: 'accepted'
    },
    {
      id: 2,
      type: 'customization_pending',
      title: 'Customization Request Sent',
      message: 'Your custom packaging request for "Organic Honey Set" is being reviewed',
      time: '2 hours ago',
      read: false,
      icon: Palette,
      product: {
        name: 'Organic Honey Set',
        customization: 'Custom gift packaging with personalized message',
        price: 28.50,
        seller: 'NatureBee Co.'
      },
      status: 'pending'
    },
    {
      id: 3,
      type: 'customization_declined',
      title: 'Customization Request Declined',
      message: 'Your custom size request for "Ceramic Dinner Plates" couldn\'t be fulfilled',
      time: '1 day ago',
      read: false,
      icon: Palette,
      product: {
        name: 'Ceramic Dinner Plates',
        customization: 'Custom size: 12-inch diameter plates',
        price: 89.99,
        seller: 'ArtCraft Store'
      },
      status: 'declined'
    },
    
    {
      id: 5,
      type: 'customization_accepted',
      title: 'Customization Request Accepted',
      message: 'Your custom color request for "Handwoven Basket" has been approved',
      time: '3 days ago',
      read: true,
      icon: Palette,
      product: {
        name: 'Handwoven Basket',
        customization: 'Custom color: Deep Navy Blue',
        price: 34.99,
        seller: 'CraftWorld'
      },
      status: 'accepted'
    }
  ]);

  const getNotificationColor = (type, read) => {
    if (!read) {
      switch (type) {
        case 'customization_accepted':
          return 'bg-green-50 border-green-200';
        case 'customization_pending':
          return 'bg-yellow-50 border-yellow-200';
        case 'customization_declined':
          return 'bg-red-50 border-red-200';
        case 'order':
          return 'bg-blue-50 border-blue-200';
        case 'promotion':
          return 'bg-purple-50 border-purple-200';
        case 'wishlist':
          return 'bg-pink-50 border-pink-200';
        case 'cart':
          return 'bg-orange-50 border-orange-200';
        default:
          return 'bg-gray-50 border-gray-200';
      }
    }
    return 'bg-white border-gray-200';
  };

  const getIconColor = (type) => {
    switch (type) {
      case 'customization_accepted':
        return 'text-green-500';
      case 'customization_pending':
        return 'text-yellow-500';
      case 'customization_declined':
        return 'text-red-500';
      case 'order':
        return 'text-blue-500';
      case 'promotion':
        return 'text-purple-500';
      case 'wishlist':
        return 'text-pink-500';
      case 'cart':
        return 'text-orange-500';
      default:
        return 'text-gray-500';
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'accepted':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <Check size={12} />
            Accepted
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock size={12} />
            Pending Review
          </span>
        );
      case 'declined':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <X size={12} />
            Declined
          </span>
        );
      default:
        return null;
    }
  };

  const handlePlaceOrder = (productId) => {
    // This would typically integrate with your order placement system
    alert(`Placing order for customized product ${productId}`);
    // Here you would navigate to checkout or order placement flow
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Bell className="text-green-600" size={32} />
            <h2 className="text-3xl font-bold text-green-600">Notifications</h2>
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                {unreadCount} new
              </span>
            )}
          </div>
          <button className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-green-600 transition-colors duration-300">
            <Settings size={20} />
            Settings
          </button>
        </div>

        <div className="space-y-4">
          {notifications.map((notification) => {
            const IconComponent = notification.icon;
            const isCustomization = notification.type.includes('customization');
            
            return (
              <div
                key={notification.id}
                className={`border rounded-2xl p-6 transition-all duration-300 hover:shadow-md ${getNotificationColor(notification.type, notification.read)}`}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-full bg-white shadow-sm ${getIconColor(notification.type)}`}>
                    <IconComponent size={24} />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className={`font-semibold mb-1 ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                          {notification.title}
                          {!notification.read && (
                            <span className="ml-2 w-2 h-2 bg-green-500 rounded-full inline-block"></span>
                          )}
                        </h3>
                        <p className={`text-sm mb-2 ${!notification.read ? 'text-gray-700' : 'text-gray-600'}`}>
                          {notification.message}
                        </p>
                      </div>
                      <span className="text-xs text-gray-500 whitespace-nowrap">
                        {notification.time}
                      </span>
                    </div>

                    {isCustomization && notification.product && (
                      <div className="bg-white bg-opacity-70 rounded-xl p-4 mb-3">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-gray-800">{notification.product.name}</h4>
                          {getStatusBadge(notification.status)}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          <strong>Customization:</strong> {notification.product.customization}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-gray-600">
                            <strong>Seller:</strong> {notification.product.seller}
                          </div>
                          <div className="text-lg font-bold text-green-600">
                            ${notification.product.price}
                          </div>
                        </div>
                      </div>
                    )}

                    {isCustomization && notification.status === 'accepted' && (
                      <button
                        onClick={() => handlePlaceOrder(notification.product.name)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-300 text-sm font-medium"
                      >
                        <ShoppingBag size={16} />
                        Place Order
                      </button>
                    )}

                   {/*{isCustomization && notification.status === 'declined' && (
                      <div className="flex gap-2">
                        <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-300 text-sm font-medium">
                          Modify Request
                        </button>
                        <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-300 text-sm font-medium">
                          View Details
                        </button>
                      </div>
                    )} */} 

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
          })}
        </div>

        {notifications.length === 0 && (
          <div className="text-center py-16">
            <Bell size={64} className="text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No notifications</h3>
            <p className="text-gray-500">You're all caught up!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;