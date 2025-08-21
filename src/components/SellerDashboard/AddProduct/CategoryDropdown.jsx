import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const CategoryDropdown = ({ value, onChange, error }) => {
  const [isOpen, setIsOpen] = useState(false);

  const categories = [
    'Select Category',
    'Fertilizer',
    'Tea',
    'Cinnamon',
    'Spices',
    'Seeds',
    'Herbs',
    'Organic Vegetables',
    'Fruits',
    'Grains',
    'Coconut Products',
    'Essential Oils',
    'Ayurvedic Products'
  ];

  const handleSelect = (category) => {
    onChange(category === 'Select Category' ? '' : category);
    setIsOpen(false);
  };

  return (
    <div className="space-y-2">
      <label className="block text-base font-semibold text-gray-500">
        Product Category *
      </label>
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full px-4 py-2 border rounded-xl text-left transition-all duration-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 hover:border-green-400 hover:shadow-md flex items-center justify-between ${
            error ? 'border-red-500' : 'border-gray-300'
          }`}
        >
          <span className={value ? 'text-gray-900' : 'text-gray-500'}>
            {value || 'Select a Category'}
          </span>
          <ChevronDown
            size={20}
            className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          />
        </button>

        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-xl shadow-lg max-h-60 overflow-y-auto">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => handleSelect(category)}
                className="w-full px-4 py-3 text-left hover:bg-green-50 hover:text-green-600 transition-colors duration-200 first:rounded-t-xl last:rounded-b-xl"
              >
                {category}
              </button>
            ))}
          </div>
        )}
      </div>
      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
    </div>
  );
};

export default CategoryDropdown;