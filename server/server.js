import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import path from 'path';
import fs from 'fs';
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
const parseAllowedOrigins = () => {
  const envOrigins = (process.env.CLIENT_URL || '')
    .split(',')
    .map((s) => s.trim().replace(/\/$/, ''))
    .filter(Boolean);
  return [
    ...envOrigins,
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:4173',
    'http://localhost:3000',
  ];
};

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      const allowed = parseAllowedOrigins();
      const originNormalized = origin.replace(/\/$/, '');
      if (
        allowed.includes(originNormalized) ||
        originNormalized.endsWith('.vercel.app') || // Support all Vercel production & preview URLs
        originNormalized.endsWith('.onrender.com') ||
        originNormalized.includes('localhost')
      ) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
  })
);
app.options('*', cors());

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

// Optional: Serve static client frontend if dist exists (e.g. all-in-one Render deployment)
const clientDistPath = path.resolve(process.cwd(), '../client/dist');
const localDistPath = path.resolve(process.cwd(), 'client/dist');
const resolvedDist = fs.existsSync(clientDistPath)
  ? clientDistPath
  : fs.existsSync(localDistPath)
  ? localDistPath
  : null;

if (resolvedDist) {
  app.use(express.static(resolvedDist));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
      return next();
    }
    res.sendFile(path.join(resolvedDist, 'index.html'));
  });
}

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
