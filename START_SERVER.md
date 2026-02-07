# How to Start the Event Booking System

## Quick Start Guide

### 1. Start Backend Server

Open a terminal and run:

```bash
cd backend
npm install
npm run dev
```

**Expected Output:**
```
MongoDB connected: localhost
Server running on port 5000
```

**If you see errors:**
- Make sure MongoDB is running on your system
- Check that port 5000 is not already in use
- Verify your `.env` file exists in the `backend` folder

### 2. Start Frontend Server

Open a **NEW** terminal window and run:

```bash
cd frontend
npm install
npm run dev
```

**Expected Output:**
```
VITE v6.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
```

### 3. Verify Backend is Running

Before logging in, verify the backend is accessible:

1. Open your browser
2. Go to: `http://localhost:5000/api/health`
3. You should see: `{"status":"ok","timestamp":"..."}`

If you see an error, the backend is not running correctly.

---

## Troubleshooting

### Backend Won't Start

**Error: "Cannot find module"**
```bash
cd backend
npm install
```

**Error: "MongoDB connection error"**
- Make sure MongoDB is installed and running
- Check your `.env` file has the correct `MONGO_URI`
- Default: `mongodb://localhost:27017/event-booking`

**Error: "Port 5000 already in use"**
- Change the port in `backend/.env`: `PORT=5001`
- Or stop the process using port 5000

### Frontend Can't Connect to Backend

**Error: "ERR_CONNECTION_REFUSED"**
- ✅ Make sure backend is running (check step 1)
- ✅ Verify backend is on port 5000 (or update frontend `.env`)
- ✅ Check `http://localhost:5000/api/health` in browser

**Error: "CORS error"**
- Check `backend/.env` has: `CLIENT_URL=http://localhost:5173`
- Make sure frontend is running on port 5173

### Login Issues

**"Invalid credentials"**
- Run the seed script: `cd backend && npm run seed:users`
- Use: `demo@test.com` / `demo123`

**"Network Error"**
- Backend server is not running
- Follow step 1 above to start backend

---

## Complete Setup Checklist

- [ ] MongoDB is installed and running
- [ ] Backend `.env` file exists with correct values
- [ ] Backend dependencies installed (`npm install` in backend folder)
- [ ] Backend server running (`npm run dev` in backend folder)
- [ ] Frontend dependencies installed (`npm install` in frontend folder)
- [ ] Frontend server running (`npm run dev` in frontend folder)
- [ ] Backend health check works: `http://localhost:5000/api/health`
- [ ] Test users created: `cd backend && npm run seed:users`

---

## Running Both Servers

You need **TWO terminal windows**:

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

Both should be running simultaneously for the app to work!

---

## Default Ports

- **Backend:** `http://localhost:5000`
- **Frontend:** `http://localhost:5173`
- **MongoDB:** `mongodb://localhost:27017`

---

## Need Help?

1. Check backend console for errors
2. Check frontend console for errors
3. Verify MongoDB is running: `mongosh` or check MongoDB Compass
4. Test backend directly: `http://localhost:5000/api/health`
