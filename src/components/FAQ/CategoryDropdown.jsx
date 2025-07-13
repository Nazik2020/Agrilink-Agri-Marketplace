import React from 'react';
import { ChevronDown } from 'lucide-react';

const CategoryDropdown = ({ selectedCategory, onCategoryChange, categories }) => {
  return (
    <div className="relative w-full">
      <select
        value={selectedCategory}
        onChange={(e) => onCategoryChange(e.target.value)}
        className="appearance-none w-full py-4 px-4 border-2 border-gray-200 rounded-xl text-base outline-none bg-white cursor-pointer transition-all duration-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
      >
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
      <div className="absolute top-1/2 right-4 transform -translate-y-1/2 pointer-events-none text-gray-400">
        <ChevronDown size={20} />
      </div>
    </div>
  );
};

export default CategoryDropdown;