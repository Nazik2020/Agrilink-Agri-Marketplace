import React from 'react';
import { X, Package, User, Calendar, MapPin, Phone, Mail, FileText } from 'lucide-react';

const NotificationDetailsModal = ({ notification, isOpen, onClose, onAccept, onReject }) => {
  if (!isOpen || !notification) return null;

  const handleAccept = () => {
    if (onAccept) {
      onAccept(notification.id);
    }
    onClose();
  };

  const handleReject = () => {
    if (onReject) {
      onReject(notification.id);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-100 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Package className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Customization Request Details</h2>
              <p className="text-sm text-gray-500">Request ID: #{notification.id}</p>
            </div>
          </div>
         
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Status Badge */}
          <div className="flex items-center space-x-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              notification.status === 'accepted' 
                ? 'bg-green-100 text-green-800' 
                : notification.status === 'rejected'
                ? 'bg-red-100 text-red-800'
                : 'bg-blue-100 text-blue-800'
            }`}>
              {notification.status ? 
                notification.status.charAt(0).toUpperCase() + notification.status.slice(1) : 
                'Pending Review'
              }
            </span>
            {notification.isNew && !notification.status && (
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                New
              </span>
            )}
          </div>

          {/* Customer Information */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <User className="w-5 h-5 mr-2 text-green-600" />
              Customer Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Customer Name</p>
                <p className="font-medium text-gray-900">{notification.customer}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Contact Number</p>
                <p className="font-medium text-gray-900 flex items-center">
                  <Phone className="w-4 h-4 mr-1 text-green-600" />
                  {notification.contactNumber || 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email Address</p>
                <p className="font-medium text-gray-900 flex items-center">
                  <Mail className="w-4 h-4 mr-1 text-green-600" />
                  {notification.email || 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p className="font-medium text-gray-900 flex items-center">
                  <MapPin className="w-4 h-4 mr-1 text-green-600" />
                  {notification.location || 'N/A'}
                </p>
              </div>
            </div>
          </div>

          {/* Product Information */}
          <div className="bg-green-50 rounded-xl p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <Package className="w-5 h-5 mr-2 text-green-600" />
              Product Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Product Name</p>
                <p className="font-medium text-gray-900">{notification.productName || notification.product || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Requested Quantity</p>
                <p className="font-medium text-gray-900">{notification.requestedQuantity || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Delivery Date</p>
                <p className="font-medium text-gray-900 flex items-center">
                  <Calendar className="w-4 h-4 mr-1 text-green-600" />
                  {notification.deliveryDate || 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Budget Range</p>
                <p className="font-medium text-gray-900">{notification.budgetRange || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Customization Details */}
          <div className="bg-blue-50 rounded-xl p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-green-600" />
              Customization Requirements
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Special Requirements</p>
                <p className="font-medium text-gray-900">
                  {notification.specialRequirements || 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Quantity Needed</p>
                <p className="font-medium text-gray-900">
                  {notification.quantityNeeded || 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Additional Notes</p>
                <p className="font-medium text-gray-900">
                  {notification.additionalNotes || 'N/A'}
                </p>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-green-600" />
              Request Timeline
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Request Submitted</span>
                <span className="text-sm font-medium text-gray-900">{notification.timestamp || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Response Deadline</span>
                <span className="text-sm font-medium text-gray-900">{notification.responseDeadline || 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Close
            </button>
             
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationDetailsModal;