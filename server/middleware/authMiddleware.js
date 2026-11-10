import jwt from 'jsonwebtoken';
import AdminUser from '../models/AdminUser.js';

export const COOKIE_NAME = 'bela_admin_token';

export const getJwtSecret = () => {
  if (process.env.JWT_SECRET && process.env.JWT_SECRET !== 'replace_with_a_strong_random_secret_key_in_production') {
    return process.env.JWT_SECRET;
  }
  return 'bela_bakers_dev_fallback_secret_9060305323_secure_key';
};

export const requireOwnerAuth = async (req, res, next) => {
  try {
    let token = req.cookies?.[COOKIE_NAME];
    if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Please log in as the shop owner.',
      });
    }

    const decoded = jwt.verify(token, getJwtSecret());
    const admin = await AdminUser.findById(decoded.id).select('-passwordHash');

    if (!admin || !['owner', 'admin'].includes(admin.role)) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: Only authorized Bela Bakers administrators may access this resource.',
      });
    }

    req.admin = admin;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired session. Please log in again.',
    });
  }
};

export const optionalOwnerAuth = async (req, _res, next) => {
  try {
    let token = req.cookies?.[COOKIE_NAME];
    if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }
    if (token) {
      const decoded = jwt.verify(token, getJwtSecret());
      const admin = await AdminUser.findById(decoded.id).select('-passwordHash');
      if (admin && ['owner', 'admin'].includes(admin.role)) {
        req.admin = admin;
      }
    }
  } catch {
    // Ignore invalid token for public endpoints
  }
  next();
};
