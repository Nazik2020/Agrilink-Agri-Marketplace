import React from 'react';

export const Avatar = ({ className = '', children, ...props }) => (
  <span className={`inline-flex items-center justify-center rounded-full bg-muted ${className}`} {...props}>
    {children}
  </span>
);

export const AvatarFallback = ({ className = '', children, ...props }) => (
  <span className={`flex items-center justify-center w-full h-full rounded-full bg-muted text-muted-foreground ${className}`} {...props}>
    {children}
  </span>
); 