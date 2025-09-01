# 🚀 Admin User Creation Guide

This guide explains how to create admin users in your Task Management System.

## 📋 **Prerequisites**

1. **Backend Server Running**: Make sure your backend is running on `http://localhost:4000`
2. **Database Access**: Ensure your database is accessible
3. **Existing User**: You need at least one regular user account to promote to admin

## 🔧 **Method 1: Direct Database Script (Recommended)**

This is the simplest and most reliable method.

### **Step 1: Navigate to Backend Directory**
```bash
cd apps/backend
```

### **Step 2: Run the Admin Setup Script**
```bash
node scripts/setup-admin.js
```

### **Step 3: Follow the Prompts**
```
🚀 Direct Admin Setup Script
=============================

Enter the email of the user to promote to admin: your-email@example.com

🔍 Looking for user...
✅ Found user: John Doe (your-email@example.com)
Current role: USER

Promote this user to admin? (y/n): y

🔄 Updating user role...

✅ Success!
User your-email@example.com is now an admin
```

## 🌐 **Method 2: API Endpoint**

Use the new API endpoint to promote users to admin.

### **Step 1: Make API Request**
```bash
curl -X POST http://localhost:4000/api/users/promote-admin \
  -H "Content-Type: application/json" \
  -d '{"email": "your-email@example.com"}'
```

### **Step 2: With Secret Key (Optional)**
```bash
curl -X POST http://localhost:4000/api/users/promote-admin \
  -H "Content-Type: application/json" \
  -d '{"email": "your-email@example.com", "secretKey": "admin-setup-2024"}'
```

## 🗄️ **Method 3: Direct Database Update**

### **Using Prisma Studio**
```bash
cd apps/backend
npx prisma studio
```

Then:
1. Open the `User` table
2. Find your user by email
3. Change `role` from `"USER"` to `"ADMIN"`
4. Save the changes

### **Using Prisma CLI**
```bash
cd apps/backend
npx prisma db seed
```

## 🔐 **Security Features**

### **Secret Key Protection**
- Set `ADMIN_SECRET_KEY` environment variable for additional security
- Default key: `admin-setup-2024` (change this in production!)

### **Environment Variable Setup**
```bash
# In your .env file
ADMIN_SECRET_KEY=your-super-secret-key-here
```

## 📱 **Frontend Admin Features**

Once you have admin access, you'll see:

1. **Admin Panel**: Access to `/admin` route
2. **User Management**: View, create, and delete users
3. **System Reports**: Advanced analytics and system insights
4. **Admin Sidebar**: Additional navigation options

## 🚨 **Troubleshooting**

### **Common Issues**

1. **"User not found"**
   - Make sure the user exists in the database
   - Check the email spelling

2. **"Database connection failed"**
   - Ensure your backend is running
   - Check database connection settings

3. **"Permission denied"**
   - Make sure you're running the script from the backend directory
   - Check file permissions

### **Verification**

After creating an admin, verify by:

1. **Logging in** with the admin account
2. **Checking the sidebar** for admin options
3. **Accessing** `/admin` route
4. **Viewing** user management features

## 🛡️ **Production Security**

For production environments:

1. **Change default secret key**
2. **Use environment variables**
3. **Restrict admin promotion endpoint**
4. **Enable authentication for admin operations**
5. **Log all admin actions**

## 📚 **API Reference**

### **Promote to Admin Endpoint**
```
POST /api/users/promote-admin
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "secretKey": "optional-secret-key"
}
```

**Response:**
```json
{
  "message": "User promoted to admin successfully",
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "name": "User Name",
    "role": "ADMIN",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

## 🎯 **Quick Start**

1. **Start your backend**: `cd apps/backend && npm run dev`
2. **Run admin script**: `node scripts/setup-admin.js`
3. **Enter user email** when prompted
4. **Confirm the action**
5. **Login** with the admin account
6. **Enjoy admin features!**

---

**Need help?** Check the console output for detailed error messages and ensure your backend is running properly.
