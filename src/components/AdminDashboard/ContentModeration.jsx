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

const ContentModeration = () => {
  const { toast } = useToast();
  const [flaggedContent, setFlaggedContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Configure API base via Vite env (define VITE_API_BASE_URL in .env)
  const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

  React.useEffect(() => {
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
            title: f.product_name || 'Seller Flag',
            seller: f.seller_name || f.seller_email || 'Unknown seller',
            reason: f.reason,
            reports: 1, // each row is a single flag; aggregation can be added later
            status: f.status,
            category: f.category,
            reporter: f.reporter_name || f.reporter_email || 'Unknown reporter',
            created_at: f.created_at
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
        setFlaggedContent(prev => prev.map(f => f.id === id ? { ...f, status: newStatus } : f));
        toast({ title: 'Status Updated', description: `Flag #${id} set to ${newStatus}` });
      } else {
        toast({ title: 'Update Failed', description: data.message || 'Could not update flag', variant: 'destructive' });
      }
    } catch (e) {
      toast({ title: 'Network Error', description: 'Failed to reach server', variant: 'destructive' });
    }
  };
  const [removeAd, setRemoveAd] = useState(null);

  const { toast: showToast } = useToast();

  const handleRemove = (adId) => {
    setFlaggedContent(prev => prev.filter(ad => ad.id !== adId));
    setRemoveAd(null);
    showToast({
      title: 'Ad Removed',
      description: 'The advertisement has been removed.',
      variant: 'destructive',
    });
  };

  const getStatusColor = (reports) => {
    if (reports >= 4) return 'destructive';
    if (reports >= 3) return 'warning';
    return 'secondary';
  };

  return (
    <div className="space-y-6 px-2 sm:px-4">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Content Moderation</h2>
        <p className="text-muted-foreground">Review and manage flagged advertisements and content</p>
      </div>
      {loading && <p>Loading flagged content...</p>}
      {!loading && error && <p className="text-red-500">{error}</p>}
      {!loading && !error && (
        <div className="space-y-6">
          {flaggedContent.map((content) => (
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
                    onClick={() => updateFlagStatus(content.id, 'resolved')}
                  >Resolve</button>
                  <button
                    className="border border-gray-300 rounded px-3 py-1 text-sm font-semibold hover:bg-gray-100"
                    onClick={() => updateFlagStatus(content.id, 'dismissed')}
                  >Dismiss</button>
                  <button
                    className="bg-red-500 text-white rounded px-3 py-1 text-sm font-semibold hover:bg-red-600"
                    onClick={() => setRemoveAd(content)}
                  >Remove</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <ConfirmRemoveModal
        open={!!removeAd}
        ad={removeAd}
        onCancel={() => setRemoveAd(null)}
        onConfirm={() => handleRemove(removeAd?.id)}
      />
    </div>
  );
};

export default ContentModeration;