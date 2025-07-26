import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FAQItem = ({ question, answer, isOpen, onToggle }) => {
  return (
    <div className="border border-gray-200 rounded-xl mb-3 overflow-hidden transition-all duration-200 ">
      <button 
        onClick={onToggle} 
        className={`w-full p-5 bg-white text-left text-base font-medium text-gray-800 cursor-pointer flex justify-between items-center transition-all duration-200 hover:bg-gray-50 ${
          isOpen ? 'bg-emerald-50 text-emerald-600 border-2 border-emerald-500' : ''
        }`}
      >
        <span className="flex-1">{question}</span>
        <span className={`text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
          {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </span>
      </button>
      {isOpen && (
        <div className="px-5 pb-5 text-gray-600 leading-relaxed bg-gray-50 border-t border-gray-100">
          <div className="pt-4">{answer}</div>
        </div>
      )}
    </div>
  );
};

export default FAQItem;