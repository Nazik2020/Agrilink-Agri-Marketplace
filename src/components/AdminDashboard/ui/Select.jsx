import React from 'react';

export const Select = ({ value, onValueChange, children, className = '', ...props }) => (
  <select
    value={value}
    onChange={e => onValueChange && onValueChange(e.target.value)}
    className={`block w-full rounded-md border border-border bg-background text-foreground p-2 focus:ring-2 focus:ring-primary focus:border-primary ${className}`}
    {...props}
  >
    {children}
  </select>
);

export const SelectTrigger = ({ children, ...props }) => <>{children}</>;
export const SelectValue = ({ placeholder, ...props }) => <option value="" disabled>{placeholder}</option>;
export const SelectContent = ({ children, ...props }) => <>{children}</>;
export const SelectItem = ({ value, children, ...props }) => <option value={value} {...props}>{children}</option>; 