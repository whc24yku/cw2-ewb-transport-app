// src/components/Sidebar.jsx

import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="w-64 bg-gray-800 text-white min-h-screen">
      <div className="p-5">
        <h2 className="text-2xl font-semibold">GoLobitos</h2>
      </div>
      <nav className="mt-5">
        <ul className="space-y-4">
          <li>
            <Link to="/customer/landing" className="block px-4 py-2 hover:bg-teal-600 transition-all">
              Home
            </Link>
          </li>
          <li>
            <Link to="/customer/dashboard" className="block px-4 py-2 hover:bg-teal-600 transition-all">
              Dashboard
            </Link>
          </li>
          <li>
            <Link to="/customer/book-transport" className="block px-4 py-2 hover:bg-teal-600 transition-all">
              Book Transport
            </Link>
          </li>
          <li>
            <Link to="/customer/settings" className="block px-4 py-2 hover:bg-teal-600 transition-all">
              Settings
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
