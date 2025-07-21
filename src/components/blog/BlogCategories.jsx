"use client";

import { useState } from "react";

const BlogCategories = ({ onCategoryChange }) => {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = [
    { name: "Technology", icon: "🚜", count: 2 },
    { name: "Sustainability", icon: "🌱", count: 2 },
    { name: "Management", icon: "📊", count: 1 },
    { name: "Innovation", icon: "💡", count: 1 },
    { name: "Tips", icon: "💧", count: 1 },
  ];

  const handleCategorySelect = (categoryName) => {
    setSelectedCategory(categoryName);
    onCategoryChange(categoryName);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Browse by Category</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {categories.map((category) => (
          <button
            key={category.name}
            onClick={() => handleCategorySelect(category.name)}
            className={`group relative overflow-hidden rounded-lg p-4 text-center transition-all duration-300 ${
              selectedCategory === category.name
                ? "bg-green-600 text-white shadow-lg scale-105"
                : "bg-gray-50 hover:bg-gray-100 text-gray-700"
            }`}
          >
            <div className="flex flex-col items-center space-y-2">
              <div
                className={`text-2xl ${
                  selectedCategory === category.name ? "text-white" : "text-green-600"
                }`}
              >
                {category.icon}
              </div>
              <span className="text-sm font-medium">{category.name}</span>
              <span
                className={`text-xs ${
                  selectedCategory === category.name ? "text-green-100" : "text-gray-500"
                }`}
              >
                {category.count} articles
              </span>
            </div>
            <div className="absolute inset-0 bg-green-600 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default BlogCategories;
