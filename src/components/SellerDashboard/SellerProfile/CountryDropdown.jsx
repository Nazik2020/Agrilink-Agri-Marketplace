import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const CountryDropdown = ({ value, onChange, error }) => {
  const [isOpen, setIsOpen] = useState(false);

  const countries = [
    'Afghanistan', 'Albania', 'Algeria', 'Argentina', 'Australia', 'Austria',
    'Bangladesh', 'Belgium', 'Brazil', 'Canada', 'China', 'Denmark',
    'Egypt', 'Finland', 'France', 'Germany', 'Greece', 'India',
    'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Italy', 'Japan',
    'Kenya', 'Malaysia', 'Mexico', 'Netherlands', 'New Zealand', 'Norway',
    'Pakistan', 'Philippines', 'Poland', 'Portugal', 'Russia', 'Saudi Arabia',
    'Singapore', 'South Africa', 'South Korea', 'Spain', 'Sri Lanka', 'Sweden',
    'Switzerland', 'Thailand', 'Turkey', 'Ukraine', 'United Kingdom', 'United States',
    'Vietnam'
  ];

  const handleSelect = (country) => {
    onChange(country);
    setIsOpen(false);
  };

  return (
    <div className="space-y-2">
      <label className="block text-base font-semibold text-gray-500">
        Country <span className="text-red-500">*</span>
      </label>
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full px-4 py-2 border rounded-full text-left transition-all duration-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 hover:border-green-400 hover:shadow-md flex items-center justify-between ${
            error ? 'border-red-500' : 'border-gray-300'
          }`}
        >
          <span className={value ? 'text-gray-900' : 'text-gray-500'}>
            {value || 'Select country'}
          </span>
          <ChevronDown 
            size={20} 
            className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          />
        </button>
        
        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-xl shadow-lg max-h-60 overflow-y-auto">
            {countries.map((country) => (
              <button
                key={country}
                type="button"
                onClick={() => handleSelect(country)}
                className="w-full px-4 py-3 text-left hover:bg-green-50 hover:text-green-600 transition-colors duration-200 first:rounded-t-xl last:rounded-b-xl"
              >
                {country}
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

export default CountryDropdown;