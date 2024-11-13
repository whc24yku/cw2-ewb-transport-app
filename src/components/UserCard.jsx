// src/components/UserCard.jsx

import React from 'react';

const UserCard = ({ name, email, avatarUrl }) => {
  return (
    <div className="bg-white p-5 rounded-lg shadow-md flex items-center space-x-4">
      <img
        src={avatarUrl || 'https://via.placeholder.com/50'}
        alt="User Avatar"
        className="w-12 h-12 rounded-full"
      />
      <div>
        <h3 className="text-xl font-semibold">{name || 'User Name'}</h3>
        <p className="text-sm text-gray-500">{email || 'user@example.com'}</p>
      </div>
    </div>
  );
};

export default UserCard;
