// src/App.jsx

import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import { LanguageProvider } from './context/LanguageContext';
import Landing from './pages/Landing'; // Import the customer landing page
import Login from './pages/Auth/Login'; // Import Login page
import CustomerDashboard from './pages/Customer/Dashboard';
import CustomerDashboardFree from './pages/Customer/DashboardFree';
import CustomerBookTransport from './pages/Customer/BookTransport';
import CustomerMarketplace from './pages/Customer/Marketplace';
import CustomerEmergencyConfirmation from './pages/Customer/EmergencyConfirmation';
import CustomerSettings from './pages/Customer/Settings'; 
import AdminDashboard from './pages/Admin/Dashboard';
import AdminBookTransport from './pages/Admin/BookTransport';
import AdminEmergencyBooking from './pages/Admin/EmergencyBooking';
import Analytics from './pages/Admin/Analytics';
import ManageDrivers from './pages/Admin/ManageDrivers';
import DriverDashboard from './pages/Driver/Dashboard';
import MedicDashboard from './pages/Medic/Dashboard';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import ENV from './env'; 



const AuthCallback = () => {
  const { isAuthenticated, loginWithRedirect, user, error, getAccessTokenSilently } = useAuth0();
  

  useEffect(() => {
    if (isAuthenticated && user) {
      localStorage.setItem('userDetails', JSON.stringify({ name: user.name, email: user.email }));
      const userDetails = JSON.parse(localStorage.getItem('userDetails'));
      const name = userDetails.name;
      // Fetch role from localStorage (if available) and map the user role to the DB
      const role = localStorage.getItem('role');
      if (role) {
        mapUserRoleToDB(user.email, role, name);
        console.log(role)
      }
    }
  }, [isAuthenticated, user]);

  const mapUserRoleToDB = async (email, role, name) => {
    try {
      
      // Get an Auth0 access token to make a secure API request
      const accessToken = await getAccessTokenSilently();
      // API call to backend to map the role to the user
      const response = await axios.post(`${ENV.API_BASE_URL}/user/map-role`, { email, role, name }, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        }
        
      });

      console.log(response)

      // Redirect the user to their respective dashboard
      
      window.location.replace(`/${role.toLowerCase()}/dashboard`);
      
    } catch (error) {
      console.error('Error mapping user role:', error);
      // Handle error gracefully, e.g., display a message to the user
    }
  };

  if (error) {
    return <div className="text-red-500">Error: {error.message}</div>;
  }

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="text-center">
        <div className="animate-spin h-16 w-16 border-t-4 border-b-4 border-blue-500 rounded-full mx-auto mb-4"></div>
        <p className="text-gray-700 text-lg">Redirecting...</p>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <LanguageProvider>
      <Router>
        <div className="flex">
          {/* Sidebar and Navbar are optional and can be added */}
          {/* <Sidebar /> */}
          <div className="flex-1 p-5">
            <Routes>
              {/* Define routes */}
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route path="/" element={<Landing />} />
              <Route path="/landing" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/customer/dashboard" element={<CustomerDashboard />} />
              <Route path="/customer/dashboard-free" element={<CustomerDashboardFree />} />
              <Route path="/customer/book-transport" element={<CustomerBookTransport />} />
              <Route path="/customer/marketplace" element={<CustomerMarketplace />} />
              <Route path="/customer/emergency-confirmation" element={<CustomerEmergencyConfirmation />} />
              <Route path="/customer/settings" element={<CustomerSettings />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/booktransport" element={<AdminBookTransport />} />
              <Route path="/admin/emergencybooking" element={<AdminEmergencyBooking />} />
              <Route path="/admin/analytics" element={<Analytics />} />
              <Route path="/admin/managedrivers" element={<ManageDrivers />} />
              <Route path="/driver/dashboard" element={<DriverDashboard />} />
              <Route path="/medic/dashboard" element={<MedicDashboard />} />
            </Routes>
          </div>
        </div>
      </Router>
    </LanguageProvider>
  );
};

export default App;
