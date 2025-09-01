# Deployment Guide

This guide will walk you through deploying your Task Management System to GitHub and Vercel.

## 🚀 Step 1: Prepare Your Project

### 1.1 Initialize Git Repository

If you haven't already initialized a git repository:

```bash
# Navigate to your project directory
cd "Task Managment System"

# Initialize git repository
git init

# Add all files to git
git add .

# Create initial commit
git commit -m "Initial commit: Task Management System"
```

### 1.2 Create Environment Files

Create the following environment files:

**Backend Environment (.env)**
```env
DATABASE_URL="postgresql://username:password@localhost:5432/task_management"
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
PORT=3001
NODE_ENV=production
```

**Frontend Environment (.env.local)**
```env
NEXTAUTH_SECRET="your-nextauth-secret-key"
NEXTAUTH_URL="http://localhost:3000"
API_URL="http://localhost:3001"
```

## 🐙 Step 2: Push to GitHub

### 2.1 Create GitHub Repository

1. Go to [GitHub](https://github.com) and sign in
2. Click the "+" icon in the top right corner
3. Select "New repository"
4. Name your repository (e.g., "task-management-system")
5. Make it public or private (your choice)
6. **Don't** initialize with README, .gitignore, or license (we already have these)
7. Click "Create repository"

### 2.2 Push Your Code

```bash
# Add the remote repository (replace with your actual repository URL)
git remote add origin https://github.com/YOUR_USERNAME/task-management-system.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## ☁️ Step 3: Deploy Backend

### 3.1 Choose a Backend Hosting Platform

For the backend, you have several options:

#### Option A: Railway (Recommended - Easy Setup)

1. Go to [Railway](https://railway.app) and sign up with GitHub
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Set the root directory to `apps/backend`
5. Add environment variables:
   - `DATABASE_URL` (Railway will provide a PostgreSQL database)
   - `JWT_SECRET` (your secret key)
   - `PORT` (Railway will set this automatically)
   - `NODE_ENV=production`

#### Option B: Render

1. Go to [Render](https://render.com) and sign up
2. Click "New" → "Web Service"
3. Connect your GitHub repository
4. Set build command: `npm install && npm run build`
5. Set start command: `npm start`
6. Set root directory to `apps/backend`
7. Add environment variables

#### Option C: Heroku

1. Install Heroku CLI
2. Create a new Heroku app
3. Add PostgreSQL addon
4. Set environment variables
5. Deploy using git push

### 3.2 Update Frontend API URL

Once your backend is deployed, update your frontend environment variables with the new API URL.

## ⚡ Step 4: Deploy Frontend to Vercel

### 4.1 Connect to Vercel

1. Go to [Vercel](https://vercel.com) and sign up with GitHub
2. Click "New Project"
3. Import your GitHub repository
4. Vercel will automatically detect it's a Next.js project

### 4.2 Configure Project Settings

1. **Framework Preset**: Next.js (should be auto-detected)
2. **Root Directory**: `apps/frontend`
3. **Build Command**: `npm run build` (default)
4. **Output Directory**: `.next` (default)
5. **Install Command**: `npm install` (default)

### 4.3 Set Environment Variables

In the Vercel project settings, add these environment variables:

```env
NEXTAUTH_SECRET="your-production-nextauth-secret"
NEXTAUTH_URL="https://your-domain.vercel.app"
API_URL="https://your-backend-url.com"
```

### 4.4 Deploy

1. Click "Deploy"
2. Vercel will build and deploy your application
3. You'll get a URL like `https://your-project.vercel.app`

## 🔧 Step 5: Configure Database

### 5.1 Set Up Production Database

1. **If using Railway**: Database is automatically created
2. **If using Render**: Add PostgreSQL service
3. **If using Heroku**: Add PostgreSQL addon

### 5.2 Run Database Migrations

```bash
# Connect to your production environment and run:
npx prisma generate
npx prisma db push
```

### 5.3 Create Admin User

```bash
# Run the admin creation script in your production environment
npm run create-admin
```

## 🔐 Step 6: Security Configuration

### 6.1 Update Environment Variables

Make sure all production environment variables are set:

**Backend:**
- `DATABASE_URL` - Your production database URL
- `JWT_SECRET` - Strong, unique secret key
- `NODE_ENV=production`

**Frontend:**
- `NEXTAUTH_SECRET` - Strong, unique secret key
- `NEXTAUTH_URL` - Your Vercel domain
- `API_URL` - Your backend API URL

### 6.2 CORS Configuration

Update your backend CORS settings to allow your Vercel domain:

```javascript
// In your backend CORS configuration
app.use(cors({
  origin: ['https://your-domain.vercel.app'],
  credentials: true
}));
```

## 🚀 Step 7: Test Your Deployment

1. Visit your Vercel URL
2. Test user registration and login
3. Test task creation and management
4. Test admin features
5. Test multilingual support

## 📊 Step 8: Monitor and Maintain

### 8.1 Set Up Monitoring

- **Vercel Analytics**: Enable in your Vercel dashboard
- **Error Tracking**: Consider adding Sentry or similar
- **Database Monitoring**: Use your hosting platform's monitoring tools

### 8.2 Continuous Deployment

- Every push to the `main` branch will automatically trigger a new deployment
- Set up branch protection rules in GitHub
- Use feature branches for development

### 8.3 Backup Strategy

- **Database**: Set up automated backups
- **Code**: GitHub provides version control
- **Environment Variables**: Keep secure backups

## 🔧 Troubleshooting

### Common Issues

1. **Build Failures**
   - Check build logs in Vercel dashboard
   - Ensure all dependencies are in package.json
   - Verify TypeScript compilation

2. **Database Connection Issues**
   - Verify DATABASE_URL is correct
   - Check if database is accessible from your backend
   - Ensure SSL is configured if required

3. **Authentication Issues**
   - Verify NEXTAUTH_SECRET is set
   - Check NEXTAUTH_URL matches your domain
   - Ensure API_URL points to your backend

4. **CORS Errors**
   - Update CORS configuration in backend
   - Verify frontend and backend URLs are correct

### Getting Help

- Check Vercel deployment logs
- Review GitHub Actions (if using)
- Check your hosting platform's logs
- Review browser console for frontend errors

## 🎉 Success!

Your Task Management System is now deployed and accessible worldwide! 

**Next Steps:**
- Set up a custom domain (optional)
- Configure SSL certificates (usually automatic)
- Set up monitoring and alerts
- Plan for scaling as your user base grows

---

For additional support, refer to the main README.md file or create an issue in your GitHub repository.
