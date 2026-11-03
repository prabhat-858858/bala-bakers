import express from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js';
import { requireOwnerAuth, optionalOwnerAuth } from '../middleware/authMiddleware.js';
import { uploadProductImage } from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Public routes (with optional admin detection for adminView=true)
router.get('/', optionalOwnerAuth, getProducts);
router.get('/:id', optionalOwnerAuth, getProductById);

// Protected Owner Admin routes
router.post('/', requireOwnerAuth, uploadProductImage.single('image'), createProduct);
router.put('/:id', requireOwnerAuth, uploadProductImage.single('image'), updateProduct);
router.delete('/:id', requireOwnerAuth, deleteProduct);

export default router;
