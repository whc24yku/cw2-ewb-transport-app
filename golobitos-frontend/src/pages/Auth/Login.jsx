import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle, faFacebook, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { faGlobe } from '@fortawesome/free-solid-svg-icons';
import ENV from '../../env';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useLanguage } from '../../context/LanguageContext'; // Import useLanguage

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupName, setSignupName] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupCountryCode, setSignupCountryCode] = useState('');
  const [error, setError] = useState("");
  const [role, setRole] = useState('Customer'); // Default role set to 'Customer'
  const [showSignup, setShowSignup] = useState(false);
  const [showSocialIcons, setShowSocialIcons] = useState(false); // State to toggle social icons
  const navigate = useNavigate();
  const { loginWithRedirect, user, isAuthenticated } = useAuth0();
  const { language, setLanguage } = useLanguage(); // Get language and setter from context
  


  // Handle standard login
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${ENV.API_BASE_URL}/login`, { email, password, role });
      if (response.status === 200) {
        console.log(response.data.user.name)
        localStorage.setItem('userDetails', JSON.stringify({ name: response.data.user.name, email: response.data.user.email }));
        toast.success('Login successful!');
        // Redirect to the role-based dashboard
        navigate(`/${role.toLowerCase()}/dashboard`);
      }
    } catch (error) {
      console.error('Login failed:', error);
      toast.error('Invalid credentials');
    }
  };

  // Handle social media login (Google, Facebook, etc.)
  const handleSocialLogin = async () => {
    localStorage.setItem('role', role); // Store the selected role before redirecting
    await loginWithRedirect({ redirectUri: `${window.location.origin}/auth/callback` });
  };

  // Handle user registration
  const handleStandaloneSignup = async (e) => {
    e.preventDefault();
  
    // Check if country code is selected
    if (signupCountryCode === "") {
      setError("Please enter a country code.");
    } else {
      try {
        await axios.post(`${ENV.API_BASE_URL}/register`, {
          username: signupEmail,
          email: signupEmail,
          password: signupPassword,
          role,
          name: signupName,
          phone: `${signupCountryCode.trim()} ${signupPhone.trim()}`,
        });
        toast.success('Signup successful! Please login.');
        setSignupEmail('');
        setSignupPassword('');
        setSignupName('');
        setSignupPhone('');
        
      } catch (error) {
        console.error('Signup failed:', error);
        toast.error('Signup failed!');
      }
    }
    
  };

  // Language switcher button
  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'es' : 'en'); // Toggle between 'en' (English) and 'es' (Spanish)
  };

  // Translations for roles
  const roleTranslations = {
    en: {
      Customer: 'Customer',
      Admin: 'Admin',
      Driver: 'Driver',
      Medic: 'Medic',
      Seller: 'Seller',
    },
    es: {
      Customer: 'Cliente',
      Admin: 'Administrador',
      Driver: 'Conductor',
      Medic: 'Médico',
      Seller: 'Vendedor',
    },
  };

  // Redirect to the role-specific dashboard after successful login
  useEffect(() => {
    if (isAuthenticated) {
      const role = localStorage.getItem('role'); // Retrieve the role from localStorage
      if (role) {
        navigate(`/${role.toLowerCase()}/dashboard`); // Navigate to the role-based dashboard
      }
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="fixed inset-0 bg-gradient-to-r from-[#027f86] to-purple-600 text-white flex flex-col overflow-y-auto">
      <div className="flex-grow flex items-center justify-center p-4">
        <div className="bg-white text-[#027f86] p-8 rounded-lg shadow-lg max-w-lg w-full text-center overflow-y-auto">
          {/* Logo Display */}
          <div className="flex items-center justify-center mb-6">
            <div className="w-12 h-12 bg-yellow-400 text-[#027f86] rounded-full flex items-center justify-center font-bold text-xl">
              Go
            </div>
            <h1 className="text-xl font-semibold text-[#027f86] ml-3">GoLobitos</h1>
          </div>

          <h2 className="text-3xl font-semibold mb-6">{language === 'en' ? 'Login to GoLobitos' : 'Iniciar sesión en GoLobitos'}</h2>

          {/* Language Switcher Button */}
          <button 
            onClick={toggleLanguage} 
            className="absolute bg-yellow-300 text-[#027f86] px-4 py-2 rounded-lg hover:bg-yellow-400 transition-all absolute top-4 right-4 text-xl"
          >
            <FontAwesomeIcon icon={faGlobe} className="mr-2" />
            {language === 'en' ? 'ES' : 'EN'} {/* Toggle between language codes */}
          </button>

          {/* Role Selector */}
          <nav className="flex flex-wrap justify-center space-x-4 mb-6">
            {['Customer', 'Admin', 'Driver', 'Medic', 'Seller'].map((roleOption) => (
              <button
                key={roleOption}
                onClick={() => setRole(roleOption)}
                className={`px-4 py-2 rounded-full ${
                  role === roleOption
                    ? 'bg-[#027f86] text-white'
                    : 'bg-gray-200 text-gray-700'
                } hover:bg-[#027f86] hover:text-white transition-all min-w-[120px] my-2`}
              >
                {language === 'en' ? roleTranslations.en[roleOption] : roleTranslations.es[roleOption]}
              </button>
            ))}
          </nav>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-gray-700">
                {language === 'en' ? 'Email' : 'Correo electrónico'}
              </label>
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
              <label htmlFor="password" className="block text-gray-700">
                {language === 'en' ? 'Password' : 'Contraseña'}
              </label>
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
              {language === 'en' ? `Login as ${role}` : `Iniciar sesión como ${role}`}
            </button>
          </form>

          {/* Social Media Login */}
          <div className="mt-6">
            <button
              onClick={handleSocialLogin}
              className="w-full flex items-center justify-center bg-gray-800 text-white py-3 rounded-lg hover:bg-gray-900 transition-all space-x-3"
            >
              <span>{language === 'en' ? 'Social Media' : 'Redes Sociales'}</span>
              <div className="flex space-x-2">
                <FontAwesomeIcon icon={faGoogle} />
                <FontAwesomeIcon icon={faFacebook} />
                <FontAwesomeIcon icon={faTwitter} />
              </div>
            </button>
          </div>

          {/* Signup Section */}
          <div className="mt-6">
            <button
              onClick={() => setShowSignup(!showSignup)}
              className="text-[#027f86] font-semibold underline"
            >
              {showSignup ? (language === 'en' ? 'Hide Signup' : 'Ocultar registro') : (language === 'en' ? 'New User? Sign Up' : 'Nuevo usuario? Regístrate')}
            </button>

            {showSignup && (
              <form onSubmit={handleStandaloneSignup} className="mt-4 space-y-4">
                <div>
                  <label htmlFor="signup-email" className="block text-gray-700">
                    {language === 'en' ? 'Email' : 'Correo electrónico'}
                  </label>
                  <input
                    type="email"
                    id="signup-email"
                    className="w-full p-3 border rounded-lg text-gray-800"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="signup-password" className="block text-gray-700">
                    {language === 'en' ? 'Password' : 'Contraseña'}
                  </label>
                  <input
                    type="password"
                    id="signup-password"
                    className="w-full p-3 border rounded-lg text-gray-800"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="signup-name" className="block text-gray-700">
                    {language === 'en' ? 'Name' : 'Nombre'}
                  </label>
                  <input
                    type="text"
                    id="signup-name"
                    className="w-full p-3 border rounded-lg text-gray-800"
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="signup-phone" className="block text-gray-700">
                    {language === 'en' ? 'Phone Number' : 'Número de Teléfono'}
                  </label>
                  <div className="flex">
                    {/* Country Code Dropdown */}
                    <select
                      id="signup-country-code"
                      className="w-1/3 p-2 border rounded-l-lg text-gray-800"
                      value={signupCountryCode}
                      onChange={(e) => setSignupCountryCode(e.target.value)}
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
                      {/* Add more countries as needed */}
                    </select>

                    {/* Phone Number Input */}
                    <input
                      type="tel"
                      id="signup-phone"
                      className="w-3/4 p-3 border rounded-r-lg text-gray-800"
                      value={signupPhone}
                      onChange={(e) => setSignupPhone(e.target.value)}
                      required
                      pattern="[0-9]{7,15}" // Ensures a valid phone number format
                      title={
                        language === 'en'
                          ? 'Please enter a valid phone number (7-15 digits).'
                          : 'Por favor ingrese un número de teléfono válido (7-15 dígitos).'
                      }
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#027f86] text-white py-3 rounded-lg hover:bg-teal-600 transition-all"
                >
                  {language === 'en' ? 'Sign Up' : 'Registrarse'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default Login;
