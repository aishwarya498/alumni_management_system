# Complete Setup Instructions - Alumni Management System with Authentication

This guide will walk you through setting up and running the entire Alumni Management System with role-based authentication.

## Prerequisites

- Node.js v14+ and npm
- MySQL 5.7+ or MariaDB
- Git (optional)

## Step 1: Database Setup

### 1.1 Create Database
```bash
mysql -u root -p
```

Then in MySQL prompt:
```sql
CREATE DATABASE alumni_system;
USE alumni_system;
```

### 1.2 Import Schema
```bash
mysql -u root -p alumni_system < backend/alumni_schema.sql
```

Or manually copy-paste the contents of `backend/alumni_schema.sql` into MySQL.

**Verify the setup:**
```sql
USE alumni_system;
SHOW TABLES;
-- Should show: alumni, users, roles, user_roles
```

## Step 2: Backend Setup

### 2.1 Navigate to Backend
```bash
cd backend
```

### 2.2 Install Dependencies
```bash
npm install
```

This will install:
- express (web framework)
- mysql2 (database driver)
- bcryptjs (password hashing)
- jsonwebtoken (JWT authentication)
- dotenv (environment variables)
- express-validator (validation)

### 2.3 Configure Environment Variables
Create `.env` file in `backend/` directory:

```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=alumni_system
DB_PORT=3306

# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRY=7d
```

### 2.4 Start Backend Server
```bash
npm start
```

Expected output:
```
Server running on http://localhost:5000
Database connected successfully
```

**Test Backend:**
```bash
curl http://localhost:5000/api/alumni/all
```

Should return alumni data without requiring authentication.

## Step 3: Frontend Setup

### 3.1 Navigate to Frontend
```bash
cd frontend
```

### 3.2 Install Dependencies
```bash
npm install
```

### 3.3 Configure Environment Variables
Create `.env` file in `frontend/` directory:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

### 3.4 Start Frontend Server
```bash
npm start
```

The app will automatically open at `http://localhost:3000`

## Step 4: Testing the Application

### 4.1 Try Login (Without Authentication)
1. Click "All Alumni" - should work (public endpoint)
2. Try "Add Alumni" - should redirect to login (protected endpoint)

### 4.2 Register New User
1. Click "Register" link on login page
2. Fill in form with:
   - Username: testuser
   - Email: test@example.com
   - First Name: John
   - Last Name: Doe
   - Password: password123
   - Confirm Password: password123
3. Click Register
4. Should redirect to Login page with success message

### 4.3 Login with Demo Accounts
Click the demo buttons to auto-fill credentials:

**Admin Account:**
- Click "Admin Demo" button
- Click "Login"
- Should see "Admin Dashboard" in user menu

**Manager Account:**
- Click "Manager Demo" button
- Click "Login"
- Can manage alumni profiles

**Alumni Account:**
- Click "Alumni Demo" button
- Click "Login"
- Can view and create alumni profiles

### 4.4 Test Protected Routes
1. Login with admin account
2. Click user dropdown → "Admin Dashboard"
3. Should see Users and Roles tabs
4. Click "Manage Users" tab
5. Should see list of users with their roles

## Step 5: Verify Full Authentication Flow

### 5.1 Create Alumni Profile
1. Login (use any demo account)
2. Click "Add Alumni" in navigation
3. Fill in alumni form
4. Click "Create Profile"
5. Profile created by authenticated user (tracked in database)

### 5.2 Update Profile
1. Login with any account
2. Click user dropdown → "My Profile"
3. Update your information
4. Change password if desired
5. Verify changes saved

### 5.3 Check Role-Based Access
1. Login with alumni account
2. Try to access Admin Dashboard (should show "Access Denied")
3. Logout
4. Login with admin account
5. Access Admin Dashboard (should work)

## Directory Structure

```
alumni_management_system/
├── backend/
│   ├── config/               (Database config)
│   ├── controllers/          (Business logic)
│   ├── middleware/           (Auth middleware)
│   ├── models/               (Data models)
│   ├── routes/               (API routes)
│   ├── alumni_schema.sql     (Database schema)
│   ├── package.json
│   ├── server.js
│   └── .env
├── frontend/
│   ├── public/               (Static files)
│   ├── src/
│   │   ├── components/       (React components)
│   │   ├── context/          (Auth context)
│   │   ├── pages/            (Page components)
│   │   ├── services/         (API services)
│   │   ├── styles/           (CSS files)
│   │   ├── App.js
│   │   └── index.js
│   ├── package.json
│   └── .env
└── [Documentation files]
```

## API Endpoints Summary

### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/verify` - Verify token
- `GET /api/auth/profile` - Get profile
- `PUT /api/auth/profile` - Update profile
- `POST /api/auth/change-password` - Change password

