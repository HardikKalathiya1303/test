# 🚀 Quick Start Guide - Tsatsaku Platform

## Prerequisites
- Node.js (v18 or higher)
- MongoDB (Running locally or connection string)
- npm or yarn package manager

---

## Step 1: Start MongoDB
Make sure MongoDB is running on your system:
```bash
# If using MongoDB Community Edition
mongod
```

Or ensure your MongoDB connection string in backend `.env` is correct.

---

## Step 2: Start Backend Server

### Navigate to backend folder:
```bash
cd E:\Tsatsaku-platform\tsatsaku-backend
```

### Install dependencies (first time only):
```bash
npm install
```

### Seed database with sample data (first time only):
```bash
npm run seed
```

### Start the server:
```bash
npm run dev
```

✅ **Backend should now be running on:** `http://localhost:5000`

You should see:
```
Server running in development mode on port 5000
MongoDB Connected
```

---

## Step 3: Start Frontend Application

### Open a NEW terminal and navigate to frontend folder:
```bash
cd E:\Tsatsaku-platform\tsatsaku-frontend
```

### Install dependencies (first time only):
```bash
npm install
```

### Start the development server:
```bash
npm run dev
```

✅ **Frontend should now be running on:** `http://localhost:3000`

---

## Step 4: Access the Application

Open your browser and go to:
```
http://localhost:3000
```

You'll be redirected to the **Login Page**.

---

## 📝 Test the Application

### Register a New User:
1. Click "Sign up" link on login page
2. Fill in the registration form:
   - First Name
   - Last Name
   - Email
   - Password (at least 8 characters)
   - Confirm Password
3. Click "Create Account"
4. You'll be automatically logged in and redirected to the dashboard

### Login with Existing User:
1. Use the credentials you just registered
2. Or use the default admin created by seed script:
   - Email: `admin@tsatsaku.com`
   - Password: `Admin@123`

---

## 🛠️ Troubleshooting

### ⚠️ "Network error. Please try again." or "Cannot connect to server"

**This means the backend server is NOT running!**

**Solution:**
1. Open a NEW terminal
2. Run:
   ```bash
   cd E:\Tsatsaku-platform\tsatsaku-backend
   npm run dev
   ```
3. Wait for:
   ```
   🚀 Server running in development mode
   📡 Port: 5000
   MongoDB Connected
   ```
4. **Then** try registration again

### ✅ Verify Backend is Running

Open browser and go to: **http://localhost:5000/api/health**

You should see:
```json
{
  "success": true,
  "status": "OK",
  "message": "Tsatsaku API is running"
}
```

If you get "This site can't be reached" → Backend is NOT running!

### Backend not connecting to MongoDB:
- Check if MongoDB is running: `mongod`
- Verify connection string in `tsatsaku-backend/.env`
- Default: `mongodb://localhost:27017/tsatsaku`

### Frontend can't connect to backend:
- Ensure backend is running on port 5000
- Check browser console (F12) for "API URL: http://localhost:5000/api"
- Check `tsatsaku-frontend/.env.local`:
  ```env
  NEXT_PUBLIC_API_URL=http://localhost:5000/api
  ```

### Registration/Login not working:
1. **FIRST**: Make sure backend is running (check http://localhost:5000/api/health)
2. Open browser console (F12) to see errors
3. Check backend terminal for error messages
4. Verify JWT_SECRET is set in backend `.env`
5. Clear browser localStorage:
   ```javascript
   // In browser console:
   localStorage.clear()
   ```

### See detailed error messages:
- Open browser DevTools (F12)
- Go to Console tab
- Look for "API Request:" and "API Error:" messages
- Check Network tab for failed requests

### Port already in use:
If port 5000 or 3000 is already in use:

**Backend:**
- Change PORT in `tsatsaku-backend/.env`
- Update NEXT_PUBLIC_API_URL in `tsatsaku-frontend/.env.local`

**Frontend:**
```bash
npm run dev -- -p 3001
```

---

## 📂 Project Structure

```
E:\Tsatsaku-platform\
├── tsatsaku-backend/          # Node.js/Express API
│   ├── src/
│   │   ├── controllers/       # Request handlers
│   │   ├── models/            # MongoDB schemas
│   │   ├── routes/            # API routes
│   │   ├── middleware/        # Auth, validation, etc.
│   │   ├── services/          # Business logic
│   │   └── app.js             # Express app entry
│   ├── .env                   # Environment variables
│   └── package.json
│
└── tsatsaku-frontend/         # Next.js Application
    ├── src/
    │   ├── app/               # Next.js pages
    │   ├── components/        # Reusable components
    │   ├── context/           # React context (Auth)
    │   ├── services/          # API calls
    │   └── lib/               # Utilities
    ├── .env.local             # Environment variables
    └── package.json
```

---

## 🎯 Default Credentials (After Seeding)

**Admin User:**
- Email: `admin@tsatsaku.com`
- Password: `Admin@123`
- Role: admin

---

## 📖 Next Steps

1. ✅ Register a new buyer account
2. ✅ Explore the dashboard
3. ✅ View purchase orders (if any)
4. ✅ Update your profile

For detailed development plan, see `PROJECT_DEVELOPMENT_PLAN.md`
