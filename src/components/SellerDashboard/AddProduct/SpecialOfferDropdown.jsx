import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const SpecialOfferDropdown = ({ value, onChange, error }) => {
  const [isOpen, setIsOpen] = useState(false);

  const offers = [
    'No Special Offer',
    '5% Off',
    '10% Off',
    '15% Off',
    '20% Off',
    '25% Off',
    '30% Off',
    'Buy 1 Get 1 Free',
    'Buy 2 Get 1 Free',
    'Limited Time Offer'
  ];

  const handleSelect = (offer) => {
    onChange(offer);
    setIsOpen(false);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-700">
        Special Offer Tag <span className="text-gray-500">(Optional)</span>
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
            {value || 'Select a Tag'}
          </span>
          <ChevronDown 
            size={20} 
            className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          />
        </button>
        
        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-xl shadow-lg max-h-60 overflow-y-auto">
            {offers.map((offer) => (
              <button
                key={offer}
                type="button"
                onClick={() => handleSelect(offer)}
                className="w-full px-4 py-3 text-left hover:bg-green-50 hover:text-green-600 transition-colors duration-200 first:rounded-t-xl last:rounded-b-xl"
              >
                {offer}
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

export default SpecialOfferDropdown;