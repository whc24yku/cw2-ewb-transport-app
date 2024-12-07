import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faSync,
  faPlus,
  faLocationArrow,
  faAngleDown,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import ENV from '../../env';

const DriverDashboard = ({ driverId }) => {
  const [trips, setTrips] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [expandedRow, setExpandedRow] = useState(null);
  const [userName, setUserName] = useState('Guest');
  const [userEmail, setUserEmail] = useState('');
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const [showTripModal, setShowTripModal] = useState(false);
  const [pickupPoint, setPickupPoint] = useState("");
  const [dropoffPoint, setDropoffPoint] = useState("");

  let pendingTrips = trips.filter((trip) => trip.status === "Active");
  const completedTrips = trips.filter((trip) => trip.status === "Completed");

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

  pendingTrips = trips.filter((trip) => trip.status === "Active");


  //console.log("****Mapped Pending Trips: ", pendingTrips);
  

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

  const handleCompleteTrip = (id) => {
    setTrips((prevTrips) =>
      prevTrips.map((trip) =>
        trip.id === id ? { ...trip, status: "Completed" } : trip
      )
    );
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
                    onClick={() => handleAction(notification.id, "accepted", notification)}
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
            onClick={() => handleCompleteTrip(trip.id)}
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
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};

export default DriverDashboard;
