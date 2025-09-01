# Task Management System

A full-stack task management system built with Next.js, Express.js, Prisma, and PostgreSQL. Features include authentication, role-based access control (RBAC), multilingual support, and comprehensive reporting.

## 🚀 Features

- **Authentication & Authorization**: Secure login/register with JWT tokens and role-based access control
- **Task Management**: Create, update, delete, and track task progress
- **User Management**: Admin panel for user management and role assignment
- **Multilingual Support**: Internationalization (i18n) with support for English, Amharic, and Oromo
- **Real-time Dashboard**: Interactive charts and statistics
- **Responsive Design**: Modern UI with dark/light theme support
- **Reporting**: Comprehensive task and user analytics

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **NextAuth.js** - Authentication
- **Zustand** - State management
- **Recharts** - Data visualization
- **i18next** - Internationalization

### Backend
- **Express.js** - Node.js web framework
- **Prisma** - Database ORM
- **PostgreSQL** - Database
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing

## 📁 Project Structure

```
task-management-system/
├── apps/
│   ├── frontend/          # Next.js frontend application
│   │   ├── src/
│   │   │   ├── app/       # App Router pages
│   │   │   ├── components/ # React components
│   │   │   ├── contexts/   # React contexts
│   │   │   ├── store/      # Zustand stores
│   │   │   └── utils/      # Utility functions
│   │   └── public/         # Static assets
│   └── backend/           # Express.js backend API
│       ├── src/
│       │   ├── controllers/ # Route controllers
│       │   ├── middleware/  # Express middleware
│       │   ├── routes/      # API routes
│       │   └── utils/       # Utility functions
│       └── prisma/         # Database schema and migrations
├── scripts/               # Setup and utility scripts
└── docs/                  # Documentation
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd task-management-system
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```

3. **Set up environment variables**
   
   Create `.env` files in both frontend and backend directories:
   
   **Backend (.env)**
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/task_management"
   JWT_SECRET="your-jwt-secret"
   PORT=3001
   ```
   
   **Frontend (.env.local)**
   ```env
   NEXTAUTH_SECRET="your-nextauth-secret"
   NEXTAUTH_URL="http://localhost:3000"
   API_URL="http://localhost:3001"
   ```

4. **Set up the database**
   ```bash
   npm run db:generate
   npm run db:push
   ```

5. **Create admin user**
   ```bash
   npm run create-admin
   ```

6. **Start development servers**
   ```bash
   npm run dev
   ```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

## 📚 Available Scripts

- `npm run dev` - Start both frontend and backend in development mode
- `npm run build` - Build both frontend and backend for production
- `npm run start` - Start both frontend and backend in production mode
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push database schema changes
- `npm run db:studio` - Open Prisma Studio for database management
- `npm run create-admin` - Create an admin user

## 🌐 Deployment

### Vercel Deployment

This project is configured for easy deployment on Vercel:

1. **Connect to Vercel**
   - Push your code to GitHub
   - Connect your repository to Vercel
   - Configure environment variables in Vercel dashboard

2. **Environment Variables for Vercel**
   ```env
   DATABASE_URL="your-production-database-url"
   JWT_SECRET="your-production-jwt-secret"
   NEXTAUTH_SECRET="your-production-nextauth-secret"
   NEXTAUTH_URL="https://your-domain.vercel.app"
   API_URL="https://your-backend-url.com"
   ```

3. **Deploy**
   - Vercel will automatically detect the Next.js project
   - Build and deploy will happen automatically on each push

### Backend Deployment

For the backend, you can deploy to:
- **Railway** - Easy PostgreSQL + Node.js deployment
- **Render** - Free tier available
- **Heroku** - Traditional choice
- **DigitalOcean App Platform** - Scalable solution

## 🔐 Authentication

The system uses NextAuth.js for authentication with JWT tokens. Users can:
- Register new accounts
- Login with email/password
- Access role-based features
- Maintain session state

## 👥 User Roles

- **Admin**: Full access to all features including user management
- **User**: Standard access to task management and personal features

## 🌍 Internationalization

The application supports multiple languages:
- English (en)
- Amharic (am)
- Oromo (om)

Language switching is available in the UI and persists across sessions.

## 📊 Reporting Features

- Task completion rates
- Monthly trends
- User performance analytics
- Status distribution charts
- Interactive dashboards

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:
1. Check the documentation
2. Search existing issues
3. Create a new issue with detailed information

---

Built with ❤️ using modern web technologies
