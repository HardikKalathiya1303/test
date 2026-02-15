# 🧪 API Testing Guide

## Step 1: Start Backend Server

Open a terminal and run:

```bash
cd E:\Tsatsaku-platform\tsatsaku-backend
npm run dev
```

You should see:
```
==================================================
🚀 Server running in development mode
📡 Port: 5000
🌐 API URL: http://localhost:5000/api
💚 Health Check: http://localhost:5000/api/health
==================================================
MongoDB Connected
```

---

## Step 2: Test API Connection

### Test 1: Health Check
Open your browser and go to:
```
http://localhost:5000/api/health
```

You should see:
```json
{
  "success": true,
  "status": "OK",
  "message": "Tsatsaku API is running",
  "timestamp": "2026-02-15T..."
}
```

### Test 2: Root Endpoint
```
http://localhost:5000
```

You should see:
```json
{
  "success": true,
  "message": "Tsatsaku API Server",
  "version": "1.0.0"
}
```

---

## Step 3: Test Registration Endpoint

### Using Browser Console (F12)

1. Open http://localhost:3000 in your browser
2. Open DevTools (F12) → Console tab
3. Run this code:

```javascript
// Test registration
fetch('http://localhost:5000/api/auth/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    firstName: 'Test',
    lastName: 'User',
    email: 'test@example.com',
    password: 'Test@12345',
    confirmPassword: 'Test@12345'
  })
})
.then(res => res.json())
.then(data => console.log('Registration Response:', data))
.catch(err => console.error('Registration Error:', err));
```

### Expected Success Response:
```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "user": { ... },
    "token": "eyJhbGci..."
  }
}
```

### Expected Error Response (if email exists):
```json
{
  "success": false,
  "message": "User with this email already exists"
}
```

---

## Step 4: Check Frontend API Connection

1. Start frontend:
```bash
cd E:\Tsatsaku-platform\tsatsaku-frontend
npm run dev
```

2. Open http://localhost:3000 in browser
3. Open DevTools (F12) → Console tab
4. You should see:
```
API URL: http://localhost:5000/api
```

5. Try to register - watch the console for:
```
API Request: POST /auth/register
API Response: 201 /auth/register
```

---

## Common Issues & Solutions

### ❌ Issue: "Cannot connect to server"
**Solution:** Backend is not running
```bash
cd E:\Tsatsaku-platform\tsatsaku-backend
npm run dev
```

### ❌ Issue: "ECONNREFUSED"
**Solution:** Wrong port or backend not started
- Check backend is on port 5000
- Check `.env` has `PORT=5000`

### ❌ Issue: "CORS Error"
**Solution:** Already fixed - CORS is set to allow all origins

### ❌ Issue: "MongoDB connection failed"
**Solution:** Start MongoDB
```bash
mongod
```

Or check MongoDB connection string in backend `.env`:
```env
MONGODB_URI=mongodb://localhost:27017/tsatsaku
```

### ❌ Issue: Empty error object `{}`
**Solution:** This means the error wasn't properly caught. Check:
1. Backend is running
2. API URL is correct
3. Network tab in DevTools for actual error

---

## Debug Checklist

- [ ] MongoDB is running
- [ ] Backend server is running on port 5000
- [ ] Frontend server is running on port 3000
- [ ] Browser console shows "API URL: http://localhost:5000/api"
- [ ] http://localhost:5000/api/health returns success
- [ ] No CORS errors in browser console
- [ ] Network tab shows 200/201 status codes

---

## Testing Registration Flow

1. **Clear Browser Data:**
```javascript
// In browser console
localStorage.clear();
```

2. **Go to Registration Page:**
```
http://localhost:3000/register
```

3. **Fill the Form:**
- First Name: Test
- Last Name: User
- Email: test123@example.com (use unique email)
- Password: Test@12345
- Confirm Password: Test@12345

4. **Watch Console:**
Before clicking submit, open DevTools Console (F12)

5. **Submit Form**

6. **Expected Console Output:**
```
API Request: POST /auth/register
API Response: 201 /auth/register
```

7. **Expected Result:**
- Redirected to `/dashboard`
- No error messages

---

## Quick Test Script

Save this as `test-api.js` and run with Node.js:

```javascript
const axios = require('axios');

async function testAPI() {
  try {
    // Test 1: Health check
    console.log('Testing health endpoint...');
    const health = await axios.get('http://localhost:5000/api/health');
    console.log('✅ Health check passed:', health.data);

    // Test 2: Register
    console.log('\nTesting registration...');
    const register = await axios.post('http://localhost:5000/api/auth/register', {
      firstName: 'Test',
      lastName: 'User',
      email: `test${Date.now()}@example.com`,
      password: 'Test@12345',
      confirmPassword: 'Test@12345'
    });
    console.log('✅ Registration passed:', register.data);

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

testAPI();
```

Run with:
```bash
node test-api.js
```
