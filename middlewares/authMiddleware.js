import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * Middleware: Protect
 * Verifies JWT and attaches user to request object
 */
export const protect = async (req, res, next) => {
  console.log('🔒 Protect middleware triggered');

  let token;

  try {
    // 1. Get token from Authorization header or cookie
    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies?.token) {
      token = req.cookies.token;
    }

    if (!token) {
      console.warn('⚠️ No token found in request');
      return res.status(401).json({
        success: false,
        message: 'Not authorized, no token provided',
      });
    }

    // 2. Decode token (⚠️ no expiry check because it's now non-expiring)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('✅ JWT Decoded:', decoded);

    // 3. Find the user
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }

    req.user = user;
    console.log(`✅ Authenticated user: ${user.email} | role: ${user.role} | isAdmin: ${user.isAdmin}`);
    next();

  } catch (error) {
    console.error('❌ Token verification failed:', error.message);
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

/**
 * Admin Middleware
 */
export const isAdmin = (req, res, next) => {
  if (req.user?.role === 'admin' || req.user?.isAdmin) {
    return next();
  }
  res.status(403).json({
    success: false,
    message: 'Admin privileges required',
  });
};

/**
 * Role Checker
 */
export const checkRole = (requiredRole) => {
  return (req, res, next) => {
    if (req.user?.role === requiredRole) return next();
    res.status(403).json({
      success: false,
      message: `Access denied: requires ${requiredRole} role`,
    });
  };
};

/**
 * Token Verifier
 */
export const verifyToken = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    res.status(200).json({
      success: true,
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        isAdmin: req.user.isAdmin,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Token verification failed',
    });
  }
};