### User Management Endpoints
- `GET /api/users` - Get all users (admin/manager)
- `GET /api/users/:id` - Get user by ID (admin/manager)
- `PUT /api/users/:id` - Update user (admin)
- `DELETE /api/users/:id` - Delete user (admin)
- `POST /api/users/:id/assign-role` - Assign role (admin)
- `POST /api/users/:id/remove-role` - Remove role (admin)

### Role Management Endpoints
- `GET /api/roles` - Get all roles (admin)
- `POST /api/roles` - Create role (admin)
- `GET /api/roles/:id` - Get role by ID (admin)
- `PUT /api/roles/:id` - Update role (admin)
- `DELETE /api/roles/:id` - Delete role (admin)

### Alumni Endpoints
- `GET /api/alumni/all` - Get all alumni (public)
- `GET /api/alumni/search` - Search alumni (public)
- `GET /api/alumni/:id` - Get alumni by ID (public)
- `POST /api/alumni/create` - Create alumni (authenticated)
- `PUT /api/alumni/update/:id` - Update alumni (authenticated)
- `DELETE /api/alumni/delete/:id` - Delete alumni (admin/manager)

## Troubleshooting

### Backend Issues

**Port 5000 already in use:**
```bash
# Change PORT in .env or
# Kill process on port 5000
# Windows: netstat -ano | findstr :5000, taskkill /PID <PID> /F
# Mac/Linux: lsof -i :5000, kill -9 <PID>
```

**Database connection error:**
- Verify MySQL is running
- Check DB_HOST, DB_USER, DB_PASSWORD in .env
- Ensure alumni_system database exists
- Check database character set is utf8mb4

**"Cannot find module" errors:**
```bash
cd backend
rm -rf node_modules package-lock.json
npm install
npm start
```

### Frontend Issues

**Port 3000 already in use:**
```bash
# Windows: netstat -ano | findstr :3000
# Mac/Linux: lsof -i :3000
# Or just press 'Y' when prompted to use different port
```

**"Cannot find module" errors:**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm start
```

**API connection errors:**
- Verify REACT_APP_API_URL in .env is correct
- Ensure backend is running on port 5000
- Check browser console for CORS errors
- Verify backend has CORS enabled (should be in server.js)

### Authentication Issues

**"Invalid token" after login:**
- Verify JWT_SECRET in backend .env
- Try logging out and logging back in
- Clear browser localStorage and refresh

**Cannot access Admin Dashboard:**
- Verify user has admin role
- Use admin demo account (admin/admin123)
- Check user_roles table in database

## Running Both Servers

### Option 1: Two Terminal Windows
**Terminal 1 - Backend:**
```bash
cd backend
npm start
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

### Option 2: Single Terminal (Background)
**Windows:**
```bash
# Backend
start cmd /k "cd backend && npm start"
# Frontend
cd frontend && npm start
```

**Mac/Linux:**
```bash
# Backend
cd backend && npm start &
# Frontend
cd frontend && npm start
```

## Database Seed Data

The `alumni_schema.sql` includes:

**4 Built-in Roles:**
1. admin - Full access
2. manager - Alumni management
3. alumni - Personal access
4. guest - Read-only access

**6 Seed Users:**
1. admin (password: admin123) - Role: admin
2. manager (password: manager123) - Role: manager
3. alumni1-4 (password: alumni123) - Role: alumni

**10 Alumni Profiles:**
- Various alumni from different graduation years
- Multiple fields of study and companies

## Next Steps

1. Deploy to production (see [DEPLOYMENT.md](DEPLOYMENT.md))
2. Configure custom authentication (OAuth, LDAP, etc.)
3. Set up automated backups
4. Configure monitoring and logging
5. Customize branding and styling

## Support & Documentation

- [README.md](README.md) - Project overview
- [ARCHITECTURE.md](ARCHITECTURE.md) - System architecture
- [DEPLOYMENT.md](DEPLOYMENT.md) - Production deployment
- [FRONTEND_AUTH.md](FRONTEND_AUTH.md) - Frontend authentication details
- [CHECKLIST.md](CHECKLIST.md) - Implementation checklist

## Quick Reference

| Operation | Command |
|-----------|---------|
| Start Backend | `cd backend && npm start` |
| Start Frontend | `cd frontend && npm start` |
| Import Database | `mysql -u root -p alumni_system < backend/alumni_schema.sql` |
| View Logs | Check console output where you ran npm start |
| Reset Database | Stop backend, drop/recreate database, import schema again |
| Clear Cache | Delete .env files, reinstall dependencies |

## Security Notes

1. **Change JWT_SECRET** in production
2. **Use HTTPS** in production
3. **Set secure database password**
4. **Enable CORS** only for your domain in production
5. **Hash credentials** in environment variables or use secrets manager
6. **Regular backups** of MySQL database
7. **Update dependencies** regularly for security patches

---

**Last Updated:** 2024
**Version:** 1.0
