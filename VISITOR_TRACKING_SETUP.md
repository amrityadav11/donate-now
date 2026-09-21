# Visitor Tracking System - Setup & Testing Guide

## Overview
DaanSathi now has a real-time visitor tracking system that shows:
- **Online Now** - Users currently active (within last 5 minutes)
- **Today** - Visitors who came today
- **All Time** - Total visitors since launch

## Setup Instructions

### 1. Ensure Backend is Running
```bash
cd server
npm install  # If not already installed
npm start    # Start the server on port 5000
```

The backend should show:
```
🚀 Server running in development mode on port 5000
```

### 2. Check Environment Variables

**Backend** (`server/.env`):
- Should be configured and running
- Database connection should be working

**Frontend** (`client/.env` or `.env.local`):
```
VITE_API_URL=http://localhost:5000/api
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxxxxx
```

### 3. Run Frontend in Development

```bash
cd client
npm run dev
```

Frontend will run on `http://localhost:5173`

## Testing the Visitor Tracking

### Step 1: Open Browser Console
1. Open your browser (Chrome, Firefox, etc.)
2. Go to `http://localhost:5173`
3. Press `F12` to open Developer Tools
4. Go to **Console** tab

### Step 2: Check Console Logs
You should see logs like:
```
Recording visitor...
Fetching visitor stats...
Visitor stats: {
  totalVisitors: 1,
  todayVisitors: 1,
  sevenDaysVisitors: 1,
  onlineVisitors: 1
}
```

### Step 3: Check Visitor Counter Display
On the **Homepage**, you should see:
- A section between the Marquee and "Explore Causes"
- 3 cards showing:
  - 🟢 Online Now: 1
  - 📅 Today: 1
  - 👥 All Time: 1

On **Every Page Footer**, you should see:
- Compact indicator: "1 Online • 1 Total"

### Step 4: Verify Database Entry

Open MongoDB Atlas or your local MongoDB:
1. Go to database: `donation` (or your DB name)
2. Look for collection: `visitors`
3. You should see a document with:
   - `sessionId`: unique session identifier
   - `isOnline`: true
   - `visitedAt`: current timestamp
   - `lastActiveAt`: current timestamp
   - `pageViews`: 1

### Step 5: Test Heartbeat & Activity Update

1. Keep the page open for 30+ seconds
2. Check console - you should see:
```
Updating visitor activity...
Refreshing visitor stats...
Updated visitor stats: {...}
```

3. Visit another page on the site
4. Console should show activity updates
5. `pageViews` in database should increment

### Step 6: Test Online/Offline Detection

1. Keep a page open
2. **Wait 5 minutes without activity**
3. Check the database:
   - `isOnline` should change to `false`
   - Online count should decrease if no other visitors

## Troubleshooting

### Issue: "No users online or visited"

**Solution 1: Check if backend is running**
```bash
# In a new terminal, check port 5000
curl http://localhost:5000/api/health
```

Should return:
```json
{"success":true,"message":"Server is running"}
```

**Solution 2: Check browser console for errors**
- Open DevTools (F12)
- Look for error messages in red
- Common error: `Failed to fetch from http://localhost:5000`

**Solution 3: Verify API URL**
Check `.env` file in client folder:
```
VITE_API_URL=http://localhost:5000/api  ✅ Correct
VITE_API_URL=http://localhost:5000      ❌ Wrong
```

**Solution 4: Check CORS settings**
Backend should allow CORS. In `server/server.js`, should see:
```javascript
app.use(cors({
  origin: true,
  credentials: true,
}));
```

**Solution 5: Check MongoDB connection**
Backend console should show database connection success
```
MongoDB connected successfully
```

### Issue: Counter shows "..." (loading)

This means the API request timed out. Check:
1. Is backend running? (`npm start` in server folder)
2. Is the API URL correct in `.env`?
3. Are there network errors? (DevTools → Network tab)

### Issue: Numbers not updating

1. Check console for errors
2. Verify heartbeat is running (see logs every 30 seconds)
3. Hard refresh the page (Ctrl+Shift+R or Cmd+Shift+R)

## How It Works

### Frontend Flow
1. User visits homepage → VisitorCounter component mounts
2. Component generates/retrieves unique `sessionId` from localStorage
3. Sends POST `/api/visitors/record` with sessionId
4. Fetches current stats with GET `/api/visitors/stats`
5. Every 30 seconds: heartbeat POST `/api/visitors/activity`
6. Every 10 seconds: refresh stats display

### Backend Flow
1. Receives visitor record request
2. Creates or updates Visitor document in MongoDB
3. Sets `isOnline: true` and `lastActiveAt: now`
4. When stats requested:
   - Marks visitors offline if `lastActiveAt > 5 minutes ago`
   - Counts online: where `isOnline: true`
   - Counts today: where `visitedAt >= today at 00:00`
   - Counts all-time: total documents

## Monitor Visitor Activity

### Real-time Monitoring
Open MongoDB Atlas → collections → visitors → browse documents
- Watch documents update in real-time
- See `lastActiveAt` update every 30 seconds
- Watch `pageViews` increment

### Check Logs
Backend console will show:
```
POST /api/visitors/record - Visitor recorded
POST /api/visitors/activity - Activity updated
GET /api/visitors/stats - Stats fetched
```

## Next Steps

- Once working locally, the Vercel deployment will also have visitor tracking
- Make sure environment variables are set in Vercel dashboard
- Backend (Render) will automatically track visitors from live site

## Support

If still having issues:
1. Check backend logs (terminal where `npm start` runs)
2. Check browser console (F12)
3. Check network requests (DevTools → Network tab)
4. Check MongoDB for visitor documents
5. Verify all `.env` variables are correct
