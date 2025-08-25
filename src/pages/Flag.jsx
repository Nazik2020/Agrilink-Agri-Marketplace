/*import React, { useState } from 'react';

const Flag = () => {
  // Mock data for demonstration
  const [flags] = useState([
    {
      flag_id: 1,
      seller_id: 1,
      product_id: 1,
      category: "Misleading claims",
      reason: "The product description says organic but no certification shown",
      created_at: "2025-01-20T10:30:00Z",
      seller_name: "John Farmer",
      seller_email: "john@example.com",
      product_name: "Premium Organic Tomatoes",
      customer_name: "Alice Customer",
      customer_email: "alice@example.com"
    },
    {
      flag_id: 2,
      seller_id: 2,
      product_id: null,
      category: "Inappropriate content",
      reason: "Seller is using inappropriate language in product descriptions",
      created_at: "2025-01-19T15:45:00Z",
      seller_name: "Bob Smith",
      seller_email: "bob@example.com",
      product_name: null,
      customer_name: "Mike Customer",
      customer_email: "mike@example.com"
    },
    {
      flag_id: 3,
      seller_id: 3,
      product_id: 3,
      category: "Other",
      reason: "Price seems too good to be true, might be fake products",
      created_at: "2025-01-18T09:20:00Z",
      seller_name: "Carol Farm",
      seller_email: "carol@example.com",
      product_name: "Fresh Milk Direct",
      customer_name: "Sarah Customer",
      customer_email: "sarah@example.com"
    }
  ]);

  const stats = {
    totalFlags: flags.length,
    pendingFlags: flags.length,
    resolvedFlags: 0
  };

  const handleFlagAction = (flagId, action) => {
    alert(`Flag #${flagId} ${action}d successfully! (Frontend only - no backend)`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <span className="text-2xl mr-3">🚩</span>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Content Flags</h1>
                <p className="text-sm text-gray-500">Monitor and manage flagged content</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards 
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center">
                  <span className="text-blue-600 font-semibold">📊</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Flags</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalFlags}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-100 rounded-md flex items-center justify-center">
                  <span className="text-yellow-600 font-semibold">⏳</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Pending Review</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.pendingFlags}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-md flex items-center justify-center">
                  <span className="text-green-600 font-semibold">✅</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Resolved</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.resolvedFlags}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Flags List 
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Flagged Content</h2>
            <p className="text-sm text-gray-500">Review and manage reported content</p>
          </div>

          {flags.length === 0 ? (
            <div className="text-center py-12">
              <span className="text-6xl">🎉</span>
              <h3 className="mt-4 text-lg font-medium text-gray-900">No flags found</h3>
              <p className="mt-2 text-sm text-gray-500">Great! No content has been flagged yet.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {flags.map((flag) => (
                <div key={flag.flag_id} className="px-6 py-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      {/* Flag Header 
                      <div className="flex items-center space-x-3 mb-3">
                        <span className="text-lg">🚩</span>
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">
                            {flag.product_name || 'Seller Profile'}
                          </h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>Flag ID: #{flag.flag_id}</span>
                            <span>•</span>
                            <span>{new Date(flag.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>

                      {/* Flag Details 
                      <div className="bg-gray-50 rounded-lg p-4 mb-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm font-medium text-gray-700">Reported Seller</p>
                            <p className="text-sm text-gray-900">{flag.seller_name}</p>
                            <p className="text-xs text-gray-500">{flag.seller_email}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-700">Reported By</p>
                            <p className="text-sm text-gray-900">{flag.customer_name}</p>
                            <p className="text-xs text-gray-500">{flag.customer_email}</p>
                          </div>
                        </div>
                      </div>

                      {/* Category and Reason 
                      <div className="space-y-3">
                        <div>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            {flag.category}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700">Reason:</p>
                          <p className="text-sm text-gray-900 mt-1 bg-white p-3 rounded border">
                            "{flag.reason}"
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Actions 
                    <div className="flex flex-col space-y-2 ml-6">
                      <button
                        onClick={() => handleFlagAction(flag.flag_id, 'resolve')}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                      >
                        <span className="mr-1">✅</span>
                        Resolve
                      </button>
                      <button
                        onClick={() => handleFlagAction(flag.flag_id, 'dismiss')}
                        className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-*/