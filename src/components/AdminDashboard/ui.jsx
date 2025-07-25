import React from "react";

export const Button = ({ children, ...props }) => (
  <button {...props}>{children}</button>
);

export const Badge = ({ children, ...props }) => (
  <span {...props}>{children}</span>
);

export const Card = ({ children, ...props }) => <div {...props}>{children}</div>;
export const CardContent = ({ children, ...props }) => <div {...props}>{children}</div>;
export const CardHeader = ({ children, ...props }) => <div {...props}>{children}</div>;
export const CardTitle = ({ children, ...props }) => <h2 {...props}>{children}</h2>;
export const Avatar = ({ children, ...props }) => <div {...props}>{children}</div>;
export const AvatarFallback = ({ children, ...props }) => <div {...props}>{children}</div>;
export const Textarea = ({ children, ...props }) => (
  <textarea {...props}>{children}</textarea>
);
export const Label = ({ children, ...props }) => (
  <label {...props}>{children}</label>
);

// Add these for Select support
export const Select = ({ children, ...props }) => (
  <select {...props}>{children}</select>
);
export const SelectContent = ({ children, ...props }) => (
  <div {...props}>{children}</div>
);
export const SelectItem = ({ children, ...props }) => (
  <option {...props}>{children}</option>
);
export const SelectTrigger = ({ children, ...props }) => (
  <div {...props}>{children}</div>
);
export const SelectValue = ({ children, ...props }) => (
  <span {...props}>{children}</span>
);