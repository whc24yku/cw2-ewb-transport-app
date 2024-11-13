// src/components/Button.jsx
import React from 'react';

const Button = ({ onClick, className, children }) => {
  return (
    <button
      onClick={onClick}
      className={`bg-[#027f86] text-white px-6 py-3 rounded-lg hover:bg-teal-600 transition-all ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
