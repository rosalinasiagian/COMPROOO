import React from "react";

export const Button = ({ children, className = "", variant = "primary", ...props }) => {
  const base = "px-4 py-2 text-sm active:scale-95 transition-all";
  const variants = {
    primary: "mpl-btn-primary",
    outline: "bg-white text-gray-800 border border-gray-200 hover:bg-gray-50 rounded-lg",
  };

  return (
    <button
      className={`${base} ${variants[variant] ?? variants.primary} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};