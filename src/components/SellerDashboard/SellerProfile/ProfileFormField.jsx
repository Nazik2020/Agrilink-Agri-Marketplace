import React from 'react';

const ProfileFormField = ({ label, name, type = 'text', value, onChange, error, required }) => {
  return (
    <div className="space-y-2">
      <label htmlFor={name} className="block text-base font-semibold text-gray-500">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        value={value || ''}
        onChange={onChange}
        className={`w-full px-4 py-2 border rounded-full transition-all duration-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 hover:border-green-400 hover:shadow-md ${
          error ? 'border-red-500' : 'border-gray-300'
        }`}
        placeholder={`Enter ${label.toLowerCase()}`}
      />
      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
    </div>
  );
};

export default ProfileFormField;