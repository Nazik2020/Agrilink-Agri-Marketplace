import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Button, Badge } from './ui';
import { Eye, Trash2, Flag, X } from 'lucide-react';
import { useToast } from './hooks/use-toast';

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

const ContentModeration = () => {
  const { toast } = useToast();
  const [flaggedContent, setFlaggedContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Configure API base via Vite env (define VITE_API_BASE_URL in .env)
  const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

  // Move fetchFlags outside useEffect so it can be called after updates
  const fetchFlags = async () => {
    try {
      const url = `${API_BASE}/backend/admin/content_moderation/list_flags.php`;
      const res = await fetch(url);
      let data;
      const text = await res.text();
      try { data = JSON.parse(text); } catch { data = { success: false, message: 'Invalid JSON', raw: text }; }
      if (!res.ok) {
        console.error('Flags fetch failed', { status: res.status, data });
      }
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
          productId: f.product_id // <-- ensure correct mapping
        }));
        setFlaggedContent(mapped);
        if (mapped.length === 0) setError('No flags submitted yet.');
      } else {
        setError((data && data.message) ? data.message : 'Failed to load flags');
      }
    } catch (e) {
      console.error('Network / parsing error while fetching flags', e);
      setError('Failed to fetch flags from server');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchFlags();
  }, []);

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
      if (!res.ok) {
        console.error('Update flag failed', { status: res.status, data });
      }
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

  const { toast: showToast } = useToast();

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
          showToast({
            title: 'Product Deletion Failed',
            description: data.message || 'Could not delete product',
            variant: 'destructive',
          });
        } else {
          showToast({
            title: 'Product Removed',
            description: 'The product has been deleted from the marketplace.',
            variant: 'destructive',
          });
        }
      } catch (e) {
        showToast({
          title: 'Network Error',
          description: 'Failed to delete product from server',
          variant: 'destructive',
        });
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
        <h2 className="text-2xl font-bold  text-green-700 mb-2">Content Moderation</h2>
        <p className="text-muted-foreground">Review and manage flagged advertisements and content</p>
      </div>
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
      <FlagDetailsModal
        open={!!viewFlag}
        flag={viewFlag}
        onClose={() => setViewFlag(null)}
      />
      <ConfirmRemoveModal
        open={!!removeAd}
        ad={removeAd}
        onCancel={() => setRemoveAd(null)}
        onConfirm={() => handleRemove(removeAd)}
      />
    </div>
  );
};

export default ContentModeration;