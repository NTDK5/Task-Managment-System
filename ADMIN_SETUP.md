# Admin User Setup Guide

This guide explains how to create admin users for your Task Management System after deployment.

## 🚀 Prerequisites

Before creating an admin user, ensure:
- ✅ Your backend is deployed and running
- ✅ Your database is set up and accessible
- ✅ You have at least one regular user account created

## 📋 Method 1: Direct Database Setup (Recommended)

### Step 1: Access Your Backend Environment

**If using Railway:**
1. Go to your [Railway Dashboard](https://railway.app/dashboard)
2. Click on your backend service
3. Go to **Settings** → **Variables**
4. Copy your `DATABASE_URL`

**If using Render:**
1. Go to your [Render Dashboard](https://dashboard.render.com)
2. Click on your backend service
3. Go to **Environment** tab
4. Copy your `DATABASE_URL`

**If using Heroku:**
1. Go to your [Heroku Dashboard](https://dashboard.heroku.com)
2. Click on your app
3. Go to **Settings** → **Config Vars**
4. Copy your `DATABASE_URL`

### Step 2: Run the Admin Setup Script

#### Option A: Using Railway CLI
```bash
# Install Railway CLI if you haven't
npm install -g @railway/cli

# Login to Railway
railway login

# Connect to your project
railway link

# Run the admin setup script
railway run node scripts/setup-admin.js
```

#### Option B: Using Render Shell
1. Go to your Render dashboard
2. Click on your backend service
3. Go to **Shell** tab
4. Run:
```bash
cd apps/backend
node scripts/setup-admin.js
```

#### Option C: Using Heroku CLI
```bash
# Install Heroku CLI if you haven't
# Download from: https://devcenter.heroku.com/articles/heroku-cli

# Login to Heroku
heroku login

# Connect to your app
heroku git:remote -a your-app-name

# Run the admin setup script
heroku run node scripts/setup-admin.js
```

### Step 3: Follow the Prompts

The script will ask you for:
1. **Email address** of the user to promote to admin
2. **Confirmation** to proceed with the promotion

Example:
```
🚀 Direct Admin Setup Script
=============================

Enter the email of the user to promote to admin: admin@example.com

🔍 Looking for user...
✅ Found user: John Doe (admin@example.com)
Current role: USER

Promote this user to admin? (y/n): y

🔄 Updating user role...

✅ Success!
User admin@example.com is now an admin
```

## 🔧 Method 2: API Endpoint (Alternative)

If you have access to your backend API, you can use the admin promotion endpoint:

### Step 1: Create a Regular User
First, register a regular user through your frontend application.

### Step 2: Use the API Endpoint
```bash
curl -X POST https://your-backend-url.com/api/users/promote-admin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com"
  }'
```

## 🌐 Method 3: Database Direct Access

### Step 1: Connect to Your Database

**PostgreSQL (Railway/Render/Heroku):**
```bash
# Get connection string from your hosting platform
psql "your-database-connection-string"

# Or use a GUI tool like pgAdmin, DBeaver, or TablePlus
```

### Step 2: Update User Role
```sql
-- Find the user
SELECT id, email, name, role FROM "User" WHERE email = 'admin@example.com';

-- Update the user to admin
UPDATE "User" 
SET role = 'ADMIN', "updatedAt" = NOW() 
WHERE email = 'admin@example.com';

-- Verify the change
SELECT id, email, name, role FROM "User" WHERE email = 'admin@example.com';
```

## 🔍 Method 4: Using Prisma Studio

### Step 1: Connect to Your Database
```bash
# Set your DATABASE_URL environment variable
export DATABASE_URL="your-database-connection-string"

# Or create a .env file with your DATABASE_URL
echo "DATABASE_URL=your-database-connection-string" > .env
```

### Step 2: Open Prisma Studio
```bash
# Navigate to backend directory
cd apps/backend

# Generate Prisma client
npx prisma generate

# Open Prisma Studio
npx prisma studio
```

### Step 3: Update User in GUI
1. Prisma Studio will open in your browser
2. Click on the **User** table
3. Find your user by email
4. Click **Edit**
5. Change **role** from `USER` to `ADMIN`
6. Click **Save**

## 🛡️ Security Considerations

### Best Practices:
1. **Use strong passwords** for admin accounts
2. **Limit admin access** to trusted users only
3. **Regularly audit** admin permissions
4. **Use environment variables** for sensitive data
5. **Enable 2FA** if available

### Admin Capabilities:
- ✅ Create and manage all users
- ✅ View all tasks across the system
- ✅ Delete any task or user
- ✅ Access admin dashboard
- ✅ Generate system reports

## 🔧 Troubleshooting

### Common Issues:

#### 1. "User not found" Error
**Solution:** Make sure the user exists in the database
```sql
SELECT * FROM "User" WHERE email = 'admin@example.com';
```

#### 2. "Database connection failed" Error
**Solution:** Verify your DATABASE_URL is correct
```bash
# Test connection
psql "your-database-connection-string"
```

#### 3. "Permission denied" Error
**Solution:** Check if your database user has UPDATE permissions
```sql
-- Grant permissions if needed
GRANT UPDATE ON "User" TO your_database_user;
```

#### 4. "Script not found" Error
**Solution:** Make sure you're in the correct directory
```bash
# Navigate to backend directory
cd apps/backend

# List available scripts
ls scripts/
```

## 📞 Getting Help

If you encounter issues:

1. **Check your hosting platform logs** for error messages
2. **Verify your database connection** is working
3. **Ensure your backend is running** and accessible
4. **Check the script output** for specific error messages

## 🎉 Success Verification

After creating an admin user:

1. **Login to your application** with the admin account
2. **Check for admin features** like user management
3. **Verify admin dashboard** is accessible
4. **Test admin capabilities** like creating users

---

**Note:** Keep your admin credentials secure and consider implementing additional security measures like IP whitelisting for admin access.
