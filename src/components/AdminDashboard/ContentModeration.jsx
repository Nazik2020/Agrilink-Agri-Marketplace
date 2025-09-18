import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Button, Badge } from './ui';
import { Eye, Trash2, Flag, CheckCircle, XCircle, X } from 'lucide-react';

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
        {/* OK button removed as requested */}
      </div>
    </div>
  );
};

function ConfirmRemoveModal({ open, ad, onConfirm, onCancel }) {
  if (!open || !ad) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-8 relative">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
          onClick={onCancel}
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>
        <h2 className="text-2xl font-bold mb-2">Remove Advertisement?</h2>
        <p className="text-gray-500 mb-6 text-base">
          Are you sure you want to remove "{ad.title}"? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-4 mt-6">
          <button
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-100 font-semibold transition"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="px-6 py-2 rounded-lg font-semibold transition text-white bg-red-600 hover:bg-red-700"
            onClick={onConfirm}
          >
            Remove Ad
          </button>
        </div>
      </div>
    </div>
  );
}

function FlagDetailsModal({ open, flag, onClose }) {
  if (!open || !flag) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-8 relative">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
          onClick={onClose}
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>
        <h2 className="text-2xl font-bold mb-4">Flag Details</h2>
        <div className="space-y-2">
          <div><span className="font-semibold">Flag ID:</span> {flag.id}</div>
          <div><span className="font-semibold">Category:</span> {flag.category}</div>
          <div><span className="font-semibold">Reason:</span> {flag.reason}</div>
          <div><span className="font-semibold">Status:</span> {flag.status}</div>
          <div><span className="font-semibold">Created At:</span> {flag.created_at}</div>
          {flag.dismissed_at && (
            <div><span className="font-semibold">Dismissed At:</span> {flag.dismissed_at}</div>
          )}
          {flag.removed_at && (
            <div><span className="font-semibold">Removed At:</span> {flag.removed_at}</div>
          )}
          <div><span className="font-semibold">Reporter Name:</span> {flag.reporter}</div>
          <div><span className="font-semibold">Seller:</span> {flag.seller}</div>
          {flag.title ? (
            <div>
              <span className="font-semibold">Product:</span> {flag.title}
            </div>
          ) : (
            <div>
              <span className="font-semibold">Product:</span> <span className="italic text-gray-500">No product details available</span>
            </div>
          )}
          {flag.product_description ? (
            <div>
              <span className="font-semibold">Product Description:</span> {flag.product_description}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function ProductDetailsModal({ open, product, onClose }) {
  if (!open || !product) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full p-8 relative">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
          onClick={onClose}
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>
        <h2 className="text-2xl font-bold mb-4">Product Details</h2>
        <div className="space-y-2">
          <div><span className="font-semibold">Product Name:</span> {product.product_name}</div>
          <div><span className="font-semibold">Product ID:</span> {product.id}</div>
          <div><span className="font-semibold">Seller ID:</span> {product.seller_id}</div>
          <div><span className="font-semibold">Seller:</span> {product.seller_name}</div>
          <div><span className="font-semibold">Category:</span> {product.category}</div>
          <div><span className="font-semibold">Description:</span> {product.product_description}</div>
          <div><span className="font-semibold">Price:</span> {product.price}</div>
          <div><span className="font-semibold">Status:</span> {product.status}</div>
          {product.product_images && product.product_images.length > 0 && (
            <div>
              <span className="font-semibold">Images:</span>
              <div className="flex gap-2 mt-2">
                {product.product_images.map((img, idx) => (
                  <img key={idx} src={img} alt="Product" className="h-20 w-20 object-cover rounded" />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


const FILTERS = [
  { id: 'flags', label: 'Flagged Content' },
  { id: 'removed', label: 'Removed Ads' }
];

const ContentModeration = () => {
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
  const [flaggedContent, setFlaggedContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('flags');
  const [removedAds, setRemovedAds] = useState([]);
  const [removedLoading, setRemovedLoading] = useState(false);
  const [removedError, setRemovedError] = useState(null);
  const [viewProduct, setViewProduct] = useState(null);
  // Pagination state for removed ads
  const [removedPage, setRemovedPage] = useState(1);
  const REMOVED_PAGE_SIZE = 8;

  const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

  const fetchFlags = async () => {
    setLoading(true);
    setError(null);
    try {
      const url = `${API_BASE}/backend/admin/content_moderation/list_flags.php`;
      const res = await fetch(url);
      let data;
      const text = await res.text();
      try { data = JSON.parse(text); } catch { data = { success: false, message: 'Invalid JSON', raw: text }; }
      
      if (data.success) {
        const mapped = data.flags.map(f => ({
          id: f.flag_id,
          title: f.product_name || '',
          seller: f.seller_name || f.seller_email || 'Unknown seller',
          reason: f.reason,
          reports: 1,
          status: f.status,
          category: f.category,
          reporter: f.reporter_name || f.reporter_email || 'Unknown reporter',
          created_at: f.created_at,
          product_description: f.product_description,
          dismissed_at: f.dismissed_at,
          removed_at: f.removed_at,
          productId: f.product_id 
        }));
        setFlaggedContent(mapped);
        if (mapped.length === 0) setError('No flags submitted yet.');
      } else {
        setError((data && data.message) ? data.message : 'Failed to load flags');
      }
    } catch (e) {
      setError('Failed to fetch flags from server');
    } finally {
      setLoading(false);
    }
  };

  const fetchRemovedAds = async () => {
    setRemovedLoading(true);
    setRemovedError(null);
    try {
      const url = `${API_BASE}/backend/admin/content_moderation/list_deleted_products.php`;
      const res = await fetch(url);
      const text = await res.text();
      let data;
      try { data = JSON.parse(text); } catch { data = { success: false, message: 'Invalid JSON', raw: text }; }
      if (data.success) {
        setRemovedAds(data.products || []);
        setRemovedPage(1); // Reset to first page on fetch
        if ((data.products || []).length === 0) setRemovedError('No removed ads found.');
      } else {
        setRemovedError(data.message || 'Failed to load removed ads');
      }
    } catch (e) {
      setRemovedError('Failed to fetch removed ads from server');
    } finally {
      setRemovedLoading(false);
    }
  };

  React.useEffect(() => {
    if (activeFilter === 'flags') {
      fetchFlags();
    } else {
      fetchRemovedAds();
    }
  }, [activeFilter]);

  const updateFlagStatus = async (id, newStatus) => {
    try {
      const url = `${API_BASE}/backend/admin/content_moderation/update_flag_status.php`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ flag_id: id, status: newStatus })
      });
      const text = await res.text();
      let data;
      try { data = JSON.parse(text); } catch { data = { success: false, message: 'Invalid JSON', raw: text }; }
      // if (!res.ok) {
      //   console.error('Update flag failed', { status: res.status, data });
      // }
      if (data.success) {
        // Refresh flag list after update
        await fetchFlags();
        toast({ title: 'Status Updated', description: `Flag #${id} set to ${newStatus}` });
      } else {
        toast({ title: 'Update Failed', description: data.message || 'Could not update flag', variant: 'destructive' });
      }
    } catch (e) {
      toast({ title: 'Network Error', description: 'Failed to reach server', variant: 'destructive' });
    }
  };
  const [removeAd, setRemoveAd] = useState(null);
  const [viewFlag, setViewFlag] = useState(null);


  const handleRemove = async (ad) => {
    // If flag has a productId, delete the product first
    if (ad.productId) {
      try {
        const res = await fetch(`${API_BASE}/backend/delete_product.php`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId: ad.productId })
        });
        const data = await res.json();
        if (!data.success) {
          showPopup(data.message || 'Product Deletion Failed. Could not delete product.', 'error');
        } else {
          showPopup('Product Removed. The product has been deleted from the marketplace.', 'success');
        }
      } catch (e) {
        showPopup('Network Error. Failed to delete product from server.', 'error');
      }
    }
    // Update status to 'removed' in backend
    await updateFlagStatus(ad.id, 'removed');
    setRemoveAd(null);
  };

  const getStatusColor = (reports) => {
    if (reports >= 4) return 'destructive';
    if (reports >= 3) return 'warning';
    return 'secondary';
  };

  // Sort flags: active first, then dismissed/removed
  const sortedFlags = [...flaggedContent].sort((a, b) => {
    const statusOrder = { 'pending': 0, 'resolved': 0, 'dismissed': 1, 'removed': 2 };
    return statusOrder[a.status] - statusOrder[b.status];
  });

  return (
    <div className="space-y-6 px-2 sm:px-4">
      <div>
        <h2 className="text-2xl font-bold text-green-700 mb-2">Content Moderation</h2>
        <p className="text-muted-foreground">Review and manage flagged advertisements and content</p>
        <div className="flex gap-4 mt-4">
          {FILTERS.map(f => (
            <button
              key={f.id}
              className={`px-4 py-2 rounded-lg font-semibold transition ${activeFilter === f.id ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700'}`}
              onClick={() => setActiveFilter(f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>
      {activeFilter === 'flags' ? (
        <>
          {loading && <p>Loading flagged content...</p>}
          {!loading && error && <p className="text-red-500">{error}</p>}
          {!loading && !error && (
            <div className="space-y-6">
              {sortedFlags.map((content) => (
                <div key={content.id} className="bg-white border border-red-200 shadow-sm rounded-xl p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-lg font-bold">{content.title}</span>
                        <span className="bg-red-500 text-white rounded-full px-3 py-1 text-xs font-semibold">{content.category}</span>
                      </div>
                      <div className="text-sm mb-1"><span className="font-semibold">Seller:</span> {content.seller}</div>
                      <div className="text-sm mb-1"><span className="font-semibold">Reporter:</span> {content.reporter}</div>
                      <div className="text-sm text-red-600 mb-1"><span className="font-semibold">Reason:</span> {content.reason}</div>
                      <div className="text-sm"><span className="font-semibold">Status:</span> {content.status}</div>
                    </div>
                    <div className="flex gap-2 items-start">
                      <button
                        className="border border-gray-300 rounded px-3 py-1 text-sm font-semibold hover:bg-gray-100"
                        onClick={() => setViewFlag(content)}
                      >View</button>
                      {content.status !== 'dismissed' && content.status !== 'removed' && (
                        <>
                          <button
                            className="border border-gray-300 rounded px-3 py-1 text-sm font-semibold hover:bg-gray-100"
                            onClick={() => updateFlagStatus(content.id, 'dismissed')}
                          >Dismiss</button>
                          <button
                            className="bg-red-500 text-white rounded px-3 py-1 text-sm font-semibold hover:bg-red-600"
                            onClick={() => setRemoveAd(content)}
                          >Remove</button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <>
          {removedLoading && <p>Loading removed ads...</p>}
          {!removedLoading && removedError && <p className="text-red-500">{removedError}</p>}
          {!removedLoading && !removedError && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {/* Pagination logic for removed ads */}
              {(() => {
                const startIdx = (removedPage - 1) * REMOVED_PAGE_SIZE;
                const endIdx = startIdx + REMOVED_PAGE_SIZE;
                const paginatedAds = removedAds.slice(startIdx, endIdx);
                return paginatedAds.map(product => (
                  <div key={product.id} className="bg-white border border-gray-300 shadow-sm rounded-xl p-4 flex flex-col">
                    <div className="w-full flex justify-center items-center mb-4">
                      {product.product_images && product.product_images.length > 0 ? (
                        <img src={product.product_images[0]} alt="Product" className="h-48 w-full object-cover rounded-lg" />
                      ) : (
                        <div className="h-48 w-full bg-gray-100 flex items-center justify-center rounded-lg text-gray-400">No Image</div>
                      )}
                    </div>
                    <div className="flex-1 flex flex-col">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg font-bold">{product.product_name}</span>
                        <span className="bg-gray-500 text-white rounded-full px-2 py-1 text-xs font-semibold">Removed</span>
                      </div>
                      <div className="text-sm mb-1"><span className="font-semibold">Product ID:</span> {product.id}</div>
                      <div className="text-sm mb-1"><span className="font-semibold">Seller ID:</span> {product.seller_id}</div>
                      <div className="text-sm mb-1"><span className="font-semibold">Seller:</span> {product.seller_name}</div>
                      <div className="text-sm mb-1"><span className="font-semibold">Category:</span> {product.category}</div>
                      {/* Description, Price, and Status removed from card. Only shown in Product Details modal. */}
                      <div className="mt-2 flex justify-end gap-2">
                        <button
                          className="px-4 py-1 rounded-lg bg-green-600 text-white text-sm font-semibold hover:bg-green-700"
                          onClick={() => setViewProduct(product)}
                        >Product Details</button>
                        <button
                          className="px-2 py-1 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700 flex items-center"
                          title="Delete Permanently"
                          onClick={async () => {
                            // Replace alert with popup message for confirmation
                            setPopupMessage('Are you sure you want to permanently delete this product? This action cannot be undone.');
                            setPopupType('error');
                            // Wait for user confirmation using a custom modal
                            const confirmDelete = await new Promise(resolve => {
                              const handleConfirm = () => {
                                closePopup();
                                resolve(true);
                              };
                              const handleCancel = () => {
                                closePopup();
                                resolve(false);
                              };
                              setPopupMessage(
                                <div>
                                  <div className="mb-4">Are you sure you want to permanently delete this product? This action cannot be undone.</div>
                                  <div className="flex gap-4 justify-end">
                                    <button className="px-4 py-2 rounded bg-gray-300 text-gray-700 font-semibold mr-2" onClick={handleCancel}>Cancel</button>
                                    <button className="px-4 py-2 rounded bg-red-600 text-white font-semibold" onClick={handleConfirm}>Delete</button>
                                  </div>
                                </div>
                              );
                            });
                            if (confirmDelete) {
                              try {
                                const res = await fetch(`${API_BASE}/backend/admin/content_moderation/delete_product_permanent.php`, {
                                  method: 'POST',
                                  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                                  body: `productId=${encodeURIComponent(product.id)}`
                                });
                                const data = await res.json();
                                if (data.success) {
                                  showPopup('Product permanently deleted.', 'success');
                                  setRemovedAds(prev => prev.filter(p => p.id !== product.id));
                                } else {
                                  showPopup(data.message || 'Failed to delete product.', 'error');
                                }
                              } catch (e) {
                                showPopup('Network error. Could not delete product.', 'error');
                              }
                            }
                          }}
                        ><Trash2 className="h-5 w-5 mr-1" /> </button>
                      </div>
                    </div>
                  </div>
                ));
              })()}
              {/* Pagination controls */}
              {removedAds.length > REMOVED_PAGE_SIZE && (
                <div className="flex justify-center items-center gap-2 mt-6">
                  <button
                    className="px-3 py-1 rounded bg-gray-200 text-gray-700 font-semibold disabled:opacity-50"
                    onClick={() => setRemovedPage(p => Math.max(1, p - 1))}
                    disabled={removedPage === 1}
                  >Previous</button>
                  <span className="px-2">Page {removedPage} of {Math.ceil(removedAds.length / REMOVED_PAGE_SIZE)}</span>
                  <button
                    className="px-3 py-1 rounded bg-gray-200 text-gray-700 font-semibold disabled:opacity-50"
                    onClick={() => setRemovedPage(p => Math.min(Math.ceil(removedAds.length / REMOVED_PAGE_SIZE), p + 1))}
                    disabled={removedPage === Math.ceil(removedAds.length / REMOVED_PAGE_SIZE)}
                  >Next</button>
                </div>
              )}
            </div>
          )}
        </>
      )}
      <FlagDetailsModal
        open={!!viewFlag}
        flag={viewFlag}
        onClose={() => setViewFlag(null)}
      />
      <ProductDetailsModal
        open={!!viewProduct}
        product={viewProduct}
        onClose={() => setViewProduct(null)}
      />
      <ConfirmRemoveModal
        open={!!removeAd}
        ad={removeAd}
        onCancel={() => setRemoveAd(null)}
        onConfirm={() => handleRemove(removeAd)}
      />
      <PopupMessage
        message={popupMessage}
        type={popupType}
        onClose={closePopup}
      />
    </div>
  );
};

export default ContentModeration;