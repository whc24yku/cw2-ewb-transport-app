const bcrypt = require('bcryptjs');
const db = require('../config/db');

// Test route (remains unchanged)
const test = async (req, res) => {
  res.status(201).json("OK");
};

// Register user route (remains unchanged)
const registerUser = async (req, res) => {
  const { email, username, password, role, name, phone } = req.body;
  try {
    const hashedPassword = password ? bcrypt.hashSync(password, 10) : null;

    const [user] = await db('users')
      .insert({ email, username, password: hashedPassword, role, name, phoneNumber: phone })
      .returning('*');

    res.status(201).json(user);
  } catch (error) {
    console.log(error)
    res.status(400).json({ error: 'Registration failed' });
  }
};

// Login user route (remains unchanged)
const loginUser = async (req, res) => {
  const { email, password, role } = req.body;
  try {
    const user = await db('users').where({ email }).first();

    if (user && bcrypt.compareSync(password, user.password)) {
      if (user.role === role) {
          res.status(200).json({ message: 'Login successful', user });
        } else {
          // If the role doesn't match, return an error response
          res.status(403).json({ error: 'Role mismatch. Please check your role.' });
        }
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
};

// Map role to an existing user (new functionality)
const mapRoleToUser = async (req, res) => {
  const { email, role, name } = req.body;

  try {
    // Check if the user exists in the database
    const user = await db('users').where({ email }).first();

    if (!user) {
      // If user doesn't exist, call registerUser to create a new user
      try {

        const [newUser] = await db('users')
          .insert({ email, username: email, password: null, role, name })
          .returning('*');

        return res.status(201).json({ message: 'User registered and role assigned', user: newUser });
      } catch (registerError) {
        return res.status(400).json({ error: 'Failed to register user during role mapping' });
      }
    }

    // If user exists, update the role
    const updatedUser = await db('users')
      .where({ email })
      .update({ role })
      .returning('*');

    // Send the updated user details back
    res.status(200).json({ message: 'Role updated for existing user', user: updatedUser[0] });
  } catch (error) {
    res.status(500).json({ error: 'Error mapping role to user' });
  }
};

// Fetch phone number for a user by email (GET request with email as a query parameter)
const fetchUserPhone = async (req, res) => {
  const { email } = req.query; // Get email from query parameters

  if (!email) {
    return res.status(400).json({ error: 'Email parameter is required' }); // Validate input
  }

  try {
    // Check if the user exists in the database
    const user = await db('users').where({ email }).first();

    if (!user) {
      // If user doesn't exist, return a 404 error
      return res.status(404).json({ error: 'User not found' });
    }

    // Return the phone number of the found user
    res.status(200).json({ phoneNumber: user.phoneNumber });
  } catch (error) {
    // Handle unexpected errors
    res.status(500).json({ error: 'Error fetching phone number' });
  }
};

// Fetch user details by phone number (GET request with email as a query parameter)
const fetchUserWithPhone = async (req, res) => {
  const { phone } = req.query; // Get phone number from query parameters

  if (!phone) {
    return res.status(400).json({ error: 'Phone parameter is required' }); // Validate input
  }

  try {
    // Query the database to find the user by phone number
    const user = await db('users').where({ phoneNumber: phone }).first();

    if (!user) {
      return res.status(404).json({ error: 'User not found' }); // If user doesn't exist
    }

    // Return user details (excluding sensitive information like password)
    res.status(200).json({ user: { name: user.name, email: user.email } });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Error fetching user' }); // Handle unexpected errors
  }
}


module.exports = { test, registerUser, loginUser, mapRoleToUser, fetchUserPhone, fetchUserWithPhone };
