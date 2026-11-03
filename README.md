# 🎂 Bela Bakers — Full-Stack Bakery Website

> **"Every Celebration Deserves a Beautiful Cake."**  
> *Freshly baked happiness, made with love in Gopalganj, Bihar.*

---

## 1. Business Overview

- **Business Name:** Bela Bakers
- **Business Category:** Cakes, pastries, cupcakes, cookies, donuts, and desserts.
- **Contact Number:** `+91 9060305323` (Calling & WhatsApp)
- **WhatsApp Order Link:** [https://wa.me/919060305323](https://wa.me/919060305323)
- **Location:** Gopalganj, Bihar, India
- **Bakery Address:** Dayal Complex, Cinema Road, Near Ambedkar Chowk, Gopalganj
- **Instagram:** [https://www.instagram.com/bela.desserts](https://www.instagram.com/bela.desserts)
- **Facebook:** [https://www.facebook.com/share/19vyPgVh6g/](https://www.facebook.com/share/19vyPgVh6g/)

---

## 2. Core Business Rule: Direct WhatsApp Ordering

⚠️ **THERE IS STRICTLY NO ONLINE PAYMENT GATEWAY IN THIS APPLICATION.**

- No Razorpay, Stripe, PayPal, UPI payment gateway APIs, or online checkout flows exist.
- All customer orders are communicated directly to the owner through **WhatsApp**.
- The customer and shop owner discuss custom designs, finalize delivery charges, and settle payment arrangements directly outside the website.
- **Mandatory Customer Notice:**
  > *"Place your order through WhatsApp. Our team will contact you to confirm availability, delivery details, and payment arrangements."*
  > *"Your order is not confirmed until Bela Bakers confirms it through WhatsApp."*

---

## 3. Technology Stack

### Frontend (`client/`)
- **React 18** with **Vite**
- **Tailwind CSS** with official Bela Bakers brand palette:
  - Deep Navy Blue: `#082B59`
  - Cream: `#FFF0D9`
  - White: `#FFFFFF`
  - Gold Accents: `#D8B46A`
- **React Router v6** (Nested public & protected routes)
- **Lucide React** icons
- **LocalStorage Cart Persistence**

### Backend (`server/`)
- **Node.js** & **Express.js** REST API (ES Modules)
- **MongoDB Atlas** with **Mongoose** (auto-fallback to embedded MongoDB for local testing)
- **Cloudinary** SDK for cake photographs (with automatic compression & optimization)
- **Security:** `helmet`, `cors`, `express-rate-limit`, `bcryptjs` password hashing, and secure `HTTP-only` cookies for owner session authentication.

---

## 4. Features

### Customer-Facing Storefront
1. **Home Page (`/`)**:
   - Bela Bakers branding & navigation.
   - Hero section with headline: *"Every Celebration Deserves a Beautiful Cake."* and supporting text: *"Freshly baked happiness, made with love."*
   - Interactive category cards (Counter Cakes, Custom Cakes, Pastries, Cupcakes, Cookies, Donuts, Desserts).
   - "Featured Celebrations" carousel populated dynamically from MongoDB.
   - Bespoke theme cakes spotlight.
   - "The Bela Bakers Promise" trust section.
   - Shop visit preview with Gopalganj address.
   - Floating WhatsApp Quick Order button.
2. **Shop Catalogue (`/shop`)**:
   - Live products loaded from MongoDB Atlas.
   - Filter by category, search by cake name, and sort by price or featured status.
   - Real-time availability indicator (only available cakes shown to customers).
   - Dynamic weight variants with instant price calculation.
3. **Product Details (`/product/:id`)**:
   - High-resolution cake photograph.
   - Variant selector (500 g, 1 kg, 1 lb, per piece, etc.) with exact prices.
   - Quantity counter.
   - Custom celebration details form (occasion, preferred flavour, design description, message on cake, delivery date).
   - Add to Cart button + Direct WhatsApp order button.
4. **Shopping Cart (`/cart`)**:
   - Persisted in browser `localStorage`.
   - Update quantities, remove items, or switch cake weight variants.
   - Estimated order subtotal.
   - Optional pre-order form (Customer name, preferred delivery date, address in Gopalganj, message on cake).
   - **Order on WhatsApp Button**: Generates a prefilled, formatted message and opens WhatsApp URL directly.
5. **Contact Page (`/contact`)**:
   - Full bakery address, telephone, and social links.
   - Operating hours (Monday – Sunday: 9:00 AM – 10:00 PM).
   - Interactive embedded Google Map.
   - Instant WhatsApp enquiry composer.
6. **Custom 404 Page (`*`)**:
   - Elegant branded page guiding customers back to the freshest bakes.

### Owner Administration Portal (`/admin`)
1. **Secure Owner Authentication (`/admin/login`)**:
   - Email & password login backed by bcrypt password hashing.
   - Secure HTTP-only cookies (`bela_owner_token`).
   - Brute-force rate limiting on login endpoint.
   - Protected route verification middleware.
2. **Dashboard Overview (`/admin`)**:
   - Total active products in database.
   - Products marked unavailable.
   - Total manually recorded orders.
   - Catalogue items flagged for owner review.
   - Recent order records table.
   - Popular products list (computed strictly from real recorded orders).
3. **Cake & Price Management (`/admin/products`)**:
   - Add new products (`/admin/products/new`).
   - Edit existing products (`/admin/products/:id`).
   - Real-time price updates (updates MongoDB and reflects immediately on the customer site).
   - Add, edit, or remove weight variants (500 g, 1 kg, per pound, etc.).
   - Upload new cake photographs via Cloudinary or local fallback.
   - One-click toggle for availability (Available ↔ Sold Out).
   - One-click toggle for featuring on homepage.
   - Delete product with confirmation.
4. **Order & Enquiry Ledger (`/admin/orders`)**:
   - Manual tracking ledger for WhatsApp customer requests.
   - Log customer name, phone number, cake item, weight variant, quantity, agreed price, delivery address, and date.
   - Update order status: `enquiry` ➔ `contacted` ➔ `confirmed` ➔ `preparing` ➔ `ready` ➔ `delivered` ➔ `cancelled`.
   - Add / edit internal kitchen or payment notes.
5. **Shop Settings (`/admin/settings`)**:
   - Update operating hours, address, and announcement banner.

---

## 5. Getting Started & Installation

### Prerequisites
- Node.js (v18 or higher)
- npm or pnpm

### Project Structure
```
bela-bakers/
  ├── client/                 # React + Vite + Tailwind frontend
  │   ├── src/
  │   │   ├── components/     # Navbar, Footer, ProductCard, FloatingWhatsAppButton
  │   │   ├── context/        # CartContext, AuthContext
  │   │   ├── layouts/        # CustomerLayout
  │   │   ├── pages/          # HomePage, ShopPage, ProductDetailsPage, CartPage, ContactPage, NotFoundPage
  │   │   │   └── admin/      # AdminLayout, AdminDashboard, AdminLogin, AdminProducts, AdminProductForm, AdminOrders, AdminSettings
  │   │   ├── services/       # api.js, whatsapp.js
  │   │   ├── App.jsx
  │   │   ├── main.jsx
  │   │   └── index.css
  │   ├── index.html
  │   ├── vite.config.js
  │   └── package.json
  │
  ├── server/                 # Express REST API backend
  │   ├── config/             # db.js, cloudinary.js
  │   ├── controllers/        # authController, productController, orderController, settingsController
  │   ├── middleware/         # authMiddleware, uploadMiddleware
  │   ├── models/             # Product.js, AdminUser.js, OrderRecord.js, ShopSettings.js
  │   ├── routes/             # authRoutes, productRoutes, orderRoutes, settingsRoutes
  │   ├── scripts/            # catalogueData.js, seedCatalogue.js, createAdmin.js
  │   ├── utils/              # sanitize.js
  │   ├── server.js
  │   └── package.json
  │
  ├── README.md
  └── .gitignore
```

---

## 6. Step-by-Step Setup

### Step 1: Backend Setup
```bash
cd server
npm install
```

Create `server/.env` based on `server/.env.example`:
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# MongoDB Atlas URI (Leave blank to use automatic local embedded database)
MONGODB_URI=

# JWT Secret
JWT_SECRET=bela_bakers_super_secret_jwt_key_2026_secured
JWT_EXPIRES_IN=7d

# Initial Owner Admin Account
INITIAL_ADMIN_EMAIL=owner@belabakers.com
INITIAL_ADMIN_PASSWORD=BelaBakers@2026

# Cloudinary (Optional - uploads fallback to /uploads if unconfigured)
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

### Step 2: Start Backend Server
```bash
npm run dev
# or
npm start
```
The server will automatically:
- Connect to MongoDB Atlas (or start an embedded database for local development).
- Seed the initial Bela Bakers cake catalogue (14+ products preserving per-pound and fixed-weight prices).
- Ensure the initial owner account exists (`owner@belabakers.com` / `BelaBakers@2026`).
- Listen on `http://localhost:5000`.

### Step 3: Frontend Setup
Open a new terminal:
```bash
cd client
npm install
npm run dev
```
Visit `http://localhost:5173` in your browser.

---

## 7. Owner Admin Credentials

- **Admin Login Route:** `http://localhost:5173/admin/login`
- **Default Owner Email:** `owner@belabakers.com`
- **Default Password:** `BelaBakers@2026`

To create or reset an owner account via CLI:
```bash
cd server
node scripts/createAdmin.js owner@belabakers.com NewStrongPassword123
```

---

## 8. Verifying Key Workflows

1. **Browsing Products:** Browse `http://localhost:5173/shop` to see cakes, weights, and live prices loaded from MongoDB.
2. **Adding to Cart:** Add any cake to cart, adjust quantities, or switch weight variants.
3. **Placing WhatsApp Order:** Go to `/cart`, click **Order on WhatsApp**. It opens WhatsApp Web or the app with an itemized message addressed to `+91 9060305323`.
4. **Owner Login & Price Change:**
   - Log in at `/admin/login`.
   - Go to `/admin/products`.
   - Edit any cake price (e.g. increase price by ₹50).
   - Visit the customer website at `/shop` — the updated price appears immediately without restarting or redeploying.
5. **Manual Order Ledger:** Go to `/admin/orders` to record WhatsApp orders, update preparation stages (`Preparing` ➔ `Ready` ➔ `Delivered`), and add kitchen notes.

---

## 9. Production Deployment

### Option A: Unified Service (Render / Railway / VPS)
1. Build frontend:
   ```bash
   cd client && npm run build
   ```
2. Serve static `client/dist` from Express in production by adding:
   ```js
   app.use(express.static(path.join(__dirname, '../client/dist')));
   app.get('*', (_req, res) => res.sendFile(path.join(__dirname, '../client/dist/index.html')));
   ```
3. Set environment variables on your cloud provider:
   - `MONGODB_URI`: Your MongoDB Atlas cluster connection string.
   - `JWT_SECRET`: A long random secret key.
   - `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`.
   - `INITIAL_ADMIN_EMAIL`, `INITIAL_ADMIN_PASSWORD`.

### Option B: Decoupled Deployment
- **Frontend:** Deploy `client/` to Vercel or Netlify. Set `VITE_API_BASE_URL=https://your-backend-domain.com/api`.
- **Backend:** Deploy `server/` to Render, Railway, or AWS EC2. Set `CLIENT_URL=https://your-frontend-domain.com`.

---

© **Bela Bakers**, Dayal Complex, Cinema Road, Near Ambedkar Chowk, Gopalganj, Bihar, India.
