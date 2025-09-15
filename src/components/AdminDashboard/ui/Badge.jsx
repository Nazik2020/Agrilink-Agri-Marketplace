import React from 'react';

const variants = {
  default: 'bg-muted text-foreground',
  primary: 'bg-primary text-primary-foreground',
  secondary: 'bg-secondary text-secondary-foreground',
  success: 'bg-success text-success-foreground',
  warning: 'bg-warning text-warning-foreground',
  info: 'bg-info text-info-foreground',
  destructive: 'bg-destructive text-destructive-foreground',
};

const Badge = ({ variant = 'default', className = '', children, ...props }) => (
  <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${variants[variant] || variants.default} ${className}`} {...props}>
    {children}
  </span>
);

export default Badge; 