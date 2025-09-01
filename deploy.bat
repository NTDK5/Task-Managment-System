@echo off
setlocal enabledelayedexpansion

echo 🚀 Task Management System Deployment Script
echo ==========================================

REM Check if git is installed
git --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Git is not installed. Please install Git first.
    pause
    exit /b 1
)

REM Check if we're in the right directory
if not exist "package.json" (
    echo [ERROR] package.json not found. Please run this script from the project root directory.
    pause
    exit /b 1
)

echo [INFO] Step 1: Setting up Git repository...

REM Initialize git repository if it doesn't exist
if not exist ".git" (
    git init
    echo [SUCCESS] Git repository initialized
) else (
    echo [INFO] Git repository already exists
)

REM Add all files
git add .
echo [SUCCESS] All files added to git

REM Check if there are changes to commit
git diff --cached --quiet
if errorlevel 1 (
    git commit -m "Initial commit: Task Management System"
    echo [SUCCESS] Initial commit created
) else (
    echo [WARNING] No changes to commit
)

echo.
echo [INFO] Step 2: GitHub Repository Setup
echo.
echo To continue with GitHub deployment, please:
echo 1. Go to https://github.com and create a new repository
echo 2. Don't initialize it with README, .gitignore, or license
echo 3. Copy the repository URL
echo.

set /p REPO_URL="Enter your GitHub repository URL (e.g., https://github.com/username/task-management-system.git): "

if "%REPO_URL%"=="" (
    echo [ERROR] Repository URL is required
    pause
    exit /b 1
)

REM Add remote and push
git remote add origin "%REPO_URL%" 2>nul || git remote set-url origin "%REPO_URL%"
git branch -M main
git push -u origin main

echo [SUCCESS] Code pushed to GitHub successfully!

echo.
echo [INFO] Step 3: Environment Setup
echo.
echo Before deploying to Vercel, you need to set up your environment variables.
echo.

REM Create environment template files
if not exist "apps\backend\.env.example" (
    (
        echo # Backend Environment Variables
        echo DATABASE_URL="postgresql://username:password@localhost:5432/task_management"
        echo JWT_SECRET="your-super-secret-jwt-key-change-in-production"
        echo PORT=3001
        echo NODE_ENV=production
    ) > apps\backend\.env.example
    echo [SUCCESS] Created backend .env.example file
)

if not exist "apps\frontend\.env.example" (
    (
        echo # Frontend Environment Variables
        echo NEXTAUTH_SECRET="your-nextauth-secret-key"
        echo NEXTAUTH_URL="http://localhost:3000"
        echo API_URL="http://localhost:3001"
    ) > apps\frontend\.env.example
    echo [SUCCESS] Created frontend .env.example file
)

echo.
echo [INFO] Step 4: Vercel Deployment Instructions
echo.
echo 🎯 Next Steps for Vercel Deployment:
echo.
echo 1. Go to https://vercel.com and sign up with GitHub
echo 2. Click 'New Project'
echo 3. Import your repository: %REPO_URL%
echo 4. Configure the project settings:
echo    - Framework Preset: Next.js
echo    - Root Directory: apps/frontend
echo    - Build Command: npm run build
echo    - Output Directory: .next
echo    - Install Command: npm install
echo.
echo 5. Add these environment variables in Vercel:
echo    - NEXTAUTH_SECRET (generate a strong secret)
echo    - NEXTAUTH_URL (your Vercel domain)
echo    - API_URL (your backend URL after deployment)
echo.
echo 6. Deploy your backend first (Railway/Render/Heroku)
echo 7. Update API_URL in Vercel with your backend URL
echo 8. Deploy the frontend
echo.

echo.
echo [INFO] Step 5: Backend Deployment Options
echo.
echo For backend deployment, you have several options:
echo.
echo 🚂 Railway (Recommended - Easy):
echo    - Go to https://railway.app
echo    - Connect your GitHub repository
echo    - Set root directory to: apps/backend
echo    - Add environment variables
echo.
echo ☁️ Render:
echo    - Go to https://render.com
echo    - Create a new Web Service
echo    - Connect your GitHub repository
echo    - Set root directory to: apps/backend
echo.
echo 🦊 Heroku:
echo    - Install Heroku CLI
echo    - Create a new app
echo    - Add PostgreSQL addon
echo    - Deploy using git push
echo.

echo.
echo [INFO] Step 6: Final Setup
echo.
echo After deployment:
echo 1. Set up your production database
echo 2. Run database migrations: npx prisma db push
echo 3. Create an admin user using the script
echo 4. Test all features
echo.

echo.
echo [SUCCESS] Deployment script completed!
echo.
echo 📚 For detailed instructions, see DEPLOYMENT.md
echo 🔗 Your GitHub repository: %REPO_URL%
echo.
echo Happy deploying! 🚀
echo.
pause
