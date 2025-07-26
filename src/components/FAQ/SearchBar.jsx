import React from 'react';
import { Search } from 'lucide-react';

const SearchBar = ({ searchTerm, onSearchChange, placeholder = "Search for answers" }) => {
  return (
    <div className="relative w-full ">
      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 z-10 pointer-events-none">
        <Search size={20} />
      </div>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl outline-none transition-all duration-200 bg-white text-base focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
      />
    </div>
  );
};

export default SearchBar;