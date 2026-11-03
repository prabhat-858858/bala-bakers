import express from 'express';
import rateLimit from 'express-rate-limit';
import { loginOwner, logoutOwner, getCurrentOwner } from '../controllers/authController.js';
import { requireOwnerAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 15, // Limit each IP to 15 login attempts per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many login attempts from this IP. Please try again after 15 minutes.',
  },
});

router.post('/login', loginRateLimiter, loginOwner);
router.post('/logout', logoutOwner);
router.get('/me', requireOwnerAuth, getCurrentOwner);

export default router;
