import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  faBell,
  faSync,
  faPlus,
  faLocationArrow,
  faAngleDown,
  faUser,
  faCar,
} from "@fortawesome/free-solid-svg-icons";
import ENV from '../../env';

const DriverDashboard = ({ driverId }) => {
  const [trips, setTrips] = useState([]);
  const [completetrips, setCompleteTrips] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [expandedRow, setExpandedRow] = useState(null);
  const [userName, setUserName] = useState('Guest');
  const [userEmail, setUserEmail] = useState('');
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const [showCarPopup, setShowCarPopup] = useState(false);
  const [showTripModal, setShowTripModal] = useState(false);
  const [pickupPoint, setPickupPoint] = useState("");
  const [dropoffPoint, setDropoffPoint] = useState("");
  const [carDetails, setCarDetails] = useState({
    type: "small car",
    model: "",
    seats: "",
    make: "",
    chassis_number: "",
    plate_number: "",
    insurance_number: "",
  });
  const [showVehicleFields, setShowVehicleFields] = useState(false); // Manage visibility of vehicle fields
  const [demographics, setDemographics] = useState({
    phoneNumber: "",
    age: "",
    gender: "",
    address: "",
  });
  

  let pendingTrips = trips.filter((trip) => trip.status === "Active");
  let completedTrips = completetrips.filter((trip) => trip.status === "Completed");

  useEffect(() => {
    const userDetails = JSON.parse(localStorage.getItem('userDetails'));
    if (userDetails?.name && userDetails?.email) {
      setUserName(userDetails.name);
      setUserEmail(userDetails.email);
    }
  }, []);




  useEffect(() => {
    const handleOfflineStatus = () => setIsOffline(!navigator.onLine);
    window.addEventListener("online", handleOfflineStatus);
    window.addEventListener("offline", handleOfflineStatus);

    return () => {
      window.removeEventListener("online", handleOfflineStatus);
      window.removeEventListener("offline", handleOfflineStatus);
    };
  }, []);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(`${ENV.API_BASE_URL}/customer/book-transport/get-notifications`);
        setNotifications(response.data.notifications);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      }
    };

    fetchNotifications();
  });

  useEffect(() => {
    const fetchPendingTrips = async () => {
      try {
        const userDetails = JSON.parse(localStorage.getItem('userDetails'));
        const email = userDetails?.email;
  
        if (email) {
          const response = await axios.get(`${ENV.API_BASE_URL}/customer/book-transport/get-driver-notifications`, {
            params: { email },
          });

          console.log("Fetched Notifications: ", response.data.notifications);
  
          const notifications = response.data.notifications;
          const pendingTrips = notifications
            .filter((notif) => notif.status === "pending")
            .map((notif) => ({
              id: notif.id,
              pickup: notif.pickup,
              dropoff: notif.dropoff,
              status: "Active",
              details: `Trip to ${notif.dropoff}, pickup at ${formatDateTime(notif.time_start)}, expected duration: 30 mins.`,
              payment: notif.payment_method,
              price: notif.estimated_price,
              username: notif.user_name,
            }));
            
            console.log("Mapped Pending Trips: ", pendingTrips);
            setTrips(pendingTrips);
          console.log(" Trips: ", trips);
        }
      } catch (error) {
        console.error("Error fetching pending trips:", error);
      }
    };
  
    fetchPendingTrips();
  }, []);

  

  useEffect(() => {
    const fetchCompletedTrips = async () => {
      try {
        const userDetails = JSON.parse(localStorage.getItem('userDetails'));
        const email = userDetails?.email;
  
        if (email) {
          const response = await axios.get(`${ENV.API_BASE_URL}/customer/book-transport/get-driver-notifications`, {
            params: { email },
          });

          console.log("Fetched Notifications: ", response.data.notifications);
  
          const notifications = response.data.notifications;
          const completedTrips = notifications
            .filter((notif) => notif.status === "completed")
            .map((notif) => ({
              id: notif.id,
              pickup: notif.pickup,
              dropoff: notif.dropoff,
              status: "Completed",
              details: `Trip to ${notif.dropoff}, dropoff at ${formatDateTime(notif.time_end)}, expected duration: 30 mins.`,
              payment: notif.payment_method,
              price: notif.estimated_price,
              username: notif.user_name,
            }));
            
            console.log("Mapped Completed Trips: ", completedTrips);
            setCompleteTrips(completedTrips);
          console.log(" Trips: ", trips);
        }
      } catch (error) {
        console.error("Error fetching pending trips:", error);
      }
    };
  
    fetchCompletedTrips();
  }, []);

  pendingTrips = trips.filter((trip) => trip.status === "Active");
  completedTrips = completetrips.filter((trip) => trip.status === "Completed");
  

  //console.log("****Mapped Pending Trips: ", pendingTrips);
  //console.log("****Mapped Completed Trips: ", completedTrips);
  
  
  const handleNotificationClick = () => {
    setShowNotifications((prev) => !prev);
  };

  const handleAction = async (id, action, notification) => {
    const formattedTime = formatDateTime(notification.time_start);
    if (action === "accepted") {
      try {
        // Call the API to assign the driver
        const response = await axios.post(`${ENV.API_BASE_URL}/customer/book-transport/assign-driver`, {
          userEmail,
          bookingId: notification.booking_id,
          notificationId: id,
        });
  
        // If API call is successful, add the notification details to pending trips
        if (response.data.success) {
          setTrips((prevTrips) => [
            ...prevTrips,
            {
              id: notification.bookingId, // Assuming `bookingId` is unique
              pickup: notification.location_departure, // Assuming these fields are in the notification
              dropoff: notification.location_destination,
              status: "Pending",
              details: `Trip to ${notification.location_destination}, pickup at ${formattedTime}, expected duration: 30 mins.`,
              payment: notification.payment_method,
              price: notification.estimated_price,
              username: notification.user_name,
            },
          ]);
          // Remove the notification after processing
          setNotifications((prev) => prev.filter((notif) => notif.id !== id));
        } else {
          console.error("Failed to assign driver:", response.data.message);
          alert("Failed to accept the notification. Please try again.");
        }
      } catch (error) {
        console.error("Error while assigning driver:", error);
        alert("An error occurred. Please try again later.");
      }
    } else if (action === "rejected") {
      // Remove the notification if rejected
      setNotifications((prev) => prev.filter((notification) => notification.id !== id));
    }
  };
  

  const toggleExpandRow = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  // Profile popup toggle function
  const toggleProfilePopup = () => {
    setShowProfilePopup((prevState) => !prevState);
  };


