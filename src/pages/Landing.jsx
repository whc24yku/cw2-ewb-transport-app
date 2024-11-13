// src/pages/Landing.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar'; // Import Navbar component
import peopleIcon from '../assets/images/100.png';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 bg-gradient-to-r from-[#027f86] to-purple-600 text-white flex flex-col overflow-hidden m-0 p-0">
      {/* Navbar Section */}
      <Navbar />  {/* Reusing the Navbar component */}

      {/* Main Content Section */}
      <section className="flex-grow flex flex-col md:flex-row items-center justify-between w-full px-0 py-0">
        {/* Left Side - Text Content */}
        <div className="md:w-3/5 flex flex-col justify-center items-center space-y-6 text-justify px-4">
          <h2 className="text-3xl font-bold mb-4">A New Way to Transport</h2>
          <p className="text-lg text-white leading-relaxed">
            GoLobitos is a community-centered app designed to make transportation accessible, affordable, and easy for
            everyone in Lobitos. From local rides to emergency transport, GoLobitos connects you with reliable transport
            options at any time, empowering the local economy, boosting sustainable tourism and fostering community growth.
          </p>
          <p className="text-lg text-white leading-relaxed">
            Discover absolute ride-booking, access to a local marketplace, and emergency support, all in one platform.
            Our mission is to create a positive impact by connecting people to essential services and opportunities
            while promoting eco-friendly travel.
          </p>

          {/* Signup Box */}
          <div className="bg-white text-[#027f86] p-6 rounded-xl shadow-lg max-w-sm">
            <h3 className="text-2xl font-semibold mb-4">Get Started with GoLobitos</h3>
            <p className="text-gray-600 mb-4">Join the community and experience hassle-free transport across Lobitos.</p>
            <button
              onClick={() => navigate('/login')}
              className="bg-[#027f86] text-white px-6 py-3 w-full font-semibold rounded-lg hover:bg-teal-600 transition-all"
            >
              Sign Up
            </button>
          </div>
        </div>

        {/* Right Side - Image Section */}
        <div className="md:w-2/5 flex justify-right items-center relative flex-row-reverse p-0">
          <img
            src={peopleIcon}  // Using the imported local .jpeg image
            alt="People Icon"
            className="absolute -left-6 -bottom- w-30 h-30"
            style={{ transform: 'translateX(80px)' }}
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-400 text-center p-6 mt-0">
        <p>&copy; 2023 GoLobitos. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Landing;
