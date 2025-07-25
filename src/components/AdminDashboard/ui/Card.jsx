import React from 'react';

const Card = ({ className = '', children, ...props }) => (
  <div className={`bg-white dark:bg-card rounded-lg border border-border shadow-sm ${className}`} {...props}>
    {children}
  </div>
);

export const CardHeader = ({ className = '', children, ...props }) => (
  <div className={`px-4 pt-4 pb-2 border-b border-border ${className}`} {...props}>
    {children}
  </div>
);

export const CardTitle = ({ className = '', children, ...props }) => (
  <h3 className={`text-lg font-semibold ${className}`} {...props}>
    {children}
  </h3>
);

export const CardContent = ({ className = '', children, ...props }) => (
  <div className={`px-4 py-2 ${className}`} {...props}>
    {children}
  </div>
);

export default Card; 