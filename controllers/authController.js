import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';




// Improved token generator with better error handling
const generateToken = (payload) => {
  try {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined');
    }
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
  } catch (error) {
    console.error('Token generation failed:', error);
    throw error;
  }
};

export const verifyToken = async (req, res) => {
  try {
    // The protect middleware already verified the token
    const user = await User.findById(req.user._id).select('-password');
    
    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Token verification failed'
    });
  }
};

// Enhanced login controller
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res.status(400).json({ 
      success: false,
      error: 'Email and password are required' 
    });
  }

  try {
    console.log(`Login attempt for: ${email}`);
    
    // Hardcoded admin login (for development only)
    // if (email === 'vinojina@gmail.com' && password === 'admin123') {
    //   console.log('Hardcoded admin login attempt');
    //   const token = generateToken({ id: 'admin', role: 'admin' });

    //   return res.status(200).json({
    //     success: true,
    //     _id: 'admin',
    //     name: 'Admin',
    //     email: 'vinojina@gmail.com',
    //     role: 'admin',
    //     token,
    //     message: 'Admin login successful',
    //   });
    // }

    // Normal user login
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      console.log('No user found with email:', email);
      return res.status(400).json({ 
        success: false,
        error: 'Invalid credentials' 
      });
    }



    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Password mismatch for user:', user._id);
      return res.status(400).json({ 
        success: false,
        error: 'Invalid credentials' 
      });
    }

    // Generate token
    const token = generateToken({ id: user._id, role: user.role });

    // Prepare user data without password
    const userData = {
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      role: user.role
    };

    console.log('Successful login for user:', user._id);
    res.status(200).json({
      success: true,
      userData,
      token,
      message: 'Login successful',
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Server error during login',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Enhanced registration
export const registerUser = async (req, res) => {
  const { name, email, password, role = 'user' } = req.body;

  try {
    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ 
        success: false,
        error: 'All fields are required' 
      });
    }

    // Check for existing user
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ 
        success: false,
        error: 'Email already exists' 
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role
    });

    // Generate token
    const token = generateToken({ id: user._id, role: user.role });

    res.status(201).json({
      success: true,
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token,
      message: 'Registration successful'
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Registration failed',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get user profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get user profile',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};