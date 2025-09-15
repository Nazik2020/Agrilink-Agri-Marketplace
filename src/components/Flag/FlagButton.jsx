import React, { useState } from "react";
import FlagModal from "./FlagModal";

const FlagButton = ({ sellerId, productId = null, size = "sm" }) => {
  const [showModal, setShowModal] = useState(false);

  const handleFlagClick = () => {
    // Check if user is logged in as customer
    const user = JSON.parse(sessionStorage.getItem("user"));
    if (!user) {
      alert("Please login to flag content");
      return;
    }
    if (user.role !== "customer") {
      alert("Only customers can flag content");
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
          alert("Flag submitted successfully!");
        }}
      />
    </>
  );
};

export default FlagButton;
