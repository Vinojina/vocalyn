import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Protect middleware - verifies JWT and attaches user to req
export const protect = async (req, res, next) => {
  console.log('🔒 Protect middleware triggered');

  try {
    // 1. Get token from Authorization header or cookie
    let token;
    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies?.token) {
      token = req.cookies.token;
    }

    if (!token) {
      console.warn('⚠️ No token found');
      return res.status(401).json({ 
        success: false,
        message: 'Not authorized, no token' 
      });
    }

    // 2. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded);

    // 3. Find user in DB and exclude password
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      console.error('❌ User not found in database');
      return res.status(401).json({ 
        success: false,
        message: 'User not found' 
      });
    }

    console.log('User fetched from DB:', user);

    // 4. Attach user to req
    req.user = user;
    console.log(`✅ Authenticated user: ${user._id} (${user.role || 'no role'}) isAdmin: ${user.isAdmin}`);

    next();
  } catch (error) {
    console.error('❌ Authentication failed:', error.message);

    let message = 'Not authorized, token failed';
    if (error.name === 'TokenExpiredError') message = 'Token expired';
    else if (error.name === 'JsonWebTokenError') message = 'Invalid token';

    res.status(401).json({ 
      success: false,
      message 
    });
  }
};

// isAdmin middleware - allows access only if user is admin by role or boolean flag
export const isAdmin = (req, res, next) => {
  console.log(`🛡️ Admin check for user: ${req.user?._id || 'unauthenticated'}`);

  if (req.user?.role === 'admin' || req.user?.isAdmin === true) {
    console.log('✅ Admin access granted');
    return next();
  }

  console.warn(`⛔ Admin access denied. Role: ${req.user?.role || 'none'}, isAdmin: ${req.user?.isAdmin || false}`);
  res.status(403).json({
    success: false,
    message: 'Admin privileges required',
    yourRole: req.user?.role || 'unauthenticated',
  });
};

// Optional token verification endpoint handler
export const verifyToken = async (req, res) => {
  try {
    // If this runs, protect middleware passed and token is valid
    res.status(200).json({
      success: true,
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        isAdmin: req.user.isAdmin,
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Token verification failed'
    });
  }
};
