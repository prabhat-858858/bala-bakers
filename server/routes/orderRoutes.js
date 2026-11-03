import express from 'express';
import {
  getOrders,
  getOrderById,
  createOrder,
  updateOrder,
} from '../controllers/orderController.js';
import { requireOwnerAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

// All order routes require owner authentication
router.use(requireOwnerAuth);

router.get('/', getOrders);
router.get('/:id', getOrderById);
router.post('/', createOrder);
router.put('/:id', updateOrder);

export default router;
