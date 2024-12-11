const axios = require('axios');
const https = require('https');
const moment = require('moment');
const fs = require('fs');
const db = require('../config/db');

require('dotenv').config();

const apiKey = process.env.GOOGLE_MAPS_API_KEY;


// Function to read the bookings data from file (loaded once)
function loadBookingsData() {
    const rawData = fs.readFileSync('bookingsData.json');
    return JSON.parse(rawData);
}

/// Normal function for calculating the distance
const calculateDistance = async (pickup, dropoff) => {
    try {
        const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(pickup)}&destinations=${encodeURIComponent(dropoff)}&mode=driving&key=${apiKey}`;

        const response = await axios.get(url, {
            httpsAgent: new https.Agent({ rejectUnauthorized: false })
        });

        if (response.data.rows[0].elements[0].status === "OK") {
            const distance = response.data.rows[0].elements[0].distance.text;
            const duration = response.data.rows[0].elements[0].duration.text;
            return { distance, duration };
        } else {
            throw new Error('Unable to calculate distance');
        }
    } catch (error) {
        console.error(error);
        throw new Error('Distance calculation failed');
    }
};

const calculatePrice = async (req, res) => {
    const {
        selectedDate,
        selectedTimeSlot,
        pickup,
        dropoff,
        weight,
        customerCount,
        transportType,
        vehicleType,
        isShared
    } = req.body;

    const inputDate = new Date(selectedDate);
    const startTime = selectedTimeSlot.split(' - ')[0];
    const formattedDate = inputDate.toISOString().split('T')[0];

    const transportTypePrices = {
        "Standard": 1,
        "Medical Emergency": 2.5,
        "Livestock Transport": 2,
        "Food & Perishables": 1.8,
        "Fish & Aquatics": 2.2,
        "General Goods": 1.2
    };

    const vehicleTypePrices = {
        "Small car": 1.1,
        "Large car": 1.3,
        "Mototaxi": 0.5,
        "Van": 1.5,
        "Truck": 2
    };

    const basePricePerKg = 0.5;

    try {
        generateBookings(`${formattedDate} ${startTime}`);
        const bookingsData = loadBookingsData();
        const bookingTime = `${formattedDate} ${startTime}`;
        const bookingInfo = bookingsData.find(item => item.dateTime === bookingTime);

        if (!bookingInfo) {
            return res.status(400).json({ error: 'No booking information available for this date and time.' });
        }

        const { bookings } = bookingInfo;
        let dynamicPricingFactor = 1;

        if (bookings >= 7) {
            dynamicPricingFactor = 2;
        } else if (bookings >= 4) {
            dynamicPricingFactor = 1.5;
        } else if (bookings <= 2) {
            dynamicPricingFactor = 0.8;
        }

        const { distance, duration } = await calculateDistance(pickup, dropoff);
        const distanceKm = parseFloat(distance.replace(' km', '').replace(',', ''));
        const durationMinutes = parseFloat(duration.replace(' mins', '').replace(',', ''));

        let price = 0;
        console.log(`WEIGHT:**********${customerCount}`)

        // Calculate base price
        if (weight !== undefined) {
            price += weight * basePricePerKg;
        } else {
            price = 1;
        }

        // Apply transport type and vehicle type pricing
        price *= transportTypePrices[transportType] || 1;
        price *= vehicleTypePrices[vehicleType] || 1;

        // Apply dynamic pricing adjustments
        price *= dynamicPricingFactor;

        // Distance and duration-based adjustments
        if (distanceKm > 10) {
            price *= 1.2;
        }
        if (durationMinutes > 60) {
            price *= 1.15;
        }

        // Handle shared transport
        if (isShared) {
            price /= 2;
        }

        if (customerCount !== undefined) {
            price *= customerCount;
        }

        return res.status(200).json({ distance, duration, price });

    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

const initiateBooking = async (req, res) => {
    try {
      console.log(`********************${req.body.estimatedPrice}`)
      const {
        selectedDate,
        selectedTimeSlot,
        pickup,
        dropoff,
        weight,
        customerCount,
        transportType,
        vehicleType,
        isShared, 
        paymentMethod,
        estimatedPrice,
        userEmail,
        userName,
      } = req.body;
      console.log(`####################${estimatedPrice}`)
      // Insert into the booking table with default values for unspecified fields
      const newBooking = await db('booking').insert({
        date: selectedDate,
        timeslot: selectedTimeSlot,
        location_departure: pickup,
        location_destination: dropoff,
        weight: weight || 0, // Default weight to 0
        number_of_customers: customerCount || 1, // Default to 1 customer
        transport_type: transportType || 'standard', // Default to 'standard'
        vehicle_type: vehicleType || 'car', // Default vehicle type
        shared: isShared || false, // Default shared to false
        status: 'pending', // Default status
        time_start: db.fn.now(), // Default to current timestamp
        time_end: db.fn.now(), // Default to current timestamp (update later)
        driver_id: 0, // Default to null, to be assigned later
        customer_pack_id: 0, // Default to 0
        inventory_pack_id: 0, // Default to 0
        number_of_package: 0, // Default to 0
        estimated_price: estimatedPrice, // Default to 0, can be calculated later
        priority: false, // Default priority to false
        payment_method: paymentMethod,
        user_email: userEmail,
        user_name: userName,
      }, ['id', 'time_start', 'time_end', 'location_departure', 'location_destination', 'payment_method', 'estimated_price','user_email','user_name']);

      const bookingId = newBooking[0]?.id;
      const timeStart = newBooking[0]?.time_start;
      const timeEnd = newBooking[0]?.time_end;
      const locationDeparture = newBooking[0]?.location_departure;
      const locationDestination = newBooking[0]?.location_destination;
      const payment = newBooking[0]?.payment_method;
      const price = newBooking[0]?.estimated_price;
      const email = newBooking[0]?.user_email;
      const username = newBooking[0]?.user_name;

       // Insert a notification for the driver
    const newNotification = await db('notifications').insert({
        type: 'new_booking',
        message: `New booking from ${pickup} to ${dropoff}`,
        driver_id: 0,  // Notify the assigned driver
        booking_id: bookingId,
        seen: false,  // Initially, the driver hasn't seen the notification
        time_start: timeStart,
        time_end: timeEnd,
        location_departure: locationDeparture,
        location_destination: locationDestination,
        payment_method: payment,
        estimated_price: price,
        user_email: email,
        user_name: username,
      });
      
      res.status(201).json({
        success: true,
        message: 'Booking initiated successfully',
        bookingId: newBooking[0] // Return the new booking ID
      });
    } catch (error) {
      console.error('Error initiating booking:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to initiate booking',
        error: error.message
      });
    }
  };

  const getNotifications = async (req, res) => {
    try {
      // Fetch all notifications where 'seen' is false
      const notifications = await db("notifications")
        .where({ seen: false })
        .orderBy("created_at", "desc"); // Order by the most recent
  
      res.status(200).json({
        success: true,
        notifications,
      });
    } catch (error) {
      console.error("Error fetching notifications:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch notifications",
        error: error.message,
      });
    }
  };
  
  const assignDriver = async (req, res) => {
    const { userEmail, notificationId, bookingId } = req.body;
  
    try {
      // Validate input parameters
      if (!userEmail || !notificationId || !bookingId) {
        return res.status(400).json({
          success: false,
          message: 'userEmail, notificationId, and bookingId are required.',
        });
      }
  
      // Get driverId from users table using userEmail
      const driver = await db('users')
        .select('id')
        .where('email', userEmail)
        .first();
  
      if (!driver) {
        return res.status(404).json({
          success: false,
          message: `No user found with email ${userEmail}`,
        });
      }
  
      const driverId = driver.id;
  
      // Start a transaction to ensure both updates happen atomically
      await db.transaction(async (trx) => {
        // Update the booking table
        const updatedBooking = await trx('booking')
          .where('id', bookingId)
          .update({ driver_id: driverId }, ['id', 'driver_id']);
  
        if (!updatedBooking.length) {
          throw new Error(`No booking found with id ${bookingId}`);
        }
  
        // Update the notifications table
        const updatedNotification = await trx('notifications')
          .where('id', notificationId)
          .update({ seen: true }, ['id', 'seen']);
  
        if (!updatedNotification.length) {
          throw new Error(`No notification found with id ${notificationId}`);
        }
  
        res.status(200).json({
          success: true,
          message: 'Driver assigned and notification marked as seen successfully.',
          data: {
            updatedBooking: updatedBooking[0],
            updatedNotification: updatedNotification[0],
          },
        });
      });
    } catch (error) {
      console.error('Error in assignDriver:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to assign driver or update notification.',
        error: error.message,
      });
    }
  };
  
  const getDriverNotifications = async (req, res) => {
    const { email } = req.query;
    console.log(email)
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "userEmail is required.",
      });
    }
  
    try {
      // Step 1: Get the userId (driver_id) using the userEmail from the users table
      const user = await db("users").select("id").where({ email: email }).first();
  
      if (!user) {
        return res.status(404).json({
          success: false,
          message: `No user found with email: ${email}`,
        });
      }
  
      const driverId = user.id;
  
      // Step 2: Fetch all notifications for the driver from the booking table
      const notifications = await db("booking")
        .select(
          "id",
          "date",
          "timeslot",
          "time_start",
          "time_end",
          "location_departure as pickup",
          "location_destination as dropoff",
          "status",
          "payment_method",
          "estimated_price",
          "user_email",
          "user_name",
        )
        .where({ driver_id: driverId })
        .orderBy("date", "desc");
  
      if (!notifications.length) {
        return res.status(404).json({
          success: false,
          message: `No notifications found for driver with ID: ${driverId}`,
        });
      }
  
      res.status(200).json({
        success: true,
        driverId,
        notifications,
      });
    } catch (error) {
      console.error("Error fetching driver notifications:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch driver notifications.",
        error: error.message,
      });
    }
  };

  const addVehicleDetails = async (req, res) => {
    const {
      userEmail, // Email of the user/driver
      type, // Vehicle type (e.g., car, van, bike)
      model, // Vehicle model
      seats, // Number of seats
      make, // Vehicle make (e.g., Toyota, Honda)
      chasisNumber, // Unique chassis number
      plateNumber, // Unique plate number
      insuranceNumber, // Insurance policy number
    } = req.body;
  
    try {
      // Validate input parameters
      if (!userEmail || !type || !model || !seats || !make || !chasisNumber || !plateNumber || !insuranceNumber) {
        return res.status(400).json({
          success: false,
          message: 'userEmail, type, model, seats, make, chasisNumber, plateNumber, and insuranceNumber are required.',
        });
      }
  
      // Get userId from users table using userEmail
      const user = await db('users')
        .select('id')
        .where('email', userEmail)
        .first();
  
      if (!user) {
        return res.status(404).json({
          success: false,
          message: `No user found with email ${userEmail}`,
        });
      }
  
      const userId = user.id;
  
      // Insert vehicle details into the 'drivers' table
      const [vehicle] = await db('drivers')
        .insert(
          {
            user_id: userId, // Reference to the user
            type,
            model,
            seats,
            make,
            chasis_number: chasisNumber,
            plate_number: plateNumber,
            insurance_number: insuranceNumber,
          },
          ['id', 'user_id', 'type', 'model', 'seats', 'make', 'chasis_number', 'plate_number', 'insurance_number', 'validated', 'created_at', 'updated_at']
        );
  
      res.status(201).json({
        success: true,
        message: 'Vehicle details added successfully.',
        data: vehicle,
      });
    } catch (error) {
      console.error('Error in addVehicleDetails:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to add vehicle details.',
        error: error.message,
      });
    }
  };
  

  const completeBooking = async (req, res) => {
    const { bookingId } = req.body;
  
    try {
      // Validate input parameter
      if (!bookingId) {
        return res.status(400).json({
          success: false,
          message: 'Booking ID is required.',
        });
      }
  
      // Update the status to "completed"
      const updatedBooking = await db('booking')
        .where('id', bookingId)
        .update({ status: 'completed', time_end: new Date().toISOString() }, ['id', 'status', 'time_end']);
  
      if (!updatedBooking.length) {
        return res.status(404).json({
          success: false,
          message: `No booking found with id ${bookingId}`,
        });
      }
  
      res.status(200).json({
        success: true,
        message: 'Booking status updated to "completed" successfully.',
        data: updatedBooking[0],
      });
    } catch (error) {
      console.error('Error in completeBooking:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update booking status.',
        error: error.message,
      });
    }
  };
  

function generateBookings(startDateTime) {
    const bookingsData = [];
    const startDate = moment(startDateTime);
    console.log(`Generating bookings starting from ${startDateTime}`);

    try {
        for (let dayOffset = 0; dayOffset < 14; dayOffset++) {
            for (let hour = 0; hour < 24; hour++) {
                const currentDateTime = startDate.clone().add(dayOffset, 'days').set('hour', hour).set('minute', 0).set('second', 0);
                const randomBookings = Math.floor(Math.random() * 11);

                bookingsData.push({
                    dateTime: currentDateTime.format('YYYY-MM-DD HH:mm'),
                    bookings: randomBookings
                });
            }
        }

        // Ensure directory is writable
        const path = 'bookingsData.json';
        console.log(`Saving bookings data to ${path}`);

        fs.writeFileSync(path, JSON.stringify(bookingsData, null, 2));
        console.log('Bookings data generated and saved to bookingsData.json');
    } catch (error) {
        console.error('Error generating bookings:', error);
    }
}

  
  // Example usage: Generate bookings starting from a specific date and time
  //generateBookings('2024-11-25 08:00'); 
  

module.exports = { calculatePrice, initiateBooking, getNotifications, assignDriver, getDriverNotifications, addVehicleDetails, completeBooking };