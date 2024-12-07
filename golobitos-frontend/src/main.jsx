import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import store from './store';
import App from './App';
import './index.css';
import { Auth0Provider } from '@auth0/auth0-react';

// const onRedirectCallback = (appState) => {
//   // Get the role from localStorage
//   const role = localStorage.getItem('role');
  
//   // If the role is present, navigate to the role-based dashboard
//   if (role) {
//     window.location.replace(`/${role.toLowerCase()}/dashboard`);  // Redirect to the selected role's dashboard
//   } else {
//     window.location.replace('/');  // If no role, fallback to the home page
//   }
// };

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <Auth0Provider
    domain={import.meta.env.VITE_AUTH0_DOMAIN}
    clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
    authorizationParams={{ redirect_uri: window.location.origin }}
    //onRedirectCallback={onRedirectCallback}
  >
    <App />
    </Auth0Provider>
  </Provider>
);