const toggleCarPopup = () => {
  setShowCarPopup(!showCarPopup);
};

  // Handle form data change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCarDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  // Handle form data change for demographics
  const handleDemographicChange = (e) => {
    const { name, value } = e.target;
    setDemographics((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle form data change for car details
  const handleCarDetailChange = (e) => {
    const { name, value } = e.target;
    setCarDetails((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Save demographics details (simulate an API call)
  const saveProfile = async () => {
    try {
      // Replace with an actual API call to save the data
      console.log("Saving demographics: ", demographics);
      setShowProfilePopup(false); // Close the popup after saving
      alert("Profile updated successfully");
    } catch (error) {
      console.error("Error saving profile: ", error);
      alert("Failed to save profile");
    }
  };

   // Save car details (simulate an API call)
   const saveCarDetails = async () => {
    try {
      // Prepare the car details and user email for the API request
      const vehicleData = {
        userEmail, // Email of the user/driver
        type: carDetails.type, // Vehicle type (e.g., car, van, bike)
        model: carDetails.model, // Vehicle model
        seats: carDetails.seats, // Number of seats
        make: carDetails.make, // Vehicle make (e.g., Toyota, Honda)
        chasisNumber: carDetails.chassis_number, // Unique chassis number
        plateNumber: carDetails.plate_number, // Unique plate number
        insuranceNumber: carDetails.insurance_number, // Insurance policy number
      };
  
      // Call the API to save the vehicle details
      const response = await axios.post(`${ENV.API_BASE_URL}/customer/book-transport/add-vehicle`, vehicleData);
  
      // Handle the response from the API
      if (response.data.success) {
        console.log("Vehicle details saved successfully:", response.data);
        setShowCarPopup(false); // Close the popup after saving
        toast.success("Vehicle details updated successfully!");
      } else {
        console.error("Failed to save vehicle details:", response.data.message);
        toast.error("Failed to save vehicle details!");
      }
    } catch (error) {
      console.error("Error saving vehicle details:", error);
      toast.error("Failed to save vehicle details!"); 
    }
  };

  const syncTrips = () => {
    alert("Trips synced successfully!");
    setTrips([]);
  };

  const addTrip = () => {
    if (pickupPoint && dropoffPoint) {
      const newTrip = {
        id: trips.length + 1,
        pickup: pickupPoint,
        dropoff: dropoffPoint,
        status: "Pending",
        details: "Additional trip details go here.",
      };
      setTrips([...trips, newTrip]);
      setPickupPoint("");
      setDropoffPoint("");
      setShowTripModal(false);
    } else {
      alert("Please fill in both pickup and dropoff points.");
    }
  };

  const fetchLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => alert('Failed to fetch location')
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

  const handleCompleteTrip = async (id) => {
    try {
      // Call the API to update the booking status
      const response = await axios.post(`${ENV.API_BASE_URL}/customer/book-transport/complete-booking`, {
        bookingId: id,
      });
  
      if (response.data.success) {
        // Update the trip status in the front-end state only if the API call was successful
        setTrips((prevTrips) =>
          prevTrips.map((trip) =>
            trip.id === id ? { ...trip, status: "Completed" } : trip
          )
        );
      } else {
        console.error('Failed to complete trip:', response.data.message);
        // Optionally, handle error messages in the UI
      }
    } catch (error) {
      console.error('Error in handleCompleteTrip:', error.message);
      // Optionally, handle errors in the UI
    }
  };

  function formatDateTime(dateTime) {
    const date = new Date(dateTime);
  
    const formattedDate = date.toISOString().split("T")[0]; // Extract the date part (YYYY-MM-DD)
    const hours = date.getHours().toString().padStart(2, "0"); // Extract and format hours
    const minutes = date.getMinutes().toString().padStart(2, "0"); // Extract and format minutes
  
    return `${formattedDate} ${hours}:${minutes}`;
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-[#027f86] to-[#3a0ca3] text-white p-6">
      {/* Navbar */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center my-4">
          <div className="w-10 h-10 bg-yellow-400 text-[#027f86] rounded-full flex items-center justify-center font-bold text-lg">
            Go
          </div>
          <h1 className="text-lg font-semibold text-white ml-2">GoLobitos</h1>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={syncTrips}
            className="bg-blue-500 text-white py-1 px-2 text-sm rounded-lg flex items-center justify-center"
          >
            <FontAwesomeIcon icon={faSync} className="mr-2" />
            Sync Trips
          </button>
          <button
            onClick={() => setShowTripModal(true)}
            className="bg-green-500 text-white py-1 px-2 text-sm rounded-lg flex items-center justify-center"
          >
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            Start New Trip
          </button>
          <button
            onClick={fetchLocation}
            className="bg-purple-500 text-white py-1 px-2 text-sm rounded-lg flex items-center justify-center"
          >
            <FontAwesomeIcon icon={faLocationArrow} className="mr-2" />
            Fetch Location
          </button>
        </div>

        {/* Icon Section */}
      <div className="flex items-center space-x-20"> {/* Adjusted here */}
        {/* Profile Icon */}
        <div className="relative flex items-center">
          <FontAwesomeIcon
            icon={faUser}
            className="text-2xl cursor-pointer"
            onClick={toggleProfilePopup} // Toggle profile popup on click
          />
        </div>

        {/* Car Icon */}
        <div className="relative flex items-center">
          <FontAwesomeIcon
            icon={faCar}
            className="text-2xl cursor-pointer"
            onClick={toggleCarPopup} // Toggle car popup on click
          />
        </div>

        {/* Notifications Bell */}
        <div className="relative flex items-center">
          <FontAwesomeIcon
            icon={faBell}
            className="text-2xl cursor-pointer"
            onClick={handleNotificationClick}
          />
          {notifications.length > 0 && (
            <span
              className="absolute top-0 right-0 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center"
              style={{ transform: "translate(50%, -50%)" }}
            >
              {notifications.length}
            </span>
          )}
        </div>
      </div>
    </div>

      {/* Notifications Panel */}
      {showNotifications && (
        <div className="absolute top-16 right-6 bg-white text-black p-4 rounded-lg shadow-lg w-64">
          <h3 className="font-bold mb-2">Notifications</h3>
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <div key={notification.id} className="mb-4">
                <p className="text-sm">{notification.message}</p>
                <div className="flex justify-between mt-2">
                  <button
                    className="bg-green-500 text-white py-1 px-2 rounded-lg text-sm"
                    onClick={() => handleAction(notification.id, "accepted", notification).then(() => window.location.reload())}
                  >
                    Accept
                  </button>
                  <button
                    className="bg-red-500 text-white py-1 px-2 rounded-lg text-sm"
                    onClick={() => handleAction(notification.id, "rejected")}
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No notifications available.</p>
          )}
        </div>
      )}

      {/* Profile Popup */}
{showProfilePopup && (
  <div className="absolute top-16 right-6 bg-white text-black p-4 rounded-lg shadow-lg w-64">
    <h3 className="font-bold mb-2">Update Profile</h3>

    {/* Demographics Section */}
    <form className="space-y-3">
      <div>
        <label htmlFor="name" className="block">Name</label>
        <input
          id="name"
          name="name"
          type="text"
          value={userName}
          readOnly
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
      <div>
        <label htmlFor="email" className="block">Email</label>
        <input
          id="email"
          name="email"
          type="text"
          value={userEmail}
          readOnly
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
      <div>
        <label htmlFor="phoneNumber" className="block">Phone Number</label>
        <input
          id="phoneNumber"
          name="phoneNumber"
          type="text"
          value={demographics.phoneNumber}
          onChange={handleDemographicChange}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
      <div>
        <label htmlFor="Age" className="block">Age</label>
        <input
          id="age"
          name="age"
          type="number"
          value={demographics.age}
          onChange={handleDemographicChange}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
      <div>
        <label htmlFor="gender" className="block">Gender</label>
        <select
          id="gender"
          name="gender"
          value={demographics.gender}
          onChange={handleDemographicChange}
          className="w-full p-2 border border-gray-300 rounded"
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
      </div>
      <div>
              <label htmlFor="address" className="block">Address</label>
              <textarea
                id="address"
                name="address"
                value={demographics.address}
                onChange={handleDemographicChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
      <button
        type="button"
        onClick={saveProfile}
        className="w-full bg-blue-500 text-white py-2 rounded mt-4"
      >
        Save Changes
      </button>
    </form>
  </div>
)}

{/* Vehicle Popup */}
{showCarPopup && (
  <div className="absolute top-16 right-6 bg-white text-black p-4 rounded-lg shadow-lg w-64">
    <h3 className="font-bold mb-2">Add Vehicle</h3>

    {/* Vehicle Details Section */}
    <form className="space-y-3">
      <div>
        <label htmlFor="type" className="block">Car Type</label>
        <select
          id="type"
          name="type"
          value={carDetails.type}
          onChange={handleCarDetailChange}
          className="w-full p-2 border border-gray-300 rounded"
        >
          <option value="small car">Small Car</option>
          <option value="large car">Large Car</option>
          <option value="mototaxi">Mototaxi</option>
          <option value="van">Van</option>
          <option value="truck">Truck</option>
        </select>
      </div>
      {/* Other fields for vehicle */}
      <div>
        <label htmlFor="model" className="block">Model</label>
        <input
          id="model"
          name="model"
          type="text"
          value={carDetails.model}
          onChange={handleCarDetailChange}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
      <div>
        <label htmlFor="seats" className="block">Seats</label>
        <input
          id="seats"
          name="seats"
          type="number"
          value={carDetails.seats}
          onChange={handleCarDetailChange}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
      <div>
        <label htmlFor="make" className="block">Make</label>
        <input
          id="make"
          name="make"
          type="text"
          value={carDetails.make}
          onChange={handleCarDetailChange}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
      <div>
        <label htmlFor="chassis_number" className="block">Chassis Number</label>
        <input
          id="chassis_number"
          name="chassis_number"
          type="text"
          value={carDetails.chassis_number}
          onChange={handleCarDetailChange}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
      <div>
        <label htmlFor="plate_number" className="block">Plate Number</label>
        <input
          id="plate_number"
          name="plate_number"
          type="text"
          value={carDetails.plate_number}
          onChange={handleCarDetailChange}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
      <div>
        <label htmlFor="insurance_number" className="block">Insurance Number</label>
        <input
          id="insurance_number"
          name="insurance_number"
          type="text"
          value={carDetails.insurance_number}
          onChange={handleCarDetailChange}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
      <button
        type="button"
        onClick={saveCarDetails}
        className="w-full bg-blue-500 text-white py-2 rounded mt-4"
      >
        Save Vehicle Details
      </button>
    </form>
    < ToastContainer/>
  </div>
)}


      {/* Welcome Message */}
      <div className="text-center mt-10 mb-6">
        <h2 className="text-4xl font-semibold text-yellow-200">Welcome, {userName}</h2>
      </div>

      {/* Trips Section */}
      <div className="mt-6">
  <h3 className="text-2xl font-semibold text-yellow-200">Pending Trips</h3>
  {pendingTrips.length > 0 ? (
    pendingTrips.map((trip) => (
      <div key={trip.id} className="bg-gray-800 rounded-lg p-4 mb-4">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-xl">{trip.pickup} → {trip.dropoff}</p>
            <p className="text-sm text-gray-300">{trip.details}</p>
            <p className="text-md font-bold text-pink-600">
                    Customer Name: <span className="text-sm text-gray-300">{trip.username}</span>
                </p>
            <p className="text-md font-bold text-blue-600">
                Fare: <span className="text-sm text-gray-300">S/{trip.price}</span>
            </p>
            <p className="text-md font-bold text-green-600">
                Payment Method: <span className="text-sm text-gray-300">{trip.payment}</span>
            </p>
          </div>
          <FontAwesomeIcon
            icon={faAngleDown}
            className="cursor-pointer"
            onClick={() => toggleExpandRow(trip.id)}
          />
        </div>
        {expandedRow === trip.id && (
          <div className="mt-4 p-4 bg-gray-700 text-sm text-gray-300 rounded-lg">
            <p><strong>Status:</strong> {trip.status}</p>
          </div>
        )}
        {/* Add the Complete button */}
        <div className="mt-2">
          <button
            className="bg-green-500 text-white py-1 px-3 rounded-lg text-sm"
            onClick={() => handleCompleteTrip(trip.id).then(() => window.location.reload())}
          >
            Complete
          </button>
        </div>
      </div>
    ))
  ) : (
    <p className="text-gray-300">No pending trips available.</p>
  )}
</div>

<h3 className="text-2xl font-semibold text-yellow-200">Completed Trips</h3>
        {completedTrips.map((trip) => (
          <div key={trip.id} className="bg-gray-800 rounded-lg p-4 mb-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xl">{trip.pickup} → {trip.dropoff}</p>
                <p className="text-sm text-gray-300">{trip.details}</p>
                <p className="text-md font-bold text-pink-600">
                    Customer Name: <span className="text-sm text-gray-300">{trip.username}</span>
                </p>
                <p className="text-md font-bold text-blue-600">
                    Fare: <span className="text-sm text-gray-300">S/{trip.price}</span>
                </p>
                <p className="text-md font-bold text-green-600">
                    Payment Method: <span className="text-sm text-gray-300">{trip.payment}</span>
                </p>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};

export default DriverDashboard;
