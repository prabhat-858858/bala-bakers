import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import AdminUser from '../models/AdminUser.js';
import { COOKIE_NAME, getJwtSecret } from '../middleware/authMiddleware.js';
import { sanitizePayload } from '../utils/sanitize.js';

// POST /api/auth/login
export const loginOwner = async (req, res) => {
  try {
    const cleanBody = sanitizePayload(req.body);
    const email = String(cleanBody.email || '').toLowerCase().trim();
    const password = String(cleanBody.password || '');

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.',
      });
    }

    const admin = await AdminUser.findOne({ email });
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid owner credentials.',
      });
    }

    const isMatch = await bcrypt.compare(password, admin.passwordHash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid owner credentials.',
      });
    }

    const token = jwt.sign(
      { id: admin._id, email: admin.email, role: admin.role },
      getJwtSecret(),
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.cookie(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/',
    });

    return res.json({
      success: true,
      message: 'Logged in to Bela Bakers Owner Dashboard.',
      token,
      admin: {
        id: admin._id,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Authentication failed.',
    });
  }
};

// POST /api/auth/logout
export const logoutOwner = (_req, res) => {
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    path: '/',
  });

  return res.json({
    success: true,
    message: 'Logged out successfully.',
  });
};

// GET /api/auth/me
export const getCurrentOwner = (req, res) => {
  return res.json({
    success: true,
    admin: {
      id: req.admin._id,
      email: req.admin.email,
      role: req.admin.role,
    },
  });
};
