import React from 'react';

const Textarea = React.forwardRef(({ className = '', ...props }, ref) => (
  <textarea
    ref={ref}
    className={`block w-full rounded-md border border-border bg-background text-foreground p-2 focus:ring-2 focus:ring-primary focus:border-primary ${className}`}
    {...props}
  />
));

export default Textarea; 