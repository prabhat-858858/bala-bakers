import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { connectDB } from './config/db.js';
import { initCloudinary } from './config/cloudinary.js';
import { seedInitialCatalogue } from './scripts/seedCatalogue.js';
import { ensureInitialOwner } from './scripts/createAdmin.js';
import productRoutes from './routes/productRoutes.js';
import authRoutes from './routes/authRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security headers (allowing external cake images from Cloudinary & Unsplash)
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    contentSecurityPolicy: false,
  })
);

// CORS configuration with credentials support for HTTP-only cookies
const allowedOrigins = [
  
   process.env.CLIENT_URL 
  //|| 'http://localhost:5173',
  // 'http://localhost:5173',
  // 'http://127.0.0.1:5173',
  // 'http://localhost:4173',
  // 'https://client-yw4b.vercel.app/',
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

// Global API rate limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', apiLimiter);

app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));
app.use(cookieParser());

// Serve locally uploaded images when Cloudinary is in local fallback mode
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Health check
app.get('/api/health', (_req, res) => {
  res.json({
    success: true,
    business: 'Bela Bakers',
    location: 'Gopalganj, Bihar, India',
    paymentGatewayEnabled: false,
    orderChannel: 'WhatsApp (919060305323)',
  });
});

// REST API Routes (Strictly NO payment endpoints)
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/settings', settingsRoutes);

// 404 handler for unknown API routes
app.use('/api/*', (_req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found.',
  });
});

// Global error handler
app.use((err, _req, res, _next) => {
  console.error('Server error:', err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
  });
});

const startServer = async () => {
  try {
    await connectDB();
    initCloudinary();

    // Ensure initial Bela Bakers catalogue and owner account exist
    await seedInitialCatalogue();
    await ensureInitialOwner();

    app.listen(PORT, () => {
      console.log(`🚀 Bela Bakers Backend Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start Bela Bakers server:', error);
    process.exit(1);
  }
};

startServer();
