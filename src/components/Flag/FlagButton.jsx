import React, { useState } from "react";
import FlagModal from "./FlagModal";
import { CheckCircle, XCircle, X } from 'lucide-react';

// Custom PopupMessage Component
const PopupMessage = ({ message, type, onClose }) => {
  if (!message) return null;
  const isSuccess = type === 'success';
  const bgColor = isSuccess ? 'bg-green-50' : 'bg-red-50';
  const borderColor = isSuccess ? 'border-green-200' : 'border-red-200';
  const textColor = isSuccess ? 'text-green-800' : 'text-red-800';
  const iconColor = isSuccess ? 'text-green-600' : 'text-red-600';
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-green-50/50 z-50">
      <div className={`${bgColor} ${borderColor} border rounded-xl p-6 max-w-md w-full mx-4 shadow-lg`}>
        <div className="flex items-start space-x-3">
          <div className={`${iconColor} flex-shrink-0 mt-0.5`}>
            {isSuccess ? (
              <CheckCircle className="h-6 w-6" />
            ) : (
              <XCircle className="h-6 w-6" />
            )}
          </div>
          <div className="flex-1">
            <p className={`${textColor} text-sm font-medium leading-relaxed`}>
              {message}
            </p>
          </div>
          <button
            onClick={onClose}
            className={`${textColor} hover:opacity-70 transition-opacity flex-shrink-0`}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              isSuccess 
                ? 'bg-green-600 hover:bg-green-700 text-white' 
                : 'bg-red-600 hover:bg-red-700 text-white'
            }`}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

const FlagButton = ({ sellerId, productId = null, size = "sm" }) => {
  const [showModal, setShowModal] = useState(false);
  const [popupMessage, setPopupMessage] = useState(null);
  const [popupType, setPopupType] = useState('success');
  const showPopup = (message, type = 'success') => {
    setPopupMessage(message);
    setPopupType(type);
  };
  const closePopup = () => {
    setPopupMessage(null);
    setPopupType('success');
  };

  const handleFlagClick = () => {
    // Check if user is logged in as customer
    const user = JSON.parse(sessionStorage.getItem("user"));
    if (!user) {
      showPopup("Please login to flag content", 'error');
      return;
    }
    if (user.role !== "customer") {
      showPopup("Only customers can flag content", 'error');
      return;
    }
    setShowModal(true);
  };

  const sizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  return (
    <>
      <button
        onClick={handleFlagClick}
        className={`flex items-center text-red-500 hover:text-red-700 transition-colors duration-200 font-medium ${sizeClasses[size]}`}
        title="Report this content"
      >
        <span className="mr-1">🚩</span>
        Flag
      </button>

      <FlagModal
        open={showModal}
        sellerId={sellerId}
        productId={productId}
        onClose={() => setShowModal(false)}
        onSuccess={() => {
          setShowModal(false);
          showPopup("Flag submitted successfully!", 'success');
        }}
        showPopup={showPopup}
      />
      <PopupMessage
        message={popupMessage}
        type={popupType}
        onClose={closePopup}
      />
    </>
  );
};

export default FlagButton;
