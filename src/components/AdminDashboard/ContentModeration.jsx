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
  const [flaggedContent, setFlaggedContent] = useState([
    {
      id: 1,
      title: 'Premium Organic Tomatoes',
      seller: 'Jane Farmer',
      reason: 'Misleading claims',
      reports: 3,
      status: 'pending'
    },
    {
      id: 2,
      title: 'Fresh Milk Direct',
      seller: 'Bob Smith',
      reason: 'Inappropriate content',
      reports: 2,
      status: 'pending'
    },
    {
      id: 3,
      title: 'Organic Vegetables Bundle',
      seller: 'Green Valley Farm',
      reason: 'Spam content',
      reports: 1,
      status: 'pending'
    },
    {
      id: 4,
      title: 'Farm Fresh Eggs',
      seller: 'Sunny Side Farm',
      reason: 'False advertising',
      reports: 4,
      status: 'urgent'
    }
  ]);
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
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Content Moderation
        </h2>
        <p className="text-muted-foreground">
          Review and manage flagged advertisements and content
        </p>
      </div>

      <div className="space-y-6">
        {flaggedContent.map((content) => (
          <div
            key={content.id}
            className="bg-white border border-red-200 shadow-sm rounded-xl p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-lg font-bold">{content.title}</span>
                <span className="bg-red-500 text-white rounded-full px-3 py-1 text-xs font-semibold">{content.reports} reports</span>
              </div>
              <div className="text-sm mb-1">
                <span className="font-semibold">Seller:</span> {content.seller}
              </div>
              <div className="text-sm text-red-600">
                <span className="font-semibold">Reason:</span> {content.reason}
              </div>
            </div>
            <div className="flex gap-3 mt-4 sm:mt-0">
              <button
                className="border border-gray-300 rounded px-3 py-1 text-sm flex items-center gap-2 font-semibold hover:bg-gray-100"
                onClick={() => toast({
                  title: "Review Started",
                  description: `Content review for item #${content.id} has been initiated`,
                  variant: "default"
                })}
              >
                <Eye className="h-4 w-4" /> Review
              </button>
              <button
                className="bg-red-500 text-white rounded px-3 py-1 text-sm flex items-center gap-2 font-semibold hover:bg-red-600"
                onClick={() => setRemoveAd(content)}
              >
                <Trash2 className="h-4 w-4" /> Remove
              </button>
            </div>
          </div>
        ))}
      </div>
      <ConfirmRemoveModal
        open={!!removeAd}
        ad={removeAd}
        onCancel={() => setRemoveAd(null)}
        onConfirm={() => handleRemove(removeAd.id)}
      />
    </div>
  );
};

export default ContentModeration;