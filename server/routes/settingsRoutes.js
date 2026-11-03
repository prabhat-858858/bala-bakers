import express from 'express';
import { getSettings, updateSettings } from '../controllers/settingsController.js';
import { requireOwnerAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getSettings);
router.put('/', requireOwnerAuth, updateSettings);

export default router;
