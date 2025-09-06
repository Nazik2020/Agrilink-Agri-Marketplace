import React, { useState } from "react";
import { X } from "lucide-react";

export default function ConfirmDeleteModal({ product, onConfirm, onCancel }) {
  const [resultMessage, setResultMessage] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  if (!product) return null;

  const handleDelete = async () => {
    setIsDeleting(true);
    
    try {
      console.log("Attempting to delete product:", product.id); // Debug log
      
      const response = await fetch(
        `http://localhost/Agrilink-Agri-Marketplace/backend/delete_product.php`,
        {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify({ productId: product.id }),
        }
      );

      console.log("Response status:", response.status); // Debug log
      console.log("Response ok:", response.ok); // Debug log

      // Check if response is ok
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Get response text first to check what we're receiving
      const responseText = await response.text();
      console.log("Raw response:", responseText); // Debug log

      // Try to parse JSON
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error("JSON parse error:", parseError);
        console.error("Response was:", responseText);
        throw new Error("Server returned invalid JSON response");
      }

      console.log("Parsed response data:", data); // Debug log

      if (data.success) {
        setResultMessage("Product deleted successfully!");
        setTimeout(() => {
          onConfirm(product.id); // Call parent function to remove product from list
          setResultMessage(null);
        }, 1500);
      } else {
        setResultMessage(`Failed to delete product: ${data.message || "Unknown error"}`);
      }

    } catch (error) {
      console.error("Delete error:", error);
      
      // More specific error messages
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        setResultMessage("Network error: Unable to connect to server. Please check if your server is running.");
      } else if (error.message.includes('JSON')) {
        setResultMessage("Server error: Invalid response format. Check server logs.");
      } else {
        setResultMessage(`An error occurred: ${error.message}`);
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      {/* Confirm Delete Modal */}
      <div className="fixed inset-0 flex items-center justify-center bg-green-50/50 z-50">
        <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative">
          <button
            onClick={onCancel}
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            disabled={isDeleting}
          >
            <X className="h-5 w-5" />
          </button>
          
          <h2 className="text-xl font-semibold text-red-600 mb-4">
            Confirm Delete
          </h2>
          
          <p className="text-gray-600 mb-4">
            Are you sure you want to delete the following product?
          </p>
          
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="font-semibold text-gray-800">{product.product_name}</p>
            <p className="text-sm text-gray-600">
              Stock: {product.stock} | Price: ${parseFloat(product.price).toFixed(2)}
            </p>
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              onClick={onCancel}
              disabled={isDeleting}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-100 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 flex items-center"
            >
              {isDeleting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Result Message Modal */}
      {resultMessage && (
        <div className="fixed inset-0 flex items-center justify-center bg-green-50/50 z-60">
          <div className="bg-white rounded-lg p-6 max-w-sm text-center shadow-lg">
            <p className={`mb-4 ${resultMessage.includes("successfully") ? "text-green-700" : "text-red-700"}`}>
              {resultMessage}
            </p>
            <button
              onClick={() => {
                setResultMessage(null);
                if (resultMessage.includes("successfully")) {
                  onCancel(); // Close the main modal too
                }
              }}
              className={`px-4 py-2 rounded-md text-white ${
                resultMessage.includes("successfully") 
                  ? "bg-green-600 hover:bg-green-700" 
                  : "bg-red-600 hover:bg-red-700"
              }`}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </>
  );
}