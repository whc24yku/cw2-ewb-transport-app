  // src/App.jsx

  import React from 'react';
  import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Use Routes instead of Switch
  import Sidebar from './components/Sidebar';
  import Navbar from './components/Navbar';
  import Landing from './pages/Landing'; // Import the customer landing page
  import Login from './pages/Auth/Login'; // Import Login page
  import CustomerDashboard from './pages/Customer/Dashboard';
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

  const App = () => {
    return (
      <Router>
        <div className="flex">
          {/* <Sidebar />  Sidebar is always visible on the left side */}
          <div className="flex-1 p-5">
            {/* <Navbar />  Navbar for navigation */}
            <Routes>
              {/* Define routes using Routes and Route in react-router-dom v6 */}
              <Route path="/" element={<Landing />} />
              <Route path="/landing" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/customer/dashboard" element={<CustomerDashboard />} />
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
    );
  };

  export default App;
