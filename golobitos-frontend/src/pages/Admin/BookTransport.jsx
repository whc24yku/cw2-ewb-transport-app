// src/pages/Customer/BookTransport.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleMap, LoadScript, Autocomplete } from '@react-google-maps/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTruck,
  faFish,
  faAppleAlt,
  faHorse,
  faCar,
  faHeartbeat,
  faMapMarkerAlt,
  faGlobe,
  faLocationArrow,
  faUser,
  faSearch,
} from '@fortawesome/free-solid-svg-icons';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useLanguage } from '../../context/LanguageContext';
import axios from 'axios';
import ENV from '../../env';

import moment from 'moment';

const GOOGLE_MAPS_API_KEY = `${ENV.GOOGLE_MAPS_API_KEY}`;

const AdminBookTransport = () => {
  const navigate = useNavigate();
  const [onBehalfOfPhone, setOnBehalfOfPhone] = useState('');
  const [user, setUser] = useState(null);
  const [showNewUserForm, setShowNewUserForm] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [userName, setUserName] = useState('Guest');
  const [userEmail, setUserEmail] = useState('');
  const [transportType, setTransportType] = useState('standard');
  const [vehicleType, setVehicleType] = useState('smallcar');
  const [isPriority, setIsPriority] = useState(false);
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [selectedDate, setSelectedDate] = useState(null); // Date field state
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(''); // Time slot state
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('');
  const [weight, setWeight] = useState('');
  const [autocompletePickup, setAutocompletePickup] = useState(null);
  const [autocompleteDropoff, setAutocompleteDropoff] = useState(null);
  const [price, setPrice] = useState(null);  // State to hold the price
  const [error, setError] = useState(null);
  const { language, setLanguage } = useLanguage(); // Get language and setter from context

  useEffect(() => {
    const userDetails = JSON.parse(localStorage.getItem('userDetails'));
    if (userDetails?.name && userDetails?.email) {
      setUserName(userDetails.name);
      setUserEmail(userDetails.email);
    }
  }, []);

  // Fetch phone number from the backend
  // useEffect(() => {
  //   const fetchPhoneNumber = async () => {
  //     const userDetails = JSON.parse(localStorage.getItem('userDetails'));
  //     console.log(`*********${userDetails.email}**********`)
  //     try {
  //       const response = await axios.get(`${ENV.API_BASE_URL}/user/phone`, {
  //         params: { email: userDetails.email },
  //       });

  //       if (response.data) {
  //         const parts = response.data.phoneNumber.split(" "); 
  //         setCountryCode(parts[0]);
  //         setPhone(parts[1]);
          
  //       }
  //       console.log(response.data.phoneNumber)
  //     } catch (error) {
  //       console.error('Error fetching phone number:', error);
  //     }
  //   };
  //   fetchPhoneNumber();
  // }, []);

  // Function to handle finding the user (triggered on clicking search button)
  const handleFindUser = async () => {
    if (!countryCode) {
      setError(language === 'en' ? 'Please provide country code' : 'Por favor, proporcione el código de país');
      return; // Prevent further execution if there's an error
    }

    setError('');
    // Combine country code and phone number
    const phoneWithCountryCode = `${countryCode} ${onBehalfOfPhone}`;

    try {
      // Make API call to find user by phone number
      const response = await axios.get(`${ENV.API_BASE_URL}/user/find-user`, {
        params: { phone: phoneWithCountryCode },
      });

      if (response.data.user) {
        setUser(response.data.user);
        setShowNewUserForm(false);
      } else {
        setUser(null);
        setShowNewUserForm(true);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      setError(language === 'en' ? 'Error fetching user' : 'Error al buscar el usuario');
    }
  };

  const handleAddNewUser = () => {
    // Logic for adding new user (e.g., sending user details to the backend)
    // Logic to add the new user, e.g., an API call or state update
  setIsAddingUser(true); // Set the flag to show the new user's details
  // Optionally, reset the form fields if needed
  
    console.log("Adding new user:", { newUserName, newUserEmail, phone: onBehalfOfPhone });
  };

  const findUserByPhone = async (phone) => {
    // Replace this mock function with your API call or DB lookup
    if (phone === '1234567890') return { name: 'John Doe', email: 'john.doe@example.com' };
    return null;
  };

  // Function to fetch current location
  const fetchCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            // Reverse Geocode using Google Maps API
            const response = await axios.get(
              `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_MAPS_API_KEY}`
            );

            if (response.data.status === 'OK') {
              const address = response.data.results[0]?.formatted_address;
              setPickup(address || 'Unknown Location');
            } else {
              console.error('Error in reverse geocoding:', response.data.error_message);
              alert('Could not fetch address for the current location.');
            }
          } catch (error) {
            console.error('Error fetching location:', error);
            alert('An error occurred while fetching the current location.');
          }
        },
        (error) => {
          console.error('Geolocation error:', error);
          alert('Please enable location access to use this feature.');
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

  const calculateDistance = async (pickup, dropoff) => {
    console.log(pickup)
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(pickup)}&destinations=${encodeURIComponent(dropoff)}&mode=driving&key=${GOOGLE_MAPS_API_KEY}`;

    const response = await axios.get(url);
    if (response.data.rows[0].elements[0].status === "OK") {
        const distance = response.data.rows[0].elements[0].distance.text;
        const duration = response.data.rows[0].elements[0].duration.text;
        console.log(distance)
        return { distance, duration };
    } else {
        throw new Error("Unable to calculate distance");
    }
}


  const handlePlaceChange = (type) => {
    const place = type === 'pickup' ? autocompletePickup.getPlace() : autocompleteDropoff.getPlace();
    if (place) {
      const address = place.formatted_address;
      if (type === 'pickup') setPickup(address);
      else setDropoff(address);
    }
  };

  const timeSlots = [
    '00:00 - 01:00',
    '01:00 - 02:00',
    '02:00 - 03:00',
    '03:00 - 04:00',
    '04:00 - 05:00',
    '05:00 - 06:00',
    '06:00 - 07:00',
    '07:00 - 08:00',
    '08:00 - 09:00',
    '09:00 - 10:00',
    '10:00 - 11:00',
    '11:00 - 12:00',
    '12:00 - 13:00',
    '13:00 - 14:00',
    '14:00 - 15:00',
    '15:00 - 16:00',
    '16:00 - 17:00',
    '17:00 - 18:00',
    '18:00 - 19:00',
    '19:00 - 20:00',
    '20:00 - 21:00',
    '21:00 - 22:00',
    '22:00 - 23:00',
    '23:00 - 00:00',
];


  const transportOptions = [
    { value: 'standard', label: language === 'en' ? 'Standard' : 'Estándar', icon: faCar },
    { value: 'medical', label: language === 'en' ? 'Medical Emergency' : 'Emergencia Médica', icon: faHeartbeat },
    { value: 'livestock', label: language === 'en' ? 'Livestock Transport' : 'Transporte de Ganado', icon: faHorse },
    { value: 'food', label: language === 'en' ? 'Food & Perishables' : 'Alimentos y Perecederos', icon: faAppleAlt },
    { value: 'fish', label: language === 'en' ? 'Fish & Aquatics' : 'Peces y Acuáticos', icon: faFish },
    { value: 'general', label: language === 'en' ? 'General Goods' : 'Bienes Generales', icon: faTruck },
  ];

  const vehicleOptions = [
    { value: 'smallcar', label: language === 'en' ? 'Small Car' : 'Coche Pequeño' },
    { value: 'largecar', label: language === 'en' ? 'Large Car' : 'Coche Grande' },
    { value: 'van', label: language === 'en' ? 'Van' : 'Furgoneta' },
    { value: 'truck', label: language === 'en' ? 'Truck' : 'Camión' },
  ];

  // Function to handle price retrieval (this should be implemented to fetch the price)
  const handleGetPrice = async () => {
    console.log("Test")
    try {
      const response = await axios.post(`${ENV.API_BASE_URL}/customer/book-transport/calculate-price`, {
        selectedDate,
        selectedTimeSlot,
        pickup,
        dropoff,
        weight,
        transportType,
        vehicleType,
      });

      if (response.data) {
        setPrice(response.data.price);  // Set the price state
        setError(null);
      }
    } catch (error) {
      console.error('Error while getting price:', error);
      setError('Unable to fetch the price. Please try again later.');
      setPrice(null); 
    }
  };

  const handleBooking = async () => {
    try {
        const response = await axios.post(`${ENV.API_BASE_URL}/customer/book-transport/calculate-distance`, { pickup, dropoff });
        
        // Assuming the API response contains distance and duration
        const { distance, duration } = response.data;

        console.log("Distance:", distance);
        console.log("Duration:", duration);
    } catch (error) {
        console.error("Error while calculating distance:", error);
    }
};

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'es' : 'en'); // Toggle between English and Spanish
  };

 
  return (
    <div className="fixed inset-0 bg-gradient-to-r from-[#027f86] to-purple-600 text-white flex flex-col items-center overflow-hidden p-0 m-0">
      {/* Language Switcher Button */}
      <button
        onClick={toggleLanguage}
        className="absolute bg-yellow-300 text-[#027f86] px-4 py-2 rounded-lg hover:bg-yellow-400 transition-all top-4 right-4 text-xl"
      >
        <FontAwesomeIcon icon={faGlobe} className="mr-2" />
        {language === 'en' ? 'ES' : 'EN'}
      </button>

      {/* Logo */}
      <div className="flex items-center my-4">
        <div className="w-10 h-10 bg-yellow-400 text-[#027f86] rounded-full flex items-center justify-center font-bold text-lg">
          Go
        </div>
        <h1 className="text-lg font-semibold text-white ml-2">GoLobitos</h1>
      </div>

      {/* Booking Form */}
      <div className="w-full max-w-lg bg-white text-[#027f86] rounded-lg shadow-lg p-4 mx-2 mb-4 overflow-y-auto box-border max-h-[75vh]">
        <h2 className="text-2xl font-semibold text-center mb-3">
          {language === 'en' ? 'Book a Ride (Admin)' : 'Reservar un Viaje (Admin)'}
        </h2>

      {/* On Behalf Of Section */}
<div className="mb-4">
  <label className="block text-md mb-1">
    {language === 'en' ? 'On Behalf Of' : 'En Nombre De'}
  </label>
  
  <div className="flex items-center space-x-2">
    {/* Country code dropdown */}
    <select 
      className="w-24 border border-gray-300 rounded-md px-2 py-2 text-sm" 
      name="countryCode" 
      id="countryCode"
      value={countryCode} // Ensures default selection or placeholder is shown
      onChange={(e) => setCountryCode(e.target.value)} 
      required
    >
      <option value="">{language === 'en' ? 'Country code' : 'Código de país'}</option>
      <option value="+51">🇵🇪 +51 (Peru)</option>
      <option value="+44">🇬🇧 +44 (UK)</option>
      <option value="+1">🇺🇸 +1 (USA)</option>
      <option value="+91">🇮🇳 +91 (India)</option>
      <option value="+61">🇦🇺 +61 (Australia)</option>
      <option value="+81">🇯🇵 +81 (Japan)</option>
      <option value="+49">🇩🇪 +49 (Germany)</option>
      <option value="+33">🇫🇷 +33 (France)</option>
      <option value="+86">🇨🇳 +86 (China)</option>
      <option value="+971">🇦🇪 +971 (UAE)</option>
      <option value="+55">🇧🇷 +55 (Brazil)</option>
      <option value="+52">🇲🇽 +52 (Mexico)</option>
      <option value="+34">🇪🇸 +34 (Spain)</option>
      <option value="+39">🇮🇹 +39 (Italy)</option>
      <option value="+7">🇷🇺 +7 (Russia)</option>
      <option value="+27">🇿🇦 +27 (South Africa)</option>
      <option value="+82">🇰🇷 +82 (South Korea)</option>
      <option value="+54">🇦🇷 +54 (Argentina)</option>
      <option value="+64">🇳🇿 +64 (New Zealand)</option>
      <option value="+66">🇹🇭 +66 (Thailand)</option>
      <option value="+62">🇮🇩 +62 (Indonesia)</option>
      <option value="+90">🇹🇷 +90 (Turkey)</option>
      <option value="+234">🇳🇬 +234 (Nigeria)</option>
      <option value="+63">🇵🇭 +63 (Philippines)</option>
    </select>

    {/* Phone number input */}
    <input
      type="text"
      placeholder={language === 'en' ? 'Enter phone number' : 'Ingrese número de teléfono'}
      value={onBehalfOfPhone}
      onChange={(e) => setOnBehalfOfPhone(e.target.value)}
      className="w-full border border-gray-300 rounded-md px-2 py-2 text-sm focus:outline-none"
    />
    
    <button onClick={handleFindUser} className="ml-2 text-blue-600">
      <FontAwesomeIcon icon={faSearch} />
    </button>
  </div>

  {/* Error message */}
  {error && <p className="text-red-600 text-sm mt-2">{error}</p>}

  {/* Show user details if user is found */}
  {user && !isAddingUser ? (
    <div className="mt-2">
      <p>
        {language === 'en' ? 'Name:' : 'Nombre:'} {user.name}
      </p>
      <p>
        {language === 'en' ? 'Email:' : 'Correo Electrónico:'} {user.email}
      </p>
    </div>
  ) : (
    !user && showNewUserForm && !isAddingUser && (
      <div className="mt-3">
        <p className="text-sm">
          {language === 'en' ? 'User not found.' : 'Usuario no encontrado.'}
        </p>
        
        {/* Display plain text instead of clickable button */}
        <p className="text-blue-600 text-sm">
          {language === 'en' ? 'Enter New User Details' : 'Ingresar Datos de Nuevo Usuario'}
        </p>
        
        <input
          type="text"
          placeholder={language === 'en' ? 'Name' : 'Nombre'}
          value={newUserName}
          onChange={(e) => setNewUserName(e.target.value)}
          className="w-full px-2 py-1 mb-2 border rounded"
        />
        <input
          type="email"
          placeholder={language === 'en' ? 'Email (Optional)' : 'Correo Electrónico (Opcional)'}
          value={newUserEmail}
          onChange={(e) => setNewUserEmail(e.target.value)}
          className="w-full px-2 py-1 mb-2 border rounded"
        />
        <button
          onClick={handleAddNewUser}
          className="bg-blue-500 text-white py-2 w-full rounded"
        >
          {language === 'en' ? 'Add User' : 'Agregar Usuario'}
        </button>
      </div>
    )
  )}

  {/* Once user is added, show their details */}
  {isAddingUser && (
    <div className="mt-2">
      <p>
        {language === 'en' ? 'Name:' : 'Nombre:'} {newUserName}
      </p>
      <p>
        {language === 'en' ? 'Email:' : 'Correo Electrónico:'} {newUserEmail}
      </p>
    </div>
  )}
</div>




      {/* Date Picker */}
      <div className="mb-3">
          <label className="block text-md mb-1">
            {language === 'en' ? 'Select Date' : 'Seleccione Fecha'}
          </label>
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            className="w-full border border-gray-300 rounded-md px-2 py-2 text-sm"
            placeholderText={language === 'en' ? 'Choose a date' : 'Elija una fecha'}
          />
        </div>

        {/* Time Slot Picker */}
        <div className="mb-3">
          <label className="block text-md mb-1">
            {language === 'en' ? 'Select Time Slot' : 'Seleccione Franja Horaria'}
          </label>
          <select
            value={selectedTimeSlot}
            onChange={(e) => setSelectedTimeSlot(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-2 py-2 text-sm"
          >
            <option value="">
              {language === 'en' ? 'Choose a time slot' : 'Elija una franja horaria'}
            </option>
            {timeSlots.map((slot, index) => (
              <option key={index} value={slot}>
                {slot}
              </option>
            ))}
          </select>
        </div>

        {/* Pick-Up Location */}
        <div className="mb-3">
          <label className="block text-md mb-1">
            {language === 'en' ? 'Pick-Up Location' : 'Lugar de Recogida'}
          </label>
          <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY} libraries={['places']}>
            <Autocomplete onLoad={setAutocompletePickup} onPlaceChanged={() => handlePlaceChange('pickup')}>
              <div className="flex items-center border border-gray-300 rounded-md px-2 py-1">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="text-gray-500 mr-2" />
                <input
                  type="text"
                  value={pickup}
                  onChange={(e) => setPickup(e.target.value)}
                  placeholder={language === 'en' ? 'Enter pick-up location' : 'Ingrese lugar de recogida'}
                  className="w-full focus:outline-none text-sm"
                />
                <button
                  onClick={fetchCurrentLocation}
                  className="ml-2 bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition"
                >
                  <FontAwesomeIcon icon={faLocationArrow} />
                </button>
              </div>
            </Autocomplete>
          </LoadScript>
        </div>

        {/* Drop-Off Location */}
        <div className="mb-3">
          <label className="block text-md mb-1">
            {language === 'en' ? 'Drop-Off Location' : 'Lugar de Entrega'}
          </label>
          <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY} libraries={['places']}>
            <Autocomplete onLoad={setAutocompleteDropoff} onPlaceChanged={() => handlePlaceChange('dropoff')}>
              <div className="flex items-center border border-gray-300 rounded-md px-2 py-1">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="text-gray-500 mr-2" />
                <input
                  type="text"
                  value={dropoff}
                  onChange={(e) => setDropoff(e.target.value)}
                  placeholder={language === 'en' ? 'Enter drop-off location' : 'Ingrese lugar de entrega'}
                  className="w-full focus:outline-none text-sm"
                />
              </div>
            </Autocomplete>
          </LoadScript>
        </div>

        {/* Transport Type Selector */}
        <div className="mb-3">
          <label className="block text-md mb-1">
            {language === 'en' ? 'Transport Type' : 'Tipo de Transporte'}
          </label>
          <div className="flex flex-wrap gap-2">
            {transportOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setTransportType(option.value)}
                className={`p-3 rounded-lg border-2 text-xs ${
                  transportType === option.value ? 'border-blue-500 bg-blue-100' : 'border-gray-300'
                }`}
              >
                <FontAwesomeIcon icon={option.icon} className="mr-2 text-base" />
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Vehicle Type Selector */}
        <div className="mb-3">
          <label className="block text-md mb-1">
            {language === 'en' ? 'Vehicle Type' : 'Tipo de Vehículo'}
          </label>
          <select
            value={vehicleType}
            onChange={(e) => setVehicleType(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-2 py-2 text-sm"
          >
            {vehicleOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Weight Field */}
        <div className="mb-3">
          <label className="block text-md mb-1">
            {language === 'en' ? 'Enter Weight (kg)' : 'Ingrese Peso (kg)'}
          </label>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-2 py-2 text-sm"
            placeholder={language === 'en' ? 'Enter Approx weight' : 'Ingrese el peso aproximado'}
          />
          <p className="text-sm text-gray-500 mt-1">
            {language === 'en'
              ? 'Note: Price may vary depending on the actual weight.'
              : 'Nota: El precio puede variar dependiendo del peso real.'}
          </p>
        </div>

        
        {/* Priority */}
        <div className="mb-3 flex items-center">
          <input
            type="checkbox"
            id="priority"
            checked={isPriority}
            onChange={(e) => setIsPriority(e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="priority">
            {language === 'en' ? 'Priority Service' : 'Servicio Prioritario'}
          </label>
        </div>

        {/* Get Price Button */}
        <div className="mb-3 text-center">
          <button
            onClick={handleGetPrice}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all"
          >
            {language === 'en' ? 'Get Price' : 'Obtener Precio'}
          </button>
        </div>

        {/* Display the price or error below the button */}
      <div className="mt-3 text-center">
          {price !== null ? (
            
              <div className="text-xl font-semibold text-green-600">
                {language === 'en' ? `Estimated Price: $${price}` : `Precio Estimado: $${price}`}
              </div>
            
          ) : error ? (
            <div className="bg-red-100 p-2 rounded-lg shadow-md max-w-xs mx-auto">
              <div className="text-xl font-semibold text-red-600">
                {error}
              </div>
            </div>
          ) : null}
      </div>

        {/* Submit */}
        <div className="flex justify-center mt-6">
          <button
            onClick={handleBooking}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
          >
            {language === 'en' ? 'Confirm Booking' : 'Confirmar Reserva'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminBookTransport;
