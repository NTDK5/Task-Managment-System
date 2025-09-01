#!/bin/bash

# Task Management System Deployment Script
# This script helps you deploy your project to GitHub and Vercel

set -e

echo "🚀 Task Management System Deployment Script"
echo "=========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if git is installed
if ! command -v git &> /dev/null; then
    print_error "Git is not installed. Please install Git first."
    exit 1
fi

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Please run this script from the project root directory."
    exit 1
fi

# Step 1: Initialize Git Repository
print_status "Step 1: Setting up Git repository..."

if [ ! -d ".git" ]; then
    git init
    print_success "Git repository initialized"
else
    print_status "Git repository already exists"
fi

# Add all files
git add .
print_success "All files added to git"

# Check if there are changes to commit
if git diff --cached --quiet; then
    print_warning "No changes to commit"
else
    git commit -m "Initial commit: Task Management System"
    print_success "Initial commit created"
fi

# Step 2: GitHub Repository Setup
print_status "Step 2: GitHub Repository Setup"
echo ""
echo "To continue with GitHub deployment, please:"
echo "1. Go to https://github.com and create a new repository"
echo "2. Don't initialize it with README, .gitignore, or license"
echo "3. Copy the repository URL"
echo ""

read -p "Enter your GitHub repository URL (e.g., https://github.com/username/task-management-system.git): " REPO_URL

if [ -z "$REPO_URL" ]; then
    print_error "Repository URL is required"
    exit 1
fi

# Add remote and push
git remote add origin "$REPO_URL" 2>/dev/null || git remote set-url origin "$REPO_URL"
git branch -M main
git push -u origin main

print_success "Code pushed to GitHub successfully!"

# Step 3: Environment Setup
print_status "Step 3: Environment Setup"
echo ""
echo "Before deploying to Vercel, you need to set up your environment variables."
echo ""

# Create environment template files
if [ ! -f "apps/backend/.env.example" ]; then
    cat > apps/backend/.env.example << EOF
# Backend Environment Variables
DATABASE_URL="postgresql://username:password@localhost:5432/task_management"
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
PORT=3001
NODE_ENV=production
EOF
    print_success "Created backend .env.example file"
fi

if [ ! -f "apps/frontend/.env.example" ]; then
    cat > apps/frontend/.env.example << EOF
# Frontend Environment Variables
NEXTAUTH_SECRET="your-nextauth-secret-key"
NEXTAUTH_URL="http://localhost:3000"
API_URL="http://localhost:3001"
EOF
    print_success "Created frontend .env.example file"
fi

# Step 4: Vercel Deployment Instructions
print_status "Step 4: Vercel Deployment Instructions"
echo ""
echo "🎯 Next Steps for Vercel Deployment:"
echo ""
echo "1. Go to https://vercel.com and sign up with GitHub"
echo "2. Click 'New Project'"
echo "3. Import your repository: $REPO_URL"
echo "4. Configure the project settings:"
echo "   - Framework Preset: Next.js"
echo "   - Root Directory: apps/frontend"
echo "   - Build Command: npm run build"
echo "   - Output Directory: .next"
echo "   - Install Command: npm install"
echo ""
echo "5. Add these environment variables in Vercel:"
echo "   - NEXTAUTH_SECRET (generate a strong secret)"
echo "   - NEXTAUTH_URL (your Vercel domain)"
echo "   - API_URL (your backend URL after deployment)"
echo ""
echo "6. Deploy your backend first (Railway/Render/Heroku)"
echo "7. Update API_URL in Vercel with your backend URL"
echo "8. Deploy the frontend"
echo ""

# Step 5: Backend Deployment Options
print_status "Step 5: Backend Deployment Options"
echo ""
echo "For backend deployment, you have several options:"
echo ""
echo "🚂 Railway (Recommended - Easy):"
echo "   - Go to https://railway.app"
echo "   - Connect your GitHub repository"
echo "   - Set root directory to: apps/backend"
echo "   - Add environment variables"
echo ""
echo "☁️ Render:"
echo "   - Go to https://render.com"
echo "   - Create a new Web Service"
echo "   - Connect your GitHub repository"
echo "   - Set root directory to: apps/backend"
echo ""
echo "🦊 Heroku:"
echo "   - Install Heroku CLI"
echo "   - Create a new app"
echo "   - Add PostgreSQL addon"
echo "   - Deploy using git push"
echo ""

# Step 6: Final Instructions
print_status "Step 6: Final Setup"
echo ""
echo "After deployment:"
echo "1. Set up your production database"
echo "2. Run database migrations: npx prisma db push"
echo "3. Create an admin user using the script"
echo "4. Test all features"
echo ""

print_success "Deployment script completed!"
echo ""
echo "📚 For detailed instructions, see DEPLOYMENT.md"
echo "🔗 Your GitHub repository: $REPO_URL"
echo ""
echo "Happy deploying! 🚀"
