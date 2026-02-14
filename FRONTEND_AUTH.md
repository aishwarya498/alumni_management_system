# Frontend Authentication Integration

## Overview
The Alumni Management System now includes a complete authentication system with role-based access control. This document explains how the frontend integrates with the backend authentication API.

## Components Added

### 1. AuthContext (`src/context/AuthContext.js`)
The core authentication context that manages user state, token management, and API communication.

**Features:**
- User authentication state management
- Token storage and verification
- User registration and login
- Profile management
- Password change functionality
- Role and permission checking utilities

**Key Methods:**
- `register()` - Register new users
- `login()` - Authenticate users
- `logout()` - Clear authentication
- `updateProfile()` - Update user profile
- `changePassword()` - Change user password
- `hasRole()` - Check if user has specific role(s)
- `hasPermission()` - Check if user has permission

**Context Values:**
```javascript
{
  user,              // Current user object
  token,             // JWT token
  loading,           // Loading state
  error,             // Error message
  register,          // Function to register
  login,             // Function to login
  logout,            // Function to logout
  updateProfile,     // Update profile function
  changePassword,    // Change password function
  hasRole,           // Check roles function
  hasPermission,     // Check permissions function
  isAuthenticated    // Boolean flag
}
```

### 2. Pages

#### Login Page (`src/pages/Login.js`)
- Username and password form
- Validation and error handling
- Demo credentials buttons for testing
- Redirect to register page
- Auto-redirects to home on successful login

#### Register Page (`src/pages/Register.js`)
- User registration form
- Fields: username, first_name, last_name, email, password
- Password confirmation validation
- Email format validation
- Default role assignment (alumni)
- Success message and redirect to login

#### Profile Page (`src/pages/Profile.js`)
- User profile management
- Two tabs: Profile & Change Password
- Update personal information
- Change password with validation
- Protected route (requires authentication)

#### Admin Dashboard (`src/pages/AdminDashboard.js`)
- User management (admin only)
- Role management (admin only)
- User list with role assignment
- Role card display with permissions
- Protected by admin role

### 3. Components

#### ProtectedRoute (`src/components/ProtectedRoute.js`)
Wrapper component for route protection based on authentication and roles.

**Usage:**
```javascript
<ProtectedRoute requiredRoles={['admin']}>
  <AdminDashboard />
</ProtectedRoute>
```

#### Enhanced Header (`src/components/Header.js`)
Updated navigation with:
- User dropdown menu
- Profile link
- Admin dashboard link (for admins)
- Logout button
- Role-based visibility
- Authentication status display

## Styling

### New CSS Files:
- `src/styles/Auth.css` - Login/Register forms
- `src/styles/Profile.css` - Profile management
- `src/styles/Dashboard.css` - Admin dashboard

## Updated Routes

```javascript
GET  /              - Home page (public)
POST /login         - User login (public)
POST /register      - User registration (public)
GET  /profile       - User profile (protected)
GET  /admin         - Admin dashboard (admin only)
GET  /alumni        - Alumni list (public)
GET  /alumni/:id    - Alumni details (public)
POST /add-alumni    - Create alumni (admin/manager/alumni)
PUT  /edit-alumni/:id - Edit alumni (admin/manager/alumni)
GET  /search        - Search alumni (public)
```

## Authentication Flow

### Registration Flow
1. User fills registration form
2. Frontend validates form data
3. POST to `/auth/register` with credentials
4. Backend creates user with default 'alumni' role
5. User redirected to login page
6. User can now login

### Login Flow
1. User enters credentials
2. Frontend validates form data
3. POST to `/auth/login`
4. Backend validates and returns JWT token
5. Frontend stores token in localStorage
6. AuthContext updates user state
7. User redirected to home page

### Protected Access Flow
1. User attempts to access protected resource
2. ProtectedRoute checks isAuthenticated
3. If not authenticated, redirects to login
4. If authenticated but insufficient roles, shows access denied
5. Otherwise, renders protected component

## Token Management

### Storage
- JWT token stored in `localStorage['token']`
- Token persists across page reloads
- Token automatically cleared on logout

### Usage
- Token automatically attached to all API requests via axios interceptor
- Format: `Authorization: Bearer <token>`
- Token checked and refreshed on app mount

## Role-Based Access Control

### Predefined Roles:
1. **Admin** - Full system access
   - Permissions: manage_users, manage_roles, manage_alumni, view_reports

2. **Manager** - Alumni management
   - Permissions: manage_alumni, view_alumni, export_data

3. **Alumni** - Personal profile and limited alumni access
   - Permissions: view_alumni, update_profile, view_directory

4. **Guest** - Read-only access
   - Permissions: view_alumni, view_directory

### Usage in Components:
```javascript
const { hasRole, hasPermission } = useAuth();

// Check single role
if (hasRole('admin')) { }

// Check multiple roles
if (hasRole(['admin', 'manager'])) { }

// Check permission
if (hasPermission('manage_alumni')) { }
```

## Service Integration

### alumniService (`src/services/alumniService.js`)
Updated to automatically include JWT token in all requests:

```javascript
// Axios interceptor added
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

## Environment Variables

Create `.env` file in frontend root:
```
REACT_APP_API_URL=http://localhost:5000/api
```

## Testing

### Demo Accounts:
1. **Admin Account**
   - Username: admin
   - Password: admin123
   - Role: admin

2. **Manager Account**
   - Username: manager
   - Password: manager123
   - Role: manager

3. **Alumni Account**
   - Username: alumni1
   - Password: alumni123
   - Role: alumni

## Security Considerations

1. **Token Storage**: JWT tokens stored in localStorage (consider httpOnly cookies for production)
2. **Token Expiry**: Set to 7 days by default
3. **HTTPS**: Use HTTPS in production
4. **CORS**: Backend configured to accept requests from frontend
5. **Password Hashing**: Passwords hashed with bcryptjs (10 rounds)

## Common Issues

### "No token found"
- Ensure user is logged in
- Check localStorage for 'token' key
- Verify token hasn't expired

### "Insufficient permissions"
- Check user's role
- Verify role has required permissions
- Contact admin to update permissions

### "Invalid token"
- Token may have expired
- Try logging in again
- Clear localStorage and refresh page

## Future Enhancements

1. Token refresh mechanism
2. Remember me functionality
3. Social login integration
4. Two-factor authentication
5. Session management
6. Activity logging

## API References

See [DEPLOYMENT.md](../DEPLOYMENT.md) and [ARCHITECTURE.md](../ARCHITECTURE.md) for detailed API endpoint documentation.
