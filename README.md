# EventNest - Event Booking Application

A full-stack MERN (MongoDB, Express, React, Node.js) event booking platform with Stripe payment integration, real-time notifications, and role-based access control.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Database Schema](#database-schema)
- [Backend Architecture](#backend-architecture)
- [Frontend Architecture](#frontend-architecture)
- [API Endpoints](#api-endpoints)
- [Authentication & Authorization](#authentication--authorization)
- [Installation & Setup](#installation--setup)
- [Environment Variables](#environment-variables)
- [Usage](#usage)

---

## 🎯 Overview

EventNest is a modern event booking application that allows users to discover, book, and manage event tickets. Administrators can create and manage events, while users can browse events, make bookings, and receive notifications about their upcoming events.

**Key Capabilities:**
- Browse and search events by location and category
- Secure user authentication with JWT tokens
- Stripe payment integration for ticket purchases
- Real-time notifications for booking confirmations and event reminders
- Admin dashboard for event and booking management
- Automated email reminders 24 hours before events
- Responsive design with modern UI/UX 

---

## ✨ Features

### User Features

#### 1. **Event Discovery**
- Browse all available events
- Filter events by location (city)
- View events by category (concert, conference, workshop, festival, other)
- See event details including venue, date, price, and available seats
- Location-based event recommendations using geolocation

#### 2. **User Authentication**
- User registration with email and password
- Secure login with JWT access and refresh tokens
- Password hashing with bcrypt
- Profile management (view and update user details)
- Automatic token refresh mechanism

#### 3. **Booking System**
- Book tickets for events
- Select quantity of tickets
- Real-time seat availability checking
- Unique booking ID generation (UUID)
- View booking history with event details
- Download booking confirmations as PDF

#### 4. **Payment Integration**
- Stripe Checkout integration
- Secure payment processing
- Support for free events (₹0)
- Payment success/failure handling
- Webhook integration for payment verification

#### 5. **Notifications**
- In-app notification system
- Booking confirmation notifications
- Event reminder notifications (24 hours before event)
- Unread notification count
- Mark notifications as read
- Email notifications for important updates

### Admin Features

#### 1. **Event Management**
- Create new events with full details
- Update existing events 
- Delete events
- Toggle event active/inactive status
- View all events with statistics

#### 2. **Booking Management**
- View all bookings across all events
- Filter bookings by status
- View event attendees with check-in IDs
- Access user information for verification

#### 3. **Dashboard Analytics**
- Total events count
- Total bookings count
- Total revenue calculation
- Event-wise booking statistics

---

## 🛠 Tech Stack

### Backend
- **Runtime:** Node.js (v18+)
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (jsonwebtoken)
- **Password Hashing:** bcryptjs
- **Payment:** Stripe API
- **Email:** Nodemailer
- **Validation:** express-validator
- **Scheduling:** node-cron
- **Others:** cors, cookie-parser, body-parser, morgan, dotenv

### Frontend
- **Library:** React 18
- **Routing:** React Router DOM v6
- **HTTP Client:** Axios
- **Styling:** Tailwind CSS
- **Build Tool:** Vite
- **PDF Generation:** jsPDF, html2canvas
- **Fonts:** Inter (Google Fonts)

---

## 🗄 Database Schema

### 1. User Model
```javascript
{
  name: String (required, trimmed)
  email: String (required, unique, lowercase, trimmed)
  password: String (required, min 6 chars, hashed)
  role: String (enum: ["user", "admin"], default: "user")
  refreshToken: String
  timestamps: true (createdAt, updatedAt)
}
```

**Indexes:**
- Unique index on `email`

**Methods:**
- `matchPassword(candidatePassword)` - Compare password with hashed password

**Hooks:**
- Pre-save hook to hash password before saving

---

### 2. Event Model
```javascript
{
  title: String (required, trimmed)
  description: String (required)
  category: String (enum: ["concert", "conference", "workshop", "festival", "other"], default: "other")
  venue: String (required)
  location: String (required) // City name
  startDate: Date (required)
  endDate: Date (required)
  price: Number (required, min: 0)
  totalSeats: Number (required, min: 1)
  bookedSeats: Number (default: 0, min: 0)
  isActive: Boolean (default: true)
  imageUrl: String (optional)
  timestamps: true
}
```

**Virtual Fields:**
- `availableSeats` - Calculated as `totalSeats - bookedSeats`

---

### 3. Booking Model
```javascript
{
  bookingId: String (UUID, unique, auto-generated)
  user: ObjectId (ref: "User", required)
  event: ObjectId (ref: "Event", required)
  quantity: Number (required, min: 1)
  totalAmount: Number (required, min: 0)
  status: String (enum: ["pending", "confirmed", "cancelled"], default: "pending")
  paymentStatus: String (enum: ["pending", "completed", "failed"], default: "pending")
  paymentIntentId: String (Stripe payment intent ID)
  reminderSent: Boolean (default: false)
  timestamps: true
}
```

**Relationships:**
- Belongs to User (many-to-one)
- Belongs to Event (many-to-one)

---

### 4. Payment Model
```javascript
{
  booking: ObjectId (ref: "Booking", required)
  provider: String (enum: ["stripe", "paypal"], default: "stripe")
  amount: Number (required)
  currency: String (default: "usd")
  status: String (enum: ["pending", "completed", "failed"], default: "pending")
  rawResponse: Object (stores complete payment provider response)
  timestamps: true
}
```

---

### 5. Notification Model
```javascript
{
  user: ObjectId (ref: "User", required, indexed)
  booking: ObjectId (ref: "Booking", optional)
  type: String (enum: ["event_reminder", "booking_confirmation", "event_update"], required)
  message: String (required)
  read: Boolean (default: false)
  timestamps: true
}
```

**Indexes:**
- Compound index on `{ user: 1, read: 1, createdAt: -1 }` for efficient queries

---

## 🏗 Backend Architecture

### Directory Structure
```
backend/
├── src/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js     # Authentication logic
│   │   ├── eventController.js    # Event CRUD operations
│   │   ├── bookingController.js  # Booking management
│   │   ├── paymentController.js  # Stripe integration
│   │   └── notificationController.js # Notification handling
│   ├── middleware/
│   │   ├── authMiddleware.js     # JWT verification & role checking
│   │   └── errorMiddleware.js    # Error handling
│   ├── models/
│   │   ├── User.js
│   │   ├── Event.js
│   │   ├── Booking.js
│   │   ├── Payment.js
│   │   └── Notification.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── eventRoutes.js
│   │   ├── bookingRoutes.js
│   │   ├── paymentRoutes.js
│   │   └── notificationRoutes.js
│   ├── utils/
│   │   ├── tokens.js             # JWT token generation
│   │   ├── email.js              # Email sending utility
│   │   └── emailTemplates.js     # Email HTML templates
│   ├── seed/
│   │   ├── seedEvents.js         # Seed sample events
│   │   └── seedUsers.js          # Seed admin/test users
│   └── server.js                 # Express app & server setup
├── .env
└── package.json
```

### Middleware Implementation

#### 1. **Authentication Middleware (`protect`)**
```javascript
// Location: src/middleware/authMiddleware.js

export const protect = async (req, res, next) => {
  // 1. Extract JWT token from Authorization header
  // 2. Verify token using JWT_ACCESS_SECRET
  // 3. Decode token to get user ID
  // 4. Fetch user from database (exclude password & refreshToken)
  // 5. Attach user to req.user
  // 6. Call next() or return 401 error
}
```

**Usage:** Applied to all protected routes requiring authentication

---

#### 2. **Role-Based Authorization Middleware (`requireRole`)**
```javascript
// Location: src/middleware/authMiddleware.js

export const requireRole = (...roles) => {
  return (req, res, next) => {
    // 1. Check if req.user exists (must use after protect middleware)
    // 2. Verify user's role is in allowed roles array
    // 3. Call next() or return 403 Forbidden error
  }
}
```

**Usage:** Applied to admin-only routes
```javascript
router.post("/events", protect, requireRole("admin"), createEvent);
```

---

### Automated Background Jobs

#### Cron Job: Event Reminders
```javascript
// Location: src/server.js
// Schedule: Every hour (0 * * * *)

// Process:
// 1. Find all confirmed bookings where reminderSent = false
// 2. Check if event starts within next 24 hours
// 3. Create in-app notification
// 4. Send email reminder
// 5. Mark reminderSent = true
```

---

## 🎨 Frontend Architecture

### Directory Structure
```
frontend/
├── src/
│   ├── components/
│   │   ├── Layout.jsx              # Main layout with header/footer
│   │   ├── EventCard.jsx           # Event display card
│   │   ├── ProtectedRoute.jsx      # Route guards
│   │   ├── NotificationDropdown.jsx # Notification UI
│   │   └── TermsPolicy.jsx         # Terms modal
│   ├── pages/
│   │   ├── Home.jsx                # Landing page
│   │   ├── EventsList.jsx          # All events page
│   │   ├── EventDetails.jsx        # Single event details
│   │   ├── AuthPages.jsx           # Login & Register
│   │   ├── BookingsPage.jsx        # User bookings
│   │   ├── AdminDashboard.jsx      # Admin panel
│   │   └── CheckoutResult.jsx      # Payment success/cancel
│   ├── context/
│   │   └── AuthContext.jsx         # Global auth state
│   ├── services/
│   │   └── api.js                  # API client & endpoints
│   ├── hooks/
│   │   └── useGeolocation.js       # Get user location
│   ├── utils/
│   ├── App.jsx                     # Route configuration
│   ├── main.jsx                    # React entry point
│   └── index.css                   # Global styles
├── public/
├── index.html
├── tailwind.config.js
├── vite.config.mts
└── package.json
```

### Route Protection Implementation

#### 1. **ProtectedRoute Component**
```javascript
// Protects routes requiring authentication
// Redirects to /login if not authenticated
// Shows loading spinner while checking auth state

<Route element={<ProtectedRoute />}>
  <Route path="/bookings" element={<BookingsPage />} />
  <Route path="/checkout/success" element={<CheckoutSuccess />} />
</Route>
```

#### 2. **AdminRoute Component**
```javascript
// Protects admin-only routes
// Checks both authentication AND admin role
// Redirects to / if not authenticated or not admin

<Route element={<AdminRoute />}>
  <Route path="/admin" element={<AdminDashboard />} />
</Route>
```

### State Management

#### AuthContext
```javascript
// Global authentication state management
// Provides:
// - user: Current user object
// - isAuthenticated: Boolean
// - isAdmin: Boolean
// - loading: Boolean
// - login(credentials): Function
// - register(userData): Function
// - logout(): Function
```

**Implementation Details:**
- Stores JWT tokens in localStorage
- Automatically attaches token to API requests
- Refreshes user data on app load
- Handles token expiration

---

## 📡 API Endpoints

### Authentication Routes (`/api/auth`)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/register` | Public | Register new user |
| POST | `/login` | Public | Login user |
| POST | `/refresh-token` | Public | Refresh access token |
| GET | `/me` | Protected | Get current user profile |
| PUT | `/profile` | Protected | Update user profile |

#### POST /api/auth/register
**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "user": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  },
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc..."
}
```

**Validation:**
- Name: Required, non-empty
- Email: Required, valid email format
- Password: Required, minimum 6 characters

---

#### POST /api/auth/login
**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "user": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  },
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc..."
}
```

**Error Responses:**
- 400: Invalid credentials
- 401: Incorrect password

---

### Event Routes (`/api/events`)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/` | Public | Get all events (with filters) |
| GET | `/:id` | Public | Get single event by ID |
| POST | `/` | Admin | Create new event |
| PUT | `/:id` | Admin | Update event |
| DELETE | `/:id` | Admin | Delete event |
| PATCH | `/:id/toggle` | Admin | Toggle event active status |

#### GET /api/events
**Query Parameters:**
- `location` (optional): Filter by city name
- `category` (optional): Filter by category
- `isActive` (optional): Filter by active status

**Response:**
```json
[
  {
    "_id": "...",
    "title": "Summer Music Festival",
    "description": "Annual music festival...",
    "category": "festival",
    "venue": "Central Park",
    "location": "New York",
    "startDate": "2024-07-15T18:00:00.000Z",
    "endDate": "2024-07-15T23:00:00.000Z",
    "price": 50,
    "totalSeats": 1000,
    "bookedSeats": 250,
    "isActive": true,
    "imageUrl": "https://...",
    "createdAt": "...",
    "updatedAt": "..."
  }
]
```

---

#### POST /api/events (Admin Only)
**Request Body:**
```json
{
  "title": "Tech Conference 2024",
  "description": "Annual technology conference",
  "category": "conference",
  "venue": "Convention Center",
  "location": "San Francisco",
  "startDate": "2024-09-20T09:00:00.000Z",
  "endDate": "2024-09-20T18:00:00.000Z",
  "price": 100,
  "totalSeats": 500,
  "imageUrl": "https://..."
}
```

**Authorization:** Requires `protect` + `requireRole("admin")` middleware

---

### Booking Routes (`/api/bookings`)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/` | Protected | Create new booking |
| GET | `/me` | Protected | Get user's bookings |
| GET | `/` | Admin | Get all bookings |
| GET | `/event/:eventId/attendees` | Protected | Get event attendees |

#### POST /api/bookings
**Request Body:**
```json
{
  "eventId": "event_id_here",
  "quantity": 2
}
```

**Process:**
1. Verify user is authenticated
2. Check event exists and is active
3. Verify sufficient seats available
4. Calculate total amount (quantity × event price)
5. Create booking with "pending" status
6. Return booking details for payment

**Response:**
```json
{
  "_id": "...",
  "bookingId": "uuid-v4-string",
  "user": "user_id",
  "event": "event_id",
  "quantity": 2,
  "totalAmount": 100,
  "status": "pending",
  "paymentStatus": "pending",
  "createdAt": "..."
}
```

---

#### GET /api/bookings/me
**Response:**
```json
[
  {
    "_id": "...",
    "bookingId": "abc-123-def",
    "quantity": 2,
    "totalAmount": 100,
    "status": "confirmed",
    "paymentStatus": "completed",
    "event": {
      "_id": "...",
      "title": "Summer Festival",
      "venue": "Central Park",
      "startDate": "...",
      "imageUrl": "..."
    },
    "createdAt": "..."
  }
]
```

**Population:** Automatically populates `event` field with event details

---

#### GET /api/bookings/event/:eventId/attendees
**Response:**
```json
[
  {
    "bookingId": "abc-123-def",
    "userName": "John Doe",
    "userEmail": "john@example.com",
    "quantity": 2,
    "status": "confirmed"
  }
]
```

**Use Case:** Admin verification at event entrance

---

### Payment Routes (`/api/payments`)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/stripe/checkout-session` | Protected | Create Stripe checkout |
| POST | `/stripe/webhook` | Public (Stripe) | Stripe webhook handler |
| POST | `/stripe/verify-session` | Protected | Verify payment session |

#### POST /api/payments/stripe/checkout-session
**Request Body:**
```json
{
  "bookingId": "booking_id_here"
}
```

**Process:**
1. Fetch booking with event details
2. Create Stripe Checkout Session
3. Return session URL for redirect

**Response:**
```json
{
  "url": "https://checkout.stripe.com/pay/cs_test_..."
}
```

**Frontend Flow:**
```javascript
// 1. Create booking
const booking = await BookingsAPI.create({ eventId, quantity });

// 2. Create Stripe session
const { data } = await PaymentsAPI.createSession({ 
  bookingId: booking._id 
});

// 3. Redirect to Stripe Checkout
window.location.href = data.url;
```

---

#### POST /api/payments/stripe/webhook
**Purpose:** Handle Stripe webhook events

**Events Handled:**
- `checkout.session.completed`: Payment successful
  - Update booking status to "confirmed"
  - Update payment status to "completed"
  - Update event bookedSeats
  - Create booking confirmation notification
  - Send confirmation email

**Security:** Verifies webhook signature using Stripe webhook secret

**Note:** Requires raw body parser (configured in server.js)

---

### Notification Routes (`/api/notifications`)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/` | Protected | Get user notifications |
| GET | `/unread-count` | Protected | Get unread count |
| PUT | `/:id/read` | Protected | Mark notification as read |
| PUT | `/read-all` | Protected | Mark all as read |

#### GET /api/notifications
**Response:**
```json
[
  {
    "_id": "...",
    "type": "booking_confirmation",
    "message": "Your booking for Summer Festival has been confirmed",
    "read": false,
    "booking": {
      "_id": "...",
      "bookingId": "abc-123"
    },
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
]
```

**Sorting:** Returns notifications sorted by `createdAt` descending (newest first)

---

## 🔐 Authentication & Authorization

### JWT Token Strategy

#### Access Token
- **Purpose:** Short-lived token for API authentication
- **Expiration:** 15 minutes
- **Storage:** localStorage (frontend)
- **Usage:** Attached to all protected API requests via Authorization header

#### Refresh Token
- **Purpose:** Long-lived token to obtain new access tokens
- **Expiration:** 7 days
- **Storage:** Database (User model) + localStorage (frontend)
- **Usage:** Refresh access token without re-login

### Token Generation
```javascript
// Location: src/utils/tokens.js

export const generateAccessToken = (userId) => {
  return jwt.sign(
    { sub: userId },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: '15m' }
  );
};

export const generateRefreshToken = (userId) => {
  return jwt.sign(
    { sub: userId },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );
};
```

### Password Security
- **Hashing Algorithm:** bcrypt with salt rounds = 10
- **Implementation:** Pre-save hook in User model
- **Verification:** `user.matchPassword(candidatePassword)` method

### Authorization Levels

#### 1. Public Routes
- No authentication required
- Examples: Event listing, event details, login, register

#### 2. Protected Routes
- Requires valid JWT access token
- Examples: User bookings, create booking, notifications

#### 3. Admin Routes
- Requires authentication + admin role
- Examples: Create/update/delete events, view all bookings

### Frontend Route Guards

```javascript
// ProtectedRoute: Requires authentication
<Route element={<ProtectedRoute />}>
  <Route path="/bookings" element={<BookingsPage />} />
</Route>

// AdminRoute: Requires authentication + admin role
<Route element={<AdminRoute />}>
  <Route path="/admin" element={<AdminDashboard />} />
</Route>
```

**Implementation:**
- Checks `isAuthenticated` from AuthContext
- Redirects to `/login` if not authenticated
- AdminRoute additionally checks `isAdmin` flag
- Shows loading spinner during auth state verification

## 🚀 Local Setup Guide

### System Requirements

#### Required Software Versions

| Software | Minimum Version | Recommended Version | Purpose |
|----------|----------------|---------------------|---------|
| **Node.js** | v18.0.0 | v18.17.0 or higher | JavaScript runtime |
| **npm** | v9.0.0 | v9.6.7 or higher | Package manager |
| **MongoDB** | v5.0 | v6.0 or higher | Database |
| **Git** | v2.30.0 | Latest | Version control |

#### Optional Tools
- **MongoDB Compass** - GUI for MongoDB (recommended for beginners)
- **Postman** - API testing tool
- **VS Code** - Recommended code editor

---

### Step 1: Install Node.js and npm

#### Windows
1. Download Node.js installer from [nodejs.org](https://nodejs.org/)
2. Run the installer (choose LTS version)
3. Verify installation:
```bash
node --version  # Should show v18.x.x or higher
npm --version   # Should show v9.x.x or higher
```

#### macOS
```bash
# Using Homebrew
brew install node@18

# Verify installation
node --version
npm --version
```

#### Linux (Ubuntu/Debian)
```bash
# Using NodeSource repository
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version
npm --version
```

---

### Step 2: Install MongoDB

#### Option A: Local MongoDB Installation

**Windows:**
1. Download MongoDB Community Server from [mongodb.com](https://www.mongodb.com/try/download/community)
2. Run the installer (choose "Complete" installation)
3. Install as a Windows Service
4. MongoDB will run on `mongodb://localhost:27017` by default

**macOS:**
```bash
# Using Homebrew
brew tap mongodb/brew
brew install mongodb-community@6.0

# Start MongoDB service
brew services start mongodb-community@6.0

# Verify MongoDB is running
mongosh --eval "db.version()"
```

**Linux (Ubuntu/Debian):**
```bash
# Import MongoDB public GPG key
curl -fsSL https://pgp.mongodb.com/server-6.0.asc | sudo gpg -o /usr/share/keyrings/mongodb-server-6.0.gpg --dearmor

# Add MongoDB repository
echo "deb [ signed-by=/usr/share/keyrings/mongodb-server-6.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

# Install MongoDB
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start MongoDB service
sudo systemctl start mongod
sudo systemctl enable mongod

# Verify MongoDB is running
mongosh --eval "db.version()"
```

#### Option B: MongoDB Atlas (Cloud Database)

1. Create free account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster (free tier available)
3. Create database user with password
4. Whitelist your IP address (or use 0.0.0.0/0 for development)
5. Get connection string:
   - Click "Connect" → "Connect your application"
   - Copy connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/`)
6. Use this connection string in your `.env` file

---

### Step 3: Clone the Repository

```bash
# Clone the repository
git clone <repository-url>
cd EventNest

# Verify project structure
ls -la
# Should see: backend/, frontend/, README.md
```

---

### Step 4: Backend Setup

#### 1. Navigate to backend directory
```bash
cd backend
```

#### 2. Install dependencies
```bash
npm install
```

**Expected packages installed:**
- express (v4.19.0)
- mongoose (v8.5.0)
- jsonwebtoken (v9.0.2)
- bcryptjs (v2.4.3)
- stripe (v16.0.0)
- nodemailer (v6.9.13)
- node-cron (v3.0.3)
- cors, dotenv, express-validator, etc.

#### 3. Create environment file
```bash
# Create .env file in backend directory
touch .env
```

#### 4. Configure .env file
Open `.env` and add the following configuration:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
# For Local MongoDB:
MONGO_URI=mongodb://localhost:27017/eventnest

# OR for MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/eventnest?retryWrites=true&w=majority

# JWT Secrets (Generate random strings)
JWT_ACCESS_SECRET=your_super_secret_access_key_min_32_chars
JWT_REFRESH_SECRET=your_super_secret_refresh_key_min_32_chars

# Stripe Configuration
# Get these from: https://dashboard.stripe.com/test/apikeys
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Frontend URL
CLIENT_URL=http://localhost:5173

# Email Configuration (Gmail example)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
EMAIL_FROM=EventNest <noreply@eventnest.com>
```

**Important Notes:**
- **JWT Secrets:** Generate random strings (minimum 32 characters). You can use: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
- **Stripe Keys:** Get from [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys) (use test mode keys)
- **Gmail App Password:** If using Gmail, enable 2FA and create an [App Password](https://myaccount.google.com/apppasswords)

#### 5. Seed the database (Optional but recommended)
```bash
# Seed admin and test users
npm run seed:users

# Seed sample events
npm run seed:events
```

**Default credentials created:**
- Admin: `admin@eventnest.com` / `admin123`
- User: `user@example.com` / `user123`

#### 6. Start backend server
```bash
# Development mode (with auto-reload)
npm run dev

# OR Production mode
npm start
```

**Expected output:**
```
Server running on port 5000
MongoDB connected successfully
```

Backend will be available at: `http://localhost:5000`

---

### Step 5: Frontend Setup

#### 1. Open new terminal and navigate to frontend
```bash
cd frontend
```

#### 2. Install dependencies
```bash
npm install
```

**Expected packages installed:**
- react (v18.3.1)
- react-router-dom (v6.28.0)
- axios (v1.7.0)
- tailwindcss (v3.4.15)
- vite (v6.0.0)
- jspdf, html2canvas, etc.

#### 3. Create environment file
```bash
# Create .env file in frontend directory
touch .env
```

#### 4. Configure .env file
```env
VITE_API_URL=http://localhost:5000/api
```

#### 5. Start frontend development server
```bash
npm run dev
```

**Expected output:**
```
VITE v6.4.1  ready in 1046 ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

Frontend will be available at: `http://localhost:5173`

---

### Step 6: Verify Installation

#### 1. Check Backend Health
Open browser or use curl:
```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

#### 2. Check Frontend
1. Open browser: `http://localhost:5173`
2. You should see the EventNest home page
3. Try navigating to `/events` to see event listings

#### 3. Test Complete Flow
1. Register a new account
2. Login with credentials
3. Browse events
4. Try booking an event (use Stripe test card: `4242 4242 4242 4242`)

---

### Troubleshooting

#### MongoDB Connection Issues

**Error: "MongoServerError: Authentication failed"**
```bash
# Solution: Check MongoDB credentials in MONGO_URI
# For local MongoDB, use: mongodb://localhost:27017/eventnest
# For Atlas, verify username and password are correct
```

**Error: "MongooseServerSelectionError: connect ECONNREFUSED"**
```bash
# Solution: MongoDB service is not running

# Windows: Start MongoDB service
net start MongoDB

# macOS:
brew services start mongodb-community

# Linux:
sudo systemctl start mongod
```

#### Port Already in Use

**Error: "Port 5000 is already in use"**
```bash
# Solution 1: Kill process using port 5000
# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux:
lsof -ti:5000 | xargs kill -9

# Solution 2: Change port in backend/.env
PORT=5001
```

**Error: "Port 5173 is already in use"**
```bash
# Vite will automatically try next available port (5174, 5175, etc.)
# Or manually specify port:
npm run dev -- --port 3000
```

#### Stripe Webhook Issues

**Error: "Webhook signature verification failed"**
```bash
# Solution: Use Stripe CLI for local testing
# Install Stripe CLI: https://stripe.com/docs/stripe-cli
stripe login
stripe listen --forward-to localhost:5000/api/payments/stripe/webhook

# Copy the webhook signing secret and update .env:
STRIPE_WEBHOOK_SECRET=whsec_...
```

#### Email Sending Issues

**Error: "Invalid login: 535-5.7.8 Username and Password not accepted"**
```bash
# Solution: For Gmail, create App Password
# 1. Enable 2-Factor Authentication
# 2. Go to: https://myaccount.google.com/apppasswords
# 3. Generate app password for "Mail"
# 4. Use generated password in EMAIL_PASS
```

#### Module Not Found Errors

```bash
# Solution: Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### CORS Errors in Browser

```bash
# Solution: Verify CLIENT_URL in backend/.env matches frontend URL
CLIENT_URL=http://localhost:5173

# Restart backend server after changing .env
```

---

### Development Workflow

#### Running Both Servers Concurrently

**Option 1: Two Terminals**
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend  
cd frontend
npm run dev
```

**Option 2: Using concurrently (Optional)**
```bash
# Install concurrently in root directory
npm install -g concurrently

# Create script in root package.json
{
  "scripts": {
    "dev": "concurrently \"cd backend && npm run dev\" \"cd frontend && npm run dev\""
  }
}

# Run both servers
npm run dev
```

---

### Production Build

#### Backend
```bash
cd backend
npm start
```

#### Frontend
```bash
cd frontend
npm run build

# Preview production build
npm run preview
```

Build output will be in `frontend/dist/` directory.

---

### Database Management

#### View Database with MongoDB Compass
1. Download [MongoDB Compass](https://www.mongodb.com/products/compass)
2. Connect to: `mongodb://localhost:27017`
3. Select `eventnest` database
4. Browse collections: users, events, bookings, payments, notifications

#### MongoDB Shell Commands
```bash
# Connect to MongoDB
mongosh

# Switch to eventnest database
use eventnest

# View all collections
show collections

# View all users
db.users.find().pretty()

# View all events
db.events.find().pretty()

# Clear all bookings (for testing)
db.bookings.deleteMany({})

# Drop entire database (careful!)
db.dropDatabase()
```

---

### Quick Start Summary

```bash
# 1. Install Node.js v18+ and MongoDB

# 2. Clone and setup backend
cd backend
npm install
# Create and configure .env file
npm run seed:users
npm run seed:events
npm run dev

# 3. In new terminal, setup frontend
cd frontend
npm install
# Create .env with VITE_API_URL=http://localhost:5000/api
npm run dev

# 4. Open browser
# http://localhost:5173

# 5. Login with test account
# Email: admin@eventnest.com
# Password: admin123
```

---

## 🔧 Environment Variables

### Backend (.env)

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/eventnest
# OR for MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/eventnest

# JWT Secrets
JWT_ACCESS_SECRET=your_access_secret_key_here
JWT_REFRESH_SECRET=your_refresh_secret_key_here

# Stripe
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Frontend URL
CLIENT_URL=http://localhost:5173

# Email Configuration (Nodemailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_FROM=EventNest <noreply@eventnest.com>
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:5000/api
```

---

## 📖 Usage

### For Users

1. **Register/Login:**
   - Navigate to `/register` to create an account
   - Or `/login` if you already have an account

2. **Browse Events:**
   - Visit home page to see events near your location
   - Go to `/events` to see all available events
   - Filter by category or location

3. **Book Event:**
   - Click on an event card to view details
   - Select quantity and click "Book Now"
   - Complete payment via Stripe Checkout
   - Receive booking confirmation

4. **View Bookings:**
   - Navigate to `/bookings` to see all your bookings
   - Download booking confirmation as PDF
   - Check booking status and details

5. **Notifications:**
   - Click bell icon in header to view notifications
   - Receive reminders 24 hours before event
   - Get booking confirmation notifications

### For Admins

1. **Login as Admin:**
   - Use admin credentials (created via seed script)
   - Default: `admin@eventnest.com` / `admin123`

2. **Access Admin Dashboard:**
   - Navigate to `/admin`
   - View statistics (total events, bookings, revenue)

3. **Manage Events:**
   - Create new events with all details
   - Edit existing events
   - Toggle event active/inactive status
   - Delete events

4. **View Bookings:**
   - See all bookings across all events
   - View event attendees for verification
   - Access user information

### API Testing

Use the following test credentials:

**Admin User:**
```
Email: admin@eventnest.com
Password: admin123
```

**Regular User:**
```
Email: user@example.com
Password: user123
```

**Stripe Test Cards:**
```
Success: 4242 4242 4242 4242
Decline: 4000 0000 0000 0002
```

---

## 📝 Additional Implementation Details

### Geolocation Feature
- Uses browser Geolocation API
- Fetches user's coordinates
- Reverse geocodes to get city name
- Filters events by user's city
- Fallback to all events if location unavailable

### Email Notifications
- Powered by Nodemailer
- HTML email templates
- Sent for:
  - Booking confirmations
  - Event reminders (24h before)
  - Payment confirmations

### PDF Generation
- Uses jsPDF and html2canvas
- Generates booking confirmation PDFs
- Includes QR code with booking ID
- Downloadable from bookings page

### Error Handling
- Global error middleware
- Consistent error response format
- Validation errors from express-validator
- Mongoose validation errors
- JWT verification errors

### Security Features
- Password hashing with bcrypt
- JWT token authentication
- CORS configuration
- Input validation
- SQL injection prevention (Mongoose)
- XSS protection

---

## 🎯 Future Enhancements

- Real-time seat availability with WebSockets
- Event categories with images
- User reviews and ratings
- Event recommendations based on user preferences
- Social media integration
- Multi-language support
- Mobile app (React Native)
- Advanced analytics dashboard
- Refund management
- Event organizer role

---

## 👨‍💻 Developer Notes

### Code Organization
- Follow MVC pattern
- Separate concerns (routes, controllers, models)
- Reusable middleware
- Centralized error handling
- Environment-based configuration

### Best Practices
- Use async/await for asynchronous operations
- Proper error handling with try-catch
- Input validation on all endpoints
- Database indexing for performance
- Secure sensitive data in environment variables

### Testing Recommendations
- Unit tests for controllers
- Integration tests for API endpoints
- E2E tests for critical user flows
- Test payment webhooks using Stripe CLI
---
