# 🚀 Quick Reference Guide

## ⚡ 5-Minute Startup

### Terminal 1: Backend
```bash
cd backend
npm install
# Edit .env with DB credentials
npm start
```

### Terminal 2: Frontend
```bash
cd frontend
npm install
npm start
```

### Browser
```
http://localhost:3000
```

---

## 🔐 Demo Accounts
| Username | Password | Role |
|----------|----------|------|
| admin | admin123 | Full access |
| manager | manager123 | Alumni management |
| alumni1 | alumni123 | Personal access |

---

## 📝 Setup Files

### Backend .env
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=alumni_system
DB_PORT=3306
PORT=5000
NODE_ENV=development
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRY=7d
```

### Frontend .env
```env
REACT_APP_API_URL=http://localhost:5000/api
```

---

## 🗄️ Database Setup
```bash
# Create database
mysql -u root -p -e "CREATE DATABASE alumni_system;"

# Import schema
mysql -u root -p alumni_system < backend/alumni_schema.sql

# Verify
mysql -u root -p -e "USE alumni_system; SHOW TABLES;"
```

---

## 📡 Key API Endpoints

### Authentication
```
POST   /api/auth/register          # New user
POST   /api/auth/login              # Login
GET    /api/auth/profile            # Get profile
PUT    /api/auth/profile            # Update profile
POST   /api/auth/change-password    # Change password
GET    /api/auth/verify             # Verify token
```

### Admin Only
```
GET    /api/users                   # All users
POST   /api/users/:id/assign-role   # Assign role
GET    /api/roles                   # All roles
POST   /api/roles                   # Create role
```

### Alumni Management
```
GET    /api/alumni/all              # All alumni (public)
POST   /api/alumni/create           # Create (authenticated)
PUT    /api/alumni/update/:id       # Update (authenticated)
DELETE /api/alumni/delete/:id       # Delete (admin/manager)
GET    /api/alumni/:id              # Get one (public)
GET    /api/alumni/search           # Search (public)
```

---

## 🧭 Frontend Routes

```
/                    # Home (public)
/login              # Login page (public)
/register           # Register page (public)
/profile            # User profile (protected)
/admin              # Admin dashboard (admin only)
/alumni             # All alumni (public)
/alumni/:id         # Alumni detail (public)
/add-alumni         # Create alumni (protected)
/edit-alumni/:id    # Edit alumni (protected)
/search             # Search alumni (public)
```

---

## 🔍 Authentication Flow

```
1. User clicks "Register"
   ↓
2. Fill form → POST /auth/register
   ↓
3. User created with 'alumni' role
   ↓
4. Redirected to login
   ↓
5. Enter credentials → POST /auth/login
   ↓
6. JWT token returned
   ↓
7. Token stored in localStorage
   ↓
8. Redirected to home
   ↓
9. Can now access protected routes
```

---

## 🛡️ Roles & Permissions

### Admin
- Manage users
- Manage roles
- Manage alumni
- View reports

### Manager
- Manage alumni
- View alumni
- Export data

### Alumni
- View alumni
- Update profile
- View directory

### Guest
- View alumni
- View directory

---

## 📁 Important Directories

```
backend/
├── controllers/    # Business logic
├── models/        # DB models
├── routes/        # API routes
├── middleware/    # Auth middleware
└── config/        # Database config

frontend/
├── pages/         # Components
├── context/       # Auth state
├── services/      # API calls
└── styles/        # CSS files
```

---

## 🐛 Common Fixes

### Port Already in Use
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :5000
kill -9 <PID>
```

### Database Connection Error
```bash
# Verify MySQL running
mysql -u root -p -e "SELECT 1;"

# Check database exists
mysql -u root -p -e "SHOW DATABASES;"
```

### JWT Token Issues
```bash
# Clear localStorage
localStorage.clear()

# Then logout & login again
```

### Module Not Found
```bash
cd backend  # or frontend
rm -rf node_modules package-lock.json
npm install
```

---

## 🧪 Testing Checklist

- [ ] Backend running on 5000
- [ ] Frontend running on 3000
- [ ] Database connected
- [ ] Can register new user
- [ ] Can login
- [ ] Can view profile
- [ ] Can update profile
- [ ] Can change password
- [ ] Admin can view users
- [ ] Can logout
- [ ] Protected routes work
- [ ] Role checking works

---

## 📊 Database Tables

```
users
├── id
├── username (unique)
├── email (unique)
├── password_hash
├── first_name
├── last_name
└── created_at

roles
├── id
├── name (admin, manager, alumni, guest)
├── description
└── permissions (JSON)

user_roles
├── id
├── user_id → users.id
├── role_id → roles.id
├── assigned_by
└── assigned_at

alumni
├── id
├── user_id → users.id
├── created_by → users.id
├── first_name
├── last_name
├── email
├── ... other fields
└── created_at, updated_at
```

---

## 🚀 Deployment Quick Steps

### Local → Heroku
```bash
# Create Heroku app
heroku create alumni-system

# Add database
heroku addons:create cleardb:ignite

# Deploy
git push heroku main

# Open app
heroku open
```

### Local → Docker
```bash
# Build image
docker build -t alumni-system .

# Run container
docker run -p 5000:5000 alumni-system
```

---

## 💾 Backup Database

```bash
# Backup
mysqldump -u root -p alumni_system > backup.sql

# Restore
mysql -u root -p alumni_system < backup.sql
```

---

## 📚 Documentation Map

| Need | File |
|------|------|
| Full setup | SETUP_INSTRUCTIONS.md |
| Auth details | FRONTEND_AUTH.md |
| Architecture | ARCHITECTURE.md |
| Deployment | DEPLOYMENT.md |
| Status | IMPLEMENTATION_SUMMARY.md |
| Complete guide | README.md |

---

## 🔗 Useful Commands

```bash
# Start everything
npm start  # (from root - if scripts configured)

# Check node version
node -v

# Check npm version
npm -v

# Install dependencies
npm install

# Start backend with nodemon (auto-reload)
npm run dev  # (if configured in package.json)

# Database backup
mysqldump -u root -p alumni_system > backup.sql

# Database restore
mysql -u root -p alumni_system < backup.sql
```

---

## ⚙️ Environment Variables

### Backend
```
DB_HOST          # MySQL host
DB_USER          # Database user
DB_PASSWORD      # Database password
DB_NAME          # Database name
DB_PORT          # MySQL port (default: 3306)
PORT             # Backend port (default: 5000)
NODE_ENV         # Environment (development/production)
JWT_SECRET       # Secret for JWT signing
JWT_EXPIRY       # Token expiration (default: 7d)
```

### Frontend
```
REACT_APP_API_URL    # Backend API URL
```

---

## 🎯 Most Important Commands

```bash
# Database
mysql -u root -p alumni_system < backend/alumni_schema.sql

# Backend
cd backend && npm install && npm start

# Frontend
cd frontend && npm install && npm start

# Test
# Visit http://localhost:3000 and login
```

---

## 📞 Troubleshooting Quick Links

- Backend won't start → Check port 5000
- Database error → Check MySQL running
- Frontend won't load → Check port 3000
- Login fails → Check JWT_SECRET matches
- Token invalid → Clear localStorage
- Module missing → Run npm install again

---

## ✅ You're Ready!

1. ✅ Backend running
2. ✅ Frontend running
3. ✅ Database connected
4. ✅ Demo accounts available
5. ✅ Ready to test!

**Next: Visit http://localhost:3000 and click Login**

---

**For detailed help, see [INDEX.md](INDEX.md)**
