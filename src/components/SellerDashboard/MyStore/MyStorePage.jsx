import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ChevronLeft, ChevronRight, CheckCircle, X } from "lucide-react";
import ConfirmDeleteModal from "../MyStore/ConfirmDeleteModal";
import EditProductModal from "../MyStore/EditProductModal"; 

// Helper to get first image from product_images field
const getFirstImage = (images) => {
  if (!images) return null;
  
  try {
    const parsedImages = JSON.parse(images);
    if (Array.isArray(parsedImages) && parsedImages.length > 0) {
      let imagePath = parsedImages[0];
      imagePath = imagePath.replace(/^https?:\/\/[^\/]+\/.*?\//, '');
      imagePath = imagePath.replace(/^backend\//, '');
      if (!imagePath.startsWith('uploads/products/')) {
        imagePath = 'uploads/products/' + imagePath.replace(/^uploads\//, '').replace(/^products\//, '');
      }
      return imagePath;
    }
  } catch (e) {
    // If JSON parsing fails, treat as comma-separated string
    const imageArray = images.split(',');
    if (imageArray.length > 0) {
      let imagePath = imageArray[0].trim();
      // Clean the image path
      imagePath = imagePath.replace(/^https?:\/\/[^\/]+\/.*?\//, '');
      imagePath = imagePath.replace(/^backend\//, '');
      if (!imagePath.startsWith('uploads/products/')) {
        imagePath = 'uploads/products/' + imagePath.replace(/^uploads\//, '').replace(/^products\//, '');
      }
      return imagePath;
    }
  }
  
  return null;
};

// Updated image URL construction helper
const getImageUrl = (productImages) => {
  const imagePath = getFirstImage(productImages);
  if (!imagePath) {
    return "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2YzZjRmNiIvPgogIDx0ZXh0IHg9IjEwMCIgeT0iMTAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSIgZmlsbD0iIzljYTNhZiIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE2Ij5ObyBJbWFnZTwvdGV4dD4KICA8L3N2Zz4K";
  }
  return `http://localhost/Agrilink-Agri-Marketplace/backend/${imagePath}`;
};

function PopupMessage({ show, message, type, onClose }) {
  if (!show) return null;
  return (
    <div className={`fixed top-6 right-6 z-50 px-4 py-2 rounded shadow-lg text-white ${type === "success" ? "bg-green-600" : "bg-red-600"}`}>
      {message}
      <button className="ml-4 text-white font-bold" onClick={onClose}>×</button>
    </div>
  );
}

export default function MyStorePage() {
  const [products, setProducts] = useState([]);
  const [ordersData, setOrdersData] = useState([]);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [seller, setSeller] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);
  const [productToEdit, setProductToEdit] = useState(null);
  const [confirmingOrder, setConfirmingOrder] = useState(null);
  const [cancellingOrder, setCancellingOrder] = useState(null);
  const [popup, setPopup] = useState({ show: false, message: "", type: "success" });

  const navigate = useNavigate();

  useEffect(() => {
    const sessionSeller = sessionStorage.getItem("seller");
    if (sessionSeller) {
      setSeller(JSON.parse(sessionSeller));
    }
  }, []);

  useEffect(() => {
    if (popup.show) {
      const timer = setTimeout(() => setPopup({ ...popup, show: false }), 2000);
      return () => clearTimeout(timer);
    }
  }, [popup]);

  const fetchProducts = () => {
    if (!seller?.id) return;

    setLoading(true);
    fetch(
      `http://localhost/Agrilink-Agri-Marketplace/backend/get_seller_products.php?sellerId=${seller.id}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setProducts(data.products || []);
        } else {
          console.error("Error fetching products:", data.message);
          setProducts([]);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Fetch error:", error);
        setProducts([]);
        setLoading(false);
      });
  };

  const fetchPendingOrders = () => {
    if (!seller?.id) return;

    fetch(
      `http://localhost/Agrilink-Agri-Marketplace/backend/get_seller_orders.php?sellerId=${seller.id}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setOrdersData(data.orders || []);
        } else {
          console.error("Error fetching orders:", data.message);
          setOrdersData([]);
        }
      })
      .catch((error) => {
        console.error("Fetch orders error:", error);
        setOrdersData([]);
      });
  };

  useEffect(() => {
    fetchProducts();
    fetchPendingOrders();
  }, [seller?.id]);

  const getProductsWithOrders = () => {
    const productOrderMap = new Map();
    ordersData.forEach(order => {
      const productId = order.product_id;
      if (!productOrderMap.has(productId)) {
        productOrderMap.set(productId, []);
      }
      productOrderMap.get(productId).push(order);
    });

    return products.filter(product => 
      productOrderMap.has(parseInt(product.id))
    ).map(product => ({
      ...product,
      pendingOrders: productOrderMap.get(parseInt(product.id)) || []
    }));
  };

  const filteredProducts = (() => {
    let productsToFilter = products;
    if (activeTab === "view-orders") {
      productsToFilter = getProductsWithOrders();
    }
    return productsToFilter.filter((product) => {
      const matchesSearch = product.product_name
        .toLowerCase()
        .includes(search.toLowerCase());
      switch (activeTab) {
        case "out-of-stock":
          return matchesSearch && parseInt(product.stock) === 0;
        case "view-orders":
          return matchesSearch;
        case "customization":
          return matchesSearch;
        default:
          return matchesSearch;
      }
    });
  })();

  const handleEdit = (product) => {
    setProductToEdit(product);
  };

  const handleDelete = (productId) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  const handleConfirmOrder = async (orderId, productId) => {
    setConfirmingOrder(orderId);
    try {
      const response = await fetch(
        `http://localhost/Agrilink-Agri-Marketplace/backend/confirm_order.php`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            orderId: orderId,
            sellerId: seller.id,
            action: 'confirm'
          })
        }
      );
      const data = await response.json();
      if (data.success) {
        fetchPendingOrders();
        fetchProducts();
        setPopup({ show: true, message: "Order confirmed successfully!", type: "success" });
      } else {
        setPopup({ show: true, message: "Error confirming order: " + data.message, type: "error" });
      }
    } catch (error) {
      console.error('Error confirming order:', error);
      setPopup({ show: true, message: "Error confirming order. Please try again.", type: "error" });
    } finally {
      setConfirmingOrder(null);
    }
  };

  const handleCancelOrder = async (orderId, productId) => {
    setCancellingOrder(orderId);
    try {
      const response = await fetch(
        `http://localhost/Agrilink-Agri-Marketplace/backend/confirm_order.php`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            orderId: orderId,
            sellerId: seller.id,
            action: 'cancel'
          })
        }
      );
      const data = await response.json();
      if (data.success) {
        fetchPendingOrders();
        setPopup({ show: true, message: "Order cancelled successfully!", type: "success" });
      } else {
        setPopup({ show: true, message: "Error cancelling order: " + data.message, type: "error" });
      }
    } catch (error) {
      console.error('Error cancelling order:', error);
      setPopup({ show: true, message: "Error cancelling order. Please try again.", type: "error" });
    } finally {
      setCancellingOrder(null);
    }
  };

  const handleAddProduct = () => navigate("/seller-dashboard/add-product");

  const itemsPerPage = 8;
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const tabs = [
    { id: "all", label: "All Products" },
    { id: "view-orders", label: "View Orders" },
    { id: "out-of-stock", label: "Out of Stock Products" },
    { id: "customization", label: "Customization Request Products" },
  ];

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 7;
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 4) {
        for (let i = 1; i <= 5; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      }
    }
    return pages;
  };

  const handleImageError = (e) => {
    const fallbackImage = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2YzZjRmNiIvPgogIDx0ZXh0IHg9IjEwMCIgeT0iMTAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSIgZmlsbD0iIzljYTNhZiIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE2Ij5ObyBJbWFnZTwvdGV4dD4KICA8L3N2Zz4K";
    e.target.src = fallbackImage;
    e.target.onerror = null;
  };

  if (!seller) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        <p>Please login to view your store.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <PopupMessage
        show={popup.show}
        message={popup.message}
        type={popup.type}
        onClose={() => setPopup({ ...popup, show: false })}
      />
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4 sm:mb-0">
            My Store
          </h1>
          <button
            onClick={handleAddProduct}
            className="bg-green-700 text-white hover:bg-green-800 px-6 py-2 rounded"
          >
            Add Product
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <Search className="h-4 w-4" />
          </span>
          <input
            type="text"
            placeholder="Search products"
            className="pl-10 bg-gray-100 border border-gray-200 rounded w-full py-2 focus:border-green-700 focus:ring-green-700 outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Tabs */}
        <div className="flex space-x-8 mb-8 border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setCurrentPage(1);
              }}
              className={`pb-3 px-1 text-sm font-medium transition-colors flex items-center gap-2 ${
                activeTab === tab.id
                  ? "text-green-700 border-b-2 border-green-700"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.id === "view-orders"}
              {tab.label}
              {tab.id === "view-orders" && ordersData.length > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 ml-1">
                  {ordersData.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* View Orders Tab: Show all orders with product images */}
        {activeTab === "view-orders" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {ordersData.map(order => (
              <div key={order.id} className="bg-white rounded-lg shadow p-6  flex flex-col">
                {/* Product Image */}
                <div className="aspect-square bg-gray-100 rounded-t-lg overflow-hidden flex items-center justify-center h-40 mb-4">
                  <img
                   src={getImageUrl(order.product_images)}
                    alt={order.product_name}
                    className="w-full h-full object-cover"
                    onError={handleImageError}
                  />
                </div>
                <h3 className="font-bold text-green-700 mb-2">Order #{order.id}</h3>
                <p className="text-gray-700 mb-1">Product: {order.product_name}</p>
                <p className="text-gray-700 mb-1">Quantity: {order.quantity}</p>
                <p className="text-gray-700 mb-1">Total: ${parseFloat(order.total_amount).toFixed(2)}</p>
                <p className="text-gray-700 mb-1">Status: {order.order_status}</p>
                <div className="mt-2 text-sm text-gray-600 break-words">
                  <p>Customer: {order.billing_name}</p>
                  <p>Email: {order.billing_email}</p>
                  <p>Address: {order.billing_address}, {order.billing_postal_code}, {order.billing_country}</p>
                </div>
                <div className="flex space-x-2 mt-4">
                  <button
                    onClick={() => handleConfirmOrder(order.id, order.product_id)}
                    className="flex-1 bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => handleCancelOrder(order.id, order.product_id)}
                    className="flex-1 bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ))}
           {/* {ordersData.length === 0 && (
              <div className="text-center py-12 col-span-full">
                <p className="text-gray-500 text-lg">No pending orders found</p>
                <p className="text-gray-400 text-sm mt-2">
                  When customers place orders, they will appear here
                </p>
              </div>
            )}*/}
          </div>
        )}

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          {paginatedProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition flex flex-col w-full max-w-sm mx-auto"
            >
              {/* Image */}
              <div className="aspect-square bg-gray-100 rounded-t-lg overflow-hidden flex items-center justify-center h-48">
                <img
                  src={getImageUrl(product.product_images)}
                  alt={product.product_name}
                  className="w-full h-full object-cover"
                  onError={handleImageError}
                />
              </div>

              {/* Product Info */}
              <div className="flex flex-col p-4 flex-1 text-center">
                <h3 className="font-semibold text-green-700 mb-1 truncate text-xl">
                  {product.product_name}
                </h3>
                <p className="text-gray-600 text-sm mb-1">
                  Quantity: <span className="font-medium">{product.stock}</span>
                </p>
                <p className={`text-sm mb-2 ${parseInt(product.stock) === 0 ? "text-red-500" : "text-green-600"}`}>
                  {parseInt(product.stock) === 0 ? "Out of Stock" : "In Stock"}
                </p>
                <p className="text-gray-900 font-bold mb-2">
                  ${parseFloat(product.price).toFixed(2)}
                </p>

                {/* Orders info for View Orders tab */}
                {activeTab === "view-orders" && product.pendingOrders && (
                  <div className="mb-3 p-2 bg-yellow-50 rounded border border-yellow-200">
                    <p className="text-sm text-yellow-800 font-medium">
                      Pending Orders: {product.pendingOrders.length}
                    </p>
                    <div className="mt-2 space-y-1">
                      {product.pendingOrders.slice(0, 2).map((order) => (
                        <div key={order.id} className="text-xs text-gray-600 bg-white p-2 rounded border">
                          <div className="flex justify-between items-start mb-1">
                            <span className="font-medium">Order #{order.id}</span>
                            <span className="text-green-600 font-bold">${parseFloat(order.total_amount).toFixed(2)}</span>
                          </div>
                          <div className="text-xs text-gray-500 mb-2">
                            <p>Customer: {order.billing_name}</p>
                            <p>Qty: {order.quantity} × ${parseFloat(order.unit_price).toFixed(2)}</p>
                            <p>Payment: {order.payment_status}</p>
                          </div>
                          <div className="flex space-x-1">
                            <button
                              onClick={() => handleConfirmOrder(order.id, product.id)}
                              disabled={confirmingOrder === order.id || cancellingOrder === order.id}
                              className="flex-1 bg-green-600 text-white px-2 py-1 rounded text-xs hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-1"
                            >
                              {confirmingOrder === order.id ? (
                                "Confirming..."
                              ) : (
                                <>
                                  <CheckCircle className="h-3 w-3" />
                                  Confirm
                                </>
                              )}
                            </button>
                            <button
                              onClick={() => handleCancelOrder(order.id, product.id)}
                              disabled={confirmingOrder === order.id || cancellingOrder === order.id}
                              className="flex-1 bg-red-600 text-white px-2 py-1 rounded text-xs hover:bg-red-700 disabled:opacity-50 flex items-center justify-center gap-1"
                            >
                              {cancellingOrder === order.id ? (
                                "Cancelling..."
                              ) : (
                                <>
                                  <X className="h-3 w-3" />
                                  Cancel
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      ))}
                      {product.pendingOrders.length > 2 && (
                        <p className="text-xs text-gray-500 mt-2 text-center">
                          +{product.pendingOrders.length - 2} more orders
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Buttons */}
                {activeTab !== "view-orders" && (
                  <div className="flex space-x-2 mt-auto">
                    <button
                      onClick={() => handleEdit(product)}
                      className="flex-1 border border-green-700 text-green-700 rounded-md py-1 hover:bg-green-700 hover:text-white transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setProductToDelete(product)}
                      className="flex-1 border border-red-500 text-red-500 rounded py-1 hover:bg-red-500 hover:text-white transition"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              {activeTab === "view-orders" ? "No pending orders found" : "No products found"}
            </p>
            <p className="text-gray-400 text-sm mt-2">
              {activeTab === "view-orders" 
                ? "When customers place orders, they will appear here" 
                : "Try adjusting your search or filters"}
            </p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-1">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="text-gray-500 hover:text-green-700 px-2 py-1 rounded"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            {getPageNumbers().map((pageNum, index) =>
              pageNum === "..." ? (
                <span key={`ellipsis-${index}`} className="px-2 text-gray-400">
                  ...
                </span>
              ) : (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`px-2 py-1 rounded ${
                    currentPage === pageNum
                      ? "bg-green-700 text-white"
                      : "text-gray-500 hover:text-green-700 hover:bg-green-50"
                  }`}
                >
                  {pageNum}
                </button>
              )
            )}

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="text-gray-500 hover:text-green-700 px-2 py-1 rounded"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}

        <ConfirmDeleteModal
          product={productToDelete}
          onCancel={() => setProductToDelete(null)}
          onConfirm={(id) => {
            handleDelete(id);
            setProductToDelete(null);
          }}
        />

        <EditProductModal
          product={productToEdit}
          onClose={() => setProductToEdit(null)}
          onUpdate={() => {
            fetchProducts();
          }}
        />
      </div>
    </div>
  );
}