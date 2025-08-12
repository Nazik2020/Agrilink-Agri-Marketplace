import React from 'react';

const base = 'inline-flex items-center justify-center font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';

const variants = {
  default: 'bg-primary text-primary-foreground hover:bg-primary/90',
  outline: 'border border-border bg-transparent hover:bg-muted',
  ghost: 'bg-transparent hover:bg-muted',
  destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
};

const sizes = {
  sm: 'h-8 px-3 text-sm',
  md: 'h-10 px-4 text-base',
  lg: 'h-12 px-6 text-lg',
};

const Button = ({
  variant = 'default',
  size = 'md',
  className = '',
  children,
  ...props
}) => (
  <button
    className={`${base} ${variants[variant] || ''} ${sizes[size] || ''} ${className}`}
    {...props}
  >
    {children}
  </button>
);

export default Button; 