import React from 'react';
import { Package, Clock } from 'lucide-react';

const NotificationCard = ({ notification, onAccept, onReject, onViewDetails, showActions = false, onMarkRead }) => {
  const getStatusColor = () => {
    if ([
      'maintenance',
      'general',
      'security',
      'policy',
      'emergency',
      'global_alert'
    ].includes(notification.type)) return 'bg-yellow-100 border-yellow-400';
    if (notification.type === 'product_flagged') return 'bg-red-50 border-red-400';
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
          <div className="p-2 bg-green-200 rounded-lg shadow-sm">
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
              {notification.type === 'product_flagged' ? 'Flagged Content: ' :
                ['maintenance','general','security','policy','emergency','global_alert'].includes(notification.type) ? 'Special Notice: ' :
                ''}
              {notification.timestamp}
            </p>
            {notification.type === 'product_flagged' ? (
              <p className="text-sm text-red-600 mb-3">
                <strong>Flag Category:</strong> {notification.message && notification.message.match(/for \"(.*?)\"/) ? notification.message.match(/for \"(.*?)\"/)[1] : 'N/A'}<br />
                <strong>Flag Content:</strong> {notification.message && notification.message.match(/Reason: (.*)/) ? notification.message.match(/Reason: (.*)/)[1] : notification.message}
              </p>
            ) : [
                'maintenance',
                'general',
                'security',
                'policy',
                'emergency',
                'global_alert'
              ].includes(notification.type) ? (
                <p className="text-sm mb-3 bg-yellow-100 text-yellow-900 p-3 rounded-lg font-semibold">
                  {notification.message}
                </p>
              ) : (
              notification.message ? (
                <p className="text-sm  text-gray-500 mb-3">
                  {notification.message}
                </p>
              ) : null
            )}
            <div className="flex items-center text-xs text-gray-400">
              <Clock className="w-3 h-3 mr-1" />
              {notification.timestamp}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-3">
          {onMarkRead && notification.isNew && (
            <button
              onClick={() => onMarkRead(notification.id)}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Mark as Read
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationCard;