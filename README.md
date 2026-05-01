# Alumni Management System - Full Stack Application

A comprehensive full-stack web application for managing alumni profiles built with React.js, Node.js/Express, and MySQL. This portal enables users to create, view, update, delete, and search alumni profiles with **role-based access control and JWT authentication**.

## 🎯 Features

- **🔐 JWT Authentication**: Secure JWT-based user authentication with role-based access control
- **👥 User Management**: Complete user lifecycle management with role assignment
- **🔑 Role-Based Access Control**: Four predefined roles (Admin, Manager, Alumni, Guest) with specific permissions
- **User-Friendly Interface**: Modern, responsive UI with Bootstrap styling and purple gradient theme
- **CRUD Operations**: Create, Read, Update, Delete alumni profiles with role-based protection
- **Search Functionality**: Search alumni by name, email, company, and other details
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **RESTful API**: Well-structured REST API endpoints with authentication
- **Database Connection Pooling**: Optimized MySQL connections for better performance
- **Form Validation**: Client-side and server-side validation with real-time feedback
- **Statistics Dashboard**: View alumni statistics with role-based access
- **User Profile Management**: Users can update their profile and change passwords
- **Admin Dashboard**: Manage users, roles, and permissions
- **Uniform Color Scheme**: Consistent purple gradient theme throughout the application

## 📋 Project Structures
## 📋 Project Structures


```
alumni_management_system/
├── backend/
│   ├── config/
│   │   └── database.js           # MySQL connection pool configuration
│   ├── controllers/
│   │   ├── alumniController.js   # Alumni business logic
│   │   ├── authController.js     # Authentication logic
│   │   ├── userController.js     # User management logic
│   │   └── roleController.js     # Role management logic
│   ├── middleware/
│   │   ├── auth.js               # JWT verification and role checking
│   │   └── validation.js         # Request validation middleware
│   ├── models/
│   │   ├── Alumni.js             # Alumni database model
│   │   ├── User.js               # User authentication model
│   │   └── Role.js               # Role permissions model
│   ├── routes/
│   │   ├── alumniRoutes.js       # Alumni endpoints
│   │   ├── authRoutes.js         # Authentication endpoints
│   │   ├── userRoutes.js         # User management endpoints
│   │   └── roleRoutes.js         # Role management endpoints
│   ├── alumni_schema.sql         # MySQL database schema with auth tables
│   ├── server.js                 # Express server setup
│   ├── package.json              # Backend dependencies
│   └── .env                      # Environment variables
│
└── frontend/
    ├── public/
    │   └── index.html            # HTML entry point
    ├── src/
    │   ├── components/
    │   │   ├── Header.js         # Navigation with user dropdown
    │   │   ├── Footer.js         # Footer component
    │   │   └── ProtectedRoute.js # Role-based route protection
    │   ├── context/
    │   │   └── AuthContext.js    # Authentication state management
    │   ├── pages/
    │   │   ├── Home.js           # Home page with statistics
    │   │   ├── Login.js          # User login page
    │   │   ├── Register.js       # User registration page
    │   │   ├── Profile.js        # User profile management
    │   │   ├── AdminDashboard.js # Admin control panel
    │   │   ├── AlumniList.js     # All alumni list view
    │   │   ├── AlumniForm.js     # Add/Edit alumni form
    │   │   ├── AlumniDetails.js  # Individual alumni details
    │   │   └── SearchPage.js     # Search alumni page
    │   ├── services/
    │   │   └── alumniService.js  # Axios API integration with auth headers
    │   ├── styles/
    │   │   ├── Header.css        # Header styles
    │   │   ├── Footer.css        # Footer styles
    │   │   ├── Auth.css          # Login/Register styles
    │   │   ├── Profile.css       # Profile page styles
    │   │   ├── Dashboard.css     # Admin dashboard styles
    │   │   ├── Home.css          # Home page styles
    │   │   ├── AlumniList.css    # Alumni list styles
    │   │   ├── AlumniForm.css    # Form styles
    │   │   └── SearchPage.css    # Search page styles
    │   ├── App.js                # Main app component with routing
    │   ├── App.css               # Global styles
    │   └── index.js              # React entry point
    ├── package.json              # Frontend dependencies
    └── .env                      # Environment variables
```

## 🛠️ Tech Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MySQL** - Relational database
- **jsonwebtoken (JWT)** - Authentication tokens
- **bcryptjs** - Password hashing
- **express-validator** - Form validation
- **mysql2/promise** - MySQL connection pool
- **CORS** - Cross-origin resource sharing

### Frontend
- **React.js** - UI library
- **React Router** - Client-side routing
- **React Bootstrap** - Bootstrap components for React
- **Axios** - HTTP client with interceptors
- **Context API** - State management for authentication

### Database
- **MySQL** - Database management system
- **Connection Pooling** - For optimized database connections

## 🚀 Quick Start Guide

For detailed setup instructions, see [SETUP_INSTRUCTIONS.md](SETUP_INSTRUCTIONS.md)

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)
- MySQL Server (v5.7 or higher)

### 5-Minute Setup

**1. Database Setup**
Ensure MySQL is running and you have created an user/database. You can import the schema directly:
```bash
mysql -u root -p alumni_system < backend/alumni_schema.sql
```

Make sure to set your connection details in `backend/.env` (copy from `.env.example`).


**2. Backend Setup**
```bash
cd backend
npm install
# Copy the example environment file and provide your own
# (see backend/.env.example for guidance)
copy .env.example .env   # Windows
# or: cp .env.example .env  # macOS/Linux
# then edit .env to match your MySQL credentials
npm start
```

**3. Frontend Setup** (in another terminal)
```bash
cd frontend
npm install
npm start
```

**4. Login to Application**
- Visit `http://localhost:3000`
- Click "Login Demo" button for demo credentials
- Start exploring!

## 🔐 Authentication & Roles

### Available Roles

1. **Admin** (Username: admin, Password: admin123)
   - Full system access
   - Manage users and roles
   - View all alumni
   - Permissions: manage_users, manage_roles, manage_alumni, view_reports

2. **Manager** (Username: manager, Password: manager123)
   - Alumni management
   - View alumni profiles
   - Manage alumni entries
   - Permissions: manage_alumni, view_alumni, export_data

3. **Alumni** (Username: alumni1, Password: alumni123)
   - Personal profile access
   - View alumni directory
   - Limited alumni management
   - Permissions: view_alumni, update_profile, view_directory

4. **Guest** (Read-only access)
   - View alumni directory
   - No modifications allowed
   - Permissions: view_alumni, view_directory

### Authentication Flow

```
User Registration → Email/Username Validation → Password Hashing → User Created (Alumni Role)
                                                                           ↓
User Login → Credentials Validation → JWT Token Generated → Token Stored in localStorage
                                                                           ↓
Protected Route Access → Token Verification → Role Check → Access Granted/Denied
```

## 📡 API Endpoints

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| GET | `/api/auth/verify` | Verify token | Yes |
| GET | `/api/auth/profile` | Get user profile | Yes |
| PUT | `/api/auth/profile` | Update profile | Yes |
| POST | `/api/auth/change-password` | Change password | Yes |

### User Management Endpoints (Admin/Manager)

> **Note:** The `/api/roles` GET endpoint is intentionally public so the frontend registration
> page can fetch available roles without requiring authentication. Other role-management
> routes remain protected and require an admin token.


| Method | Endpoint | Description | Role Required |
|--------|----------|-------------|---|
| GET | `/api/users` | Get all users | Admin/Manager |
| GET | `/api/users/:id` | Get user by ID | Admin/Manager |
| PUT | `/api/users/:id` | Update user | Admin |
| DELETE | `/api/users/:id` | Delete user | Admin |
| POST | `/api/users/:id/assign-role` | Assign role | Admin |
| POST | `/api/users/:id/remove-role` | Remove role | Admin |

### Role Management Endpoints (Admin Only)

| Method | Endpoint | Description | Role Required |
|--------|----------|-------------|---|
| GET | `/api/roles` | Get all roles | Admin |
| POST | `/api/roles` | Create role | Admin |
| GET | `/api/roles/:id` | Get role by ID | Admin |
| PUT | `/api/roles/:id` | Update role | Admin |
| DELETE | `/api/roles/:id` | Delete role | Admin |

### Alumni Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---|
| POST | `/api/alumni/create` | Create alumni profile | Yes (Admin/Manager/Alumni) |
| GET | `/api/alumni/all` | Get all alumni | No |
| GET | `/api/alumni/:id` | Get alumni by ID | No |
| GET | `/api/alumni/search` | Search alumni | No |
| PUT | `/api/alumni/update/:id` | Update alumni | Yes (Admin/Manager/Alumni) |
| DELETE | `/api/alumni/delete/:id` | Delete alumni | Yes (Admin/Manager) |
| GET | `/api/alumni/statistics` | Get statistics | No |

## 🗄️ Database Schema

### Users Table
- `id` - Primary key
- `username` - Unique username
- `email` - Unique email
- `password_hash` - Bcryptjs hashed password
- `first_name` - User's first name
- `last_name` - User's last name
- `created_at` - Account creation timestamp

### Roles Table
- `id` - Primary key
- `name` - Role name (admin, manager, alumni, guest)
- `description` - Role description
- `permissions` - JSON array of permissions
- `created_at` - Role creation timestamp

### User_Roles Table
- `id` - Primary key
- `user_id` - Foreign key to users table
- `role_id` - Foreign key to roles table
- `assigned_by` - User who assigned the role
- `assigned_at` - Assignment timestamp

### Alumni Table
- `id` - Primary key
- `user_id` - Foreign key to users (who last modified)
- `created_by` - User ID who created
- Fields: first_name, last_name, email, phone, graduation_year, degree, field_of_study, current_company, current_position, city, country
- `created_at` - Profile creation timestamp
- `updated_at` - Last update timestamp

## 🎨 UI/UX Features

- **Color Scheme**: Purple gradient (#667eea to #764ba2) with gold accents
- **Responsive Components**: Works on all device sizes
- **Bootstrap Integration**: Professional UI with Bootstrap components
- **Form Validations**: Client-side and server-side validation with error messages
- **Loading States**: Spinners and loading indicators
- **Confirmation Dialogs**: Delete confirmation modals
- **Error Handling**: User-friendly error messages
- **User Dropdown Menu**: Quick access to profile, admin panel, and logout
- **Role-Based UI**: Dynamic menu items based on user roles
- **Bio Auth Demo**: Quick demo account buttons for testing

## 🔐 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Bcryptjs with 10-round salt
- **Role-Based Access Control**: Fine-grained permission checking
- **CORS Protection**: Cross-origin security
- **Token Expiration**: 7-day token validity
- **User Protection**: Cannot delete sole admin account
- **Role Protection**: Cannot delete/modify system roles
- **Input Validation**: Both client and server-side

## 📖 Documentation

- [SETUP_INSTRUCTIONS.md](SETUP_INSTRUCTIONS.md) - Complete setup guide
- [FRONTEND_AUTH.md](FRONTEND_AUTH.md) - Frontend authentication details
- [ARCHITECTURE.md](ARCHITECTURE.md) - System architecture
- [DEPLOYMENT.md](DEPLOYMENT.md) - Production deployment
- [QUICKSTART.md](QUICKSTART.md) - Quick reference
- [CHECKLIST.md](CHECKLIST.md) - Feature checklist

## 🧪 Testing

### Test Accounts (Pre-loaded in database)
- **Admin**: admin / admin123
- **Manager**: manager / manager123
- **Alumni**: alumni1 / alumni123

### Test Features
1. Login with different roles
2. Access role-specific features
3. Manage alumni profiles
4. Update profile information
5. Change password
6. Admin user/role management

## 📊 Default Seed Data

The database includes:
- **4 System Roles** with predefined permissions
- **6 User Accounts** (1 admin, 1 manager, 4 alumni)
- **10 Alumni Profiles** for testing

## 🐛 Troubleshooting

See [SETUP_INSTRUCTIONS.md](SETUP_INSTRUCTIONS.md#troubleshooting) for detailed troubleshooting guide.

### Common Issues

**Authentication Failing**
- Verify JWT_SECRET in backend .env
- Check token expiration (7 days)
- Try logging out and logging back in
- Clear browser localStorage

**Access Denied to Admin Dashboard**
- Verify user has admin role
- Use admin demo account
- Check user_roles table

**API Connection Errors**
- Ensure backend is running on port 5000
- Check REACT_APP_API_URL in frontend .env
- Verify CORS is enabled in backend

## 🔄 Future Enhancements

- Token refresh mechanism
- Remember me functionality
- Two-factor authentication
- Social login integration
- Email verification on registration
- Advanced analytics dashboard
- Automated backups
- Audit logging
- File uploads for profiles

## 📝 Usage Guide

1. **Register/Login**: Create account or use demo credentials
2. **View Alumni**: Browse all alumni profiles
3. **Add Alumni**: Fill form and create new alumni profile
4. **Search Alumni**: Find specific alumni by name/company/email
5. **Update Profile**: Edit your personal information
6. **Admin Functions**: Manage users, assign roles (admin only)
7. **Change Password**: Update your password anytime

## 📄 License

This project is open source and available under the MIT License.

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For support, please email alumni@university.edu or raise an issue in the repository.

## 🚀 Deployment

For production deployment instructions, see [DEPLOYMENT.md](DEPLOYMENT.md)

---

**Happy Connecting with Alumni! 🎓**

Version: 2.0 (With Authentication & Authorization)
Last Updated: 2024


## 📋 Project Structure

```
alumni_management_system/
├── backend/
│   ├── config/
│   │   └── database.js           # MySQL connection pool configuration
│   ├── controllers/
│   │   └── alumniController.js   # Business logic for alumni operations
│   ├── middleware/
│   │   └── validation.js         # Request validation middleware
│   ├── models/
│   │   └── Alumni.js             # Alumni database model
│   ├── routes/
│   │   └── alumniRoutes.js       # API routes for alumni
│   ├── alumni_schema.sql         # MySQL database schema
│   ├── server.js                 # Express server setup
│   ├── package.json              # Backend dependencies
│   └── .env                      # Environment variables
│
└── frontend/
    ├── public/
    │   └── index.html            # HTML entry point
    ├── src/
    │   ├── components/
    │   │   ├── Header.js         # Navigation header
    │   │   └── Footer.js         # Footer component
    │   ├── pages/
    │   │   ├── Home.js           # Home page with statistics
    │   │   ├── AlumniList.js     # All alumni list view
    │   │   ├── AlumniForm.js     # Add/Edit alumni form
    │   │   ├── AlumniDetails.js  # Individual alumni details
    │   │   └── SearchPage.js     # Search alumni page
    │   ├── services/
    │   │   └── alumniService.js  # Axios API integration
    │   ├── styles/
    │   │   ├── Header.css        # Header styles
    │   │   ├── Footer.css        # Footer styles
    │   │   ├── Home.css          # Home page styles
    │   │   ├── AlumniList.css    # Alumni list styles
    │   │   ├── AlumniForm.css    # Form styles
    │   │   └── SearchPage.css    # Search page styles
    │   ├── App.js                # Main app component with routing
    │   ├── App.css               # Global styles
    │   └── index.js              # React entry point
    ├── package.json              # Frontend dependencies
    └── .env                      # Environment variables
```

## 🛠️ Tech Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MySQL** - Relational database
- **express-validator** - Form validation
- **mysql2/promise** - MySQL connection pool
- **CORS** - Cross-origin resource sharing

### Frontend
- **React.js** - UI library
- **React Router** - Client-side routing
- **Bootstrap** - CSS framework
- **React Bootstrap** - Bootstrap components for React
- **Axios** - HTTP client

### Database
- **MySQL** - Database management system
- **Connection Pooling** - For optimized database connections

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)
- MySQL Server (v5.7 or higher)

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create MySQL Database**
   ```bash
   mysql -u root -p < alumni_schema.sql
   ```

4. **Configure Environment Variables**
   Edit `.env` file and update:
   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=alumni_db
   DB_PORT=3306
   PORT=5000
   NODE_ENV=development
   ```

5. **Start Backend Server**
   ```bash
   npm start
   # or for development with auto-reload
   npm run dev
   ```

   The backend server will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   The `.env` file is already configured:
   ```
   REACT_APP_API_URL=http://localhost:5000/api
   ```

4. **Start Frontend Development Server**
   ```bash
   npm start
   ```

   The frontend will run on `http://localhost:3000`

## 📡 API Endpoints

### Alumni Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/alumni/create` | Create new alumni profile |
| GET | `/api/alumni/all` | Get all alumni |
| GET | `/api/alumni/:id` | Get alumni by ID |
| GET | `/api/alumni/search?searchTerm=query` | Search alumni |
| PUT | `/api/alumni/update/:id` | Update alumni profile |
| DELETE | `/api/alumni/delete/:id` | Delete alumni profile |
| GET | `/api/alumni/statistics` | Get statistics |

### Request/Response Examples

**Create Alumni**
```bash
POST /api/alumni/create
Content-Type: application/json

{
  "first_name": "John",
  "last_name": "Doe",
  "email": "john.doe@example.com",
  "phone": "9876543210",
  "graduation_year": 2020,
  "degree": "Bachelor of Engineering",
  "field_of_study": "Computer Science",
  "current_company": "Tech Corp",
  "current_position": "Software Engineer",
  "city": "Bangalore",
  "country": "India"
}
```

**Response**
```json
{
  "success": true,
  "message": "Alumni profile created successfully",
  "data": {
    "id": 1,
    "first_name": "John",
    ...
  }
}
```

## 🗄️ Database Schema

The MySQL database includes the following table:

**alumni** table:
- `id` - Primary key (Int, Auto-increment)
- `first_name` - Varchar(100), Required
- `last_name` - Varchar(100), Required
- `email` - Varchar(100), Required, Unique
- `phone` - Varchar(20)
- `graduation_year` - Int
- `degree` - Varchar(100), Required
- `field_of_study` - Varchar(100), Required
- `current_company` - Varchar(100)
- `current_position` - Varchar(100)
- `city` - Varchar(50)
- `country` - Varchar(50)
- `created_at` - Timestamp (Default: Current timestamp)
- `updated_at` - Timestamp (Default: Current timestamp, Updates on modification)

### Indexes
- `idx_email` - For faster email searches
- `idx_graduation_year` - For year-based queries
- `idx_created_at` - For sorting by creation date
- `idx_full_name` - For name searches
- `idx_company` - For company searches

## 🎨 UI/UX Features

- **Color Scheme**: Purple gradient (#667eea to #764ba2) with gold accents
- **Responsive Components**: Works on all device sizes
- **Bootstrap Integration**: Professional UI with Bootstrap components
- **Form Validations**: Client-side and server-side validation with error messages
- **Loading States**: Spinners and loading indicators
- **Confirmation Dialogs**: Delete confirmation modals
- **Error Handling**: User-friendly error messages
- **Search Functionality**: Real-time search with instant results

## 🔐 Validation

### Client-Side Validation
- Email format validation
- Required field validation
- Phone number format validation
- Graduation year validation

### Server-Side Validation
- Express validator middleware
- Email uniqueness check (for creation)
- Data type validation
- Required field validation

## 📊 Dummy Data

The database comes with 10 dummy alumni records for testing purposes. You can view them in the `alumni_schema.sql` file.

## 🧪 Testing

1. **Backend Health Check**
   ```bash
   curl http://localhost:5000/health
   ```

2. **Test API Endpoints**
   - Use Postman or curl to test API endpoints
   - Frontend automatically tests all endpoints through UI

## 🐛 Troubleshooting

### Backend Issues

**Issue**: Connection to MySQL fails
- **Solution**: Check MySQL server is running and credentials in `.env` are correct

**Issue**: Port 5000 already in use
- **Solution**: Change PORT in `.env` or kill the process using port 5000

**Issue**: npm install fails
- **Solution**: Delete `node_modules` folder and `package-lock.json`, then try again

### Frontend Issues

**Issue**: CORS errors when connecting to backend
- **Solution**: Ensure CORS is enabled in server.js and backend is running

**Issue**: Cannot find react-bootstrap modules
- **Solution**: Run `npm install` to reinstall dependencies

**Issue**: Port 3000 already in use
- **Solution**: Use `PORT=3001 npm start` to use a different port

## 📝 Usage

1. **View Home Page**: Browse alumni statistics and features
2. **View All Alumni**: Access the complete alumni directory
3. **Add Alumni**: Fill the form to create new alumni profiles
4. **Search Alumni**: Find specific alumni using various criteria
5. **View Details**: Click on any alumni to view full profile
6. **Edit Profile**: Update alumni information
7. **Delete Profile**: Remove alumni records (with confirmation)

## 🔄 Future Enhancements

- User authentication and authorization
- Profile pictures/avatars
- Alumni events management
- Messaging between alumni
- Advanced filtering options
- Export to CSV/PDF
- Analytics dashboard
- Email notifications
- Social media integration

## 📄 License

This project is open source and available under the MIT License.

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For support, please email alumni@university.edu or raise an issue in the repository.

---

**Happy Connecting with Alumni! 🎓**
