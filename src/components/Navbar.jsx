// src/components/Navbar.jsx

import React from 'react';
import { Link } from 'react-router-dom';  // Use Link from react-router-dom for routing

const Navbar = () => {
  return (
    <header className="bg-[#027f86] text-white p-5 shadow-md">
      <div className="flex items-center justify-between">
        {/* Logo and App Name */}
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-yellow-400 text-[#027f86] rounded-full flex items-center justify-center font-bold text-xl">
            Go
          </div>
          <h1 className="text-2xl font-semibold">GoLobitos</h1>
        </div>

        {/* Navigation Links */}
        <nav className="space-x-6">
          <Link
            to="/customer/landing"  // Adjust according to your actual routes
            className="text-white hover:text-yellow-300 transition-all"
          >
            Home
          </Link>
          <Link
            to="/about"
            className="text-white hover:text-yellow-300 transition-all"
          >
            About Us
          </Link>
          <Link
            to="/contact"
            className="text-white hover:text-yellow-300 transition-all"
          >
            Contact
          </Link>
          <Link
            to="/login"
            className="bg-yellow-300 text-[#027f86] px-4 py-2 rounded-lg hover:bg-yellow-400 transition-all"
          >
            Login
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
