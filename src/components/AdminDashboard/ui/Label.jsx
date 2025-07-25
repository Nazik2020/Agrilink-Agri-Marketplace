import React from 'react';

const Label = ({ className = '', children, ...props }) => (
  <label className={`block text-sm font-medium text-foreground ${className}`} {...props}>
    {children}
  </label>
);

export default Label; 