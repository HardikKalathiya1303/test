const { verifyToken } = require('../utils/jwt.utils');
const { errorResponse } = require('../utils/response.utils');
const User = require('../models/User.model');

// Authenticate user
const authenticate = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return errorResponse(res, 'Access denied. No token provided.', 401);
    }
    
    const token = authHeader.split(' ')[1];
    
    // Verify token
    const decoded = verifyToken(token);
    
    // Get user from database
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return errorResponse(res, 'User not found.', 401);
    }
    
    if (user.status !== 'active') {
      return errorResponse(res, 'Account has been deactivated.', 401);
    }
    
    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    if (error.message === 'Invalid or expired token') {
      return errorResponse(res, 'Invalid or expired token.', 401);
    }
    return errorResponse(res, 'Authentication failed.', 401);
  }
};

// Role-based access control
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return errorResponse(res, 'Authentication required.', 401);
    }
    
    if (!allowedRoles.includes(req.user.role)) {
      return errorResponse(res, 'Access denied. Insufficient permissions.', 403);
    }
    
    next();
  };
};

// Module-based access control for sub-admins
const checkModuleAccess = (module, action) => {
  return (req, res, next) => {
    if (!req.user) {
      return errorResponse(res, 'Authentication required.', 401);
    }
    
    // Full admin has all permissions
    if (req.user.role === 'admin') {
      return next();
    }
    
    // MAN user has all MAN permissions
    if (req.user.role === 'man_user') {
      return next();
    }
    
    // Check module access for sub-admins and man_sub_users
    if (req.user.role === 'sub_admin' || req.user.role === 'man_sub_user') {
      const moduleAccess = req.user.moduleAccess?.get(module);
      
      if (!moduleAccess || !moduleAccess[action]) {
        return errorResponse(res, `Access denied. No ${action} permission for ${module}.`, 403);
      }
    }
    
    next();
  };
};

// Optional authentication (for public routes that can also be accessed by authenticated users)
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next();
    }
    
    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);
    const user = await User.findById(decoded.userId).select('-password');
    
    if (user && user.status === 'active') {
      req.user = user;
    }
    
    next();
  } catch (error) {
    // Continue without authentication
    next();
  }
};

module.exports = {
  authenticate,
  authorize,
  checkModuleAccess,
  optionalAuth
};
