import React, { useState, useEffect } from "react";
import {
  Clock,
  User,
  Package,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
} from "lucide-react";
import CreateCustomizedProductModal from "./CreateCustomizedProductModal";

const CustomizationRequestsSection = ({ sellerId }) => {
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null); // { type: 'success'|'error', message: string }

  useEffect(() => {
    fetchCustomizationRequests();
  }, [sellerId]);

  const fetchCustomizationRequests = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `http://localhost/Agrilink-Agri-Marketplace/backend/RequestCustomization/get_seller_requests.php?sellerId=${sellerId}`
      );
      const data = await response.json();

      if (data.success) {
        setRequests(data.requests);
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError("Failed to fetch customization requests");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (requestId, status) => {
    try {
      const response = await fetch(
        "http://localhost/Agrilink-Agri-Marketplace/backend/RequestCustomization/update_request_status.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ request_id: requestId, status }),
        }
      );

      const data = await response.json();

      if (data.success) {
        // Update local state
        setRequests((prev) =>
          prev.map((req) => (req.id === requestId ? { ...req, status } : req))
        );

        // If accepted, show the create modal
        if (status === "accepted") {
          const request = requests.find((req) => req.id === requestId);
          setSelectedRequest(request);
          setShowCreateModal(true);
        }
      } else {
        setToast({
          type: "error",
          message:
            "Failed to update status: " + (data.message || "Unknown error"),
        });
        setTimeout(() => setToast(null), 3500);
      }
    } catch (error) {
      setToast({
        type: "error",
        message: "Error updating status: " + error.message,
      });
      setTimeout(() => setToast(null), 3500);
    }
  };

  const handleCreateProduct = async (productData) => {
    try {
      const response = await fetch(
        "http://localhost/Agrilink-Agri-Marketplace/backend/RequestCustomization/create_customized_product.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            request_id: selectedRequest.id,
            ...productData,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setToast({
          type: "success",
          message: "Customized product created successfully!",
        });
        // auto-dismiss after 2.5s
        setTimeout(() => setToast(null), 2500);
        setShowCreateModal(false);
        setSelectedRequest(null);
        // Immediately update the specific request to status 'customized' locally
        setRequests((prev) =>
          prev.map((req) =>
            req.id === selectedRequest?.id
              ? { ...req, status: "customized" }
              : req
          )
        );
        // Refresh the requests list from server for safety
        fetchCustomizationRequests();
      } else {
        setToast({
          type: "error",
          message:
            "Failed to create customized product: " +
            (data.message || "Unknown error"),
        });
        setTimeout(() => setToast(null), 3500);
      }
    } catch (error) {
      setToast({
        type: "error",
        message: "Error creating customized product: " + error.message,
      });
      setTimeout(() => setToast(null), 3500);
    }
  };

  const handleDeleteRequest = async (requestId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this customization request? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      const response = await fetch(
        "http://localhost/Agrilink-Agri-Marketplace/backend/RequestCustomization/delete_customization_request.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ request_id: requestId }),
        }
      );

      const data = await response.json();

      if (data.success) {
        // Remove from local state
        setRequests((prev) => prev.filter((req) => req.id !== requestId));
        setToast({
          type: "success",
          message: "Customization request deleted successfully!",
        });
        setTimeout(() => setToast(null), 2500);
      } else {
        setToast({
          type: "error",
          message:
            "Failed to delete request: " + (data.message || "Unknown error"),
        });
        setTimeout(() => setToast(null), 3500);
      }
    } catch (error) {
      setToast({
        type: "error",
        message: "Error deleting request: " + error.message,
      });
      setTimeout(() => setToast(null), 3500);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: {
        color: "bg-yellow-100 text-yellow-800",
        icon: Clock,
        label: "Pending",
      },
      accepted: {
        color: "bg-green-100 text-green-800",
        icon: CheckCircle,
        label: "Accepted",
      },
      customized: {
        color: "bg-blue-100 text-blue-800",
        icon: Edit,
        label: "Customized",
      },
      delivered: {
        color: "bg-purple-100 text-purple-800",
        icon: CheckCircle,
        label: "Delivered",
      },
      declined: {
        color: "bg-red-100 text-red-800",
        icon: XCircle,
        label: "Declined",
      },
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <span
        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}
      >
        <Icon className="h-3 w-3" />
        {config.label}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
        <span className="ml-3 text-gray-600">
          Loading customization requests...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800 text-sm">Error: {error}</p>
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="text-center py-8">
        <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No Customization Requests
        </h3>
        <p className="text-gray-500">
          You haven't received any customization requests yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {toast && (
        <div
          className={`fixed top-4 right-4 z-[100] px-4 py-3 rounded-xl shadow-lg border text-sm font-medium transition-all ${
            toast.type === "success"
              ? "bg-green-50 border-green-200 text-green-800"
              : "bg-red-50 border-red-200 text-red-800"
          }`}
        >
          {toast.message}
        </div>
      )}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">
          Customization Requests
        </h2>
        <p className="text-sm text-gray-600">
          {requests.filter((req) => req.status === "pending").length} pending
          requests
        </p>
      </div>

      <div className="grid gap-6">
        {requests.map((request) => (
          <div
            key={request.id}
            className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {request.product_name}
                  </h3>
                  {getStatusBadge(request.status)}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                  <div>
                    <span className="font-medium">Customer:</span>
                    <p className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      {request.customer_name}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium">Quantity:</span>
                    <p>{request.quantity}</p>
                  </div>
                  <div>
                    <span className="font-medium">Price:</span>
                    <p>
                      {request?.effective_price != null &&
                      parseFloat(request.effective_price) !==
                        parseFloat(request.original_price) ? (
                        <>
                          <span className="text-green-700 font-semibold mr-2">
                            ${parseFloat(request.effective_price).toFixed(2)}
                          </span>
                          <span className="text-gray-400 line-through">
                            ${parseFloat(request.original_price).toFixed(2)}
                          </span>
                        </>
                      ) : (
                        <>${parseFloat(request.original_price).toFixed(2)}</>
                      )}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium">Requested:</span>
                    <p>{new Date(request.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3 mb-4">
              {request?.special_offer &&
                request.special_offer !== "No Special Offer" && (
                  <div>
                    <span className="inline-block bg-red-100 text-red-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                      {request.special_offer}
                    </span>
                  </div>
                )}
              <div>
                <span className="font-medium text-gray-700">
                  Customization Details:
                </span>
                <p className="text-gray-600 mt-1">
                  {request.customization_details}
                </p>
              </div>

              {request.notes && (
                <div>
                  <span className="font-medium text-gray-700">
                    Additional Notes:
                  </span>
                  <p className="text-gray-600 mt-1">{request.notes}</p>
                </div>
              )}
            </div>

            {request.status === "pending" && (
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => handleStatusUpdate(request.id, "accepted")}
                  className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                >
                  <CheckCircle className="h-4 w-4" />
                  Accept
                </button>
                <button
                  onClick={() => handleStatusUpdate(request.id, "declined")}
                  className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                >
                  <XCircle className="h-4 w-4" />
                  Decline
                </button>
                <button
                  onClick={() => handleDeleteRequest(request.id)}
                  className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors flex items-center justify-center gap-2"
                  title="Delete Request"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            )}

            {(request.status === "accepted" ||
              request.status === "customized") && (
              <div className="pt-4 border-t border-gray-200">
                <div className="flex gap-3">
                  {request.status === "accepted" && (
                    <button
                      onClick={() => {
                        setSelectedRequest(request);
                        setShowCreateModal(true);
                      }}
                      className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <Edit className="h-4 w-4" />
                      Create Customized Product
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteRequest(request.id)}
                    className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors flex items-center justify-center gap-2"
                    title="Delete Request"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {request.status === "declined" && (
              <div className="pt-4 border-t border-gray-200">
                <button
                  onClick={() => handleDeleteRequest(request.id)}
                  className="w-full bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors flex items-center justify-center gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete Request
                </button>
              </div>
            )}

            {request.status === "delivered" && (
              <div className="pt-4 border-t border-gray-200">
                <button
                  onClick={() => handleDeleteRequest(request.id)}
                  className="w-full bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors flex items-center justify-center gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete Request
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Create Customized Product Modal */}
      {showCreateModal && selectedRequest && (
        <CreateCustomizedProductModal
          request={selectedRequest}
          onClose={() => {
            setShowCreateModal(false);
            setSelectedRequest(null);
          }}
          onSubmit={handleCreateProduct}
        />
      )}
    </div>
  );
};

export default CustomizationRequestsSection;
