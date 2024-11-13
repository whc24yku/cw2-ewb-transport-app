// src/pages/Customer/Login.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Customer'); // Default role set to 'Customer'
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    navigate(`/${role.toLowerCase()}/dashboard`); // Redirect based on selected role
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-r from-[#027f86] to-purple-600 text-white flex flex-col overflow-hidden m-0 p-0">
      <div className="flex-grow flex items-center justify-center">
        <div className="bg-white text-[#027f86] p-8 rounded-lg shadow-lg max-w-lg w-full text-center">
          {/* Logo Display */}
          <div className="flex items-center justify-center mb-6">
            <div className="w-12 h-12 bg-yellow-400 text-[#027f86] rounded-full flex items-center justify-center font-bold text-xl">
              Go
            </div>
            <h1 className="text-xl font-semibold text-[#027f86] ml-3">GoLobitos</h1>
          </div>

          <h2 className="text-3xl font-semibold mb-6">Login to GoLobitos</h2>

          {/* Role Selector */}
          <nav className="flex justify-center space-x-4 mb-6">
            {['Customer', 'Admin', 'Driver', 'Medic', 'Seller'].map((roleOption) => (
              <button
                key={roleOption}
                onClick={() => setRole(roleOption)}
                className={`px-4 py-2 rounded-full ${
                  role === roleOption
                    ? 'bg-[#027f86] text-white'
                    : 'bg-gray-200 text-gray-700'
                } hover:bg-[#027f86] hover:text-white transition-all`}
              >
                {roleOption}
              </button>
            ))}
          </nav>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-gray-700">Email</label>
              <input
                type="email"
                id="email"
                className="w-full p-3 border rounded-lg text-gray-800"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-gray-700">Password</label>
              <input
                type="password"
                id="password"
                className="w-full p-3 border rounded-lg text-gray-800"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[#027f86] text-white py-3 rounded-lg hover:bg-teal-600 transition-all"
            >
              Login as {role}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
