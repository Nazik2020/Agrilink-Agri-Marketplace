import React from 'react';
import { Package, Clock } from 'lucide-react';

const NotificationCard = ({ notification, onAccept, onReject, onViewDetails, showActions = false }) => {
  const getStatusColor = () => {
    if (notification.status === 'accepted') return 'bg-green-50 border-green-200';
    if (notification.status === 'rejected') return 'bg-red-50 border-red-200';
    if (notification.isNew) return 'bg-blue-50 border-blue-200';
    return 'bg-white border-gray-200';
  };

  return (
    <div className={`border rounded-xl p-6 transition-all duration-300 hover:shadow-md ${getStatusColor()}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4 flex-1">
          {/* Icon */}
          <div className="p-2 bg-white rounded-lg shadow-sm">
            <Package className="w-5 h-5 text-green-600" />
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <h3 className="text-lg font-semibold text-gray-900">
                {notification.title}
              </h3>
              {notification.isNew && !notification.status && (
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  New
                </span>
              )}
              {notification.status && (
                <span className={`text-xs px-2 py-1 rounded-full ${
                  notification.status === 'accepted' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {notification.status.charAt(0).toUpperCase() + notification.status.slice(1)}
                </span>
              )}
            </div>
            
            <p className="text-gray-600 mb-1">
              Request received: {notification.timestamp}
            </p>
            <p className="text-sm text-gray-500 mb-3">
              Customer: {notification.customer} | Product: {notification.product}
            </p>
            
            <div className="flex items-center text-xs text-gray-400">
              <Clock className="w-3 h-3 mr-1" />
              {notification.timestamp}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => onViewDetails(notification)}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
          >
            View Details
          </button>
          
          {showActions && (
            <>
              <button
                onClick={() => onReject(notification.id)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Reject
              </button>
              <button
                onClick={() => onAccept(notification.id)}
                className="px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-lg hover:bg-green-600 transition-colors"
              >
                Accept
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationCard;