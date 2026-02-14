# Role Management Guide

Complete guide to creating, updating, and managing roles in the Alumni Management System.

## 🎯 Overview

The system includes 4 predefined system roles that cannot be deleted:
- **Admin** - Full system access
- **Manager** - Alumni management
- **Alumni** - Personal profile access
- **Guest** - Read-only access

You can also create custom roles with specific permission combinations.

## 🖥️ Web UI Access

### Via Admin Dashboard
1. Login as admin (username: admin, password: admin123)
2. Click your username dropdown at top right
3. Select "Manage Roles"
4. Use the interface to create, edit, and delete roles

### Available Permissions
- `manage_users` - Create, edit, delete users
- `manage_roles` - Create, edit, delete roles
- `manage_alumni` - Create, edit, delete alumni profiles
- `view_reports` - Access system reports
- `view_alumni` - View alumni directory
- `update_profile` - Edit own profile
- `view_directory` - Browse alumni directory
- `export_data` - Export alumni data

## 📡 API Endpoints

### Get All Roles
```bash
GET /api/roles

Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "admin",
      "description": "Administrator with full system access",
      "permissions": [
        "manage_users",
        "manage_roles",
        "manage_alumni",
        "view_reports"
      ]
    },
    {
      "id": 2,
      "name": "manager",
      "description": "Manager with alumni management access",
      "permissions": [
        "manage_alumni",
        "view_alumni",
        "export_data"
      ]
    }
  ]
}
```

### Get Single Role
```bash
GET /api/roles/{roleId}

Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "admin",
    "description": "Administrator",
    "permissions": ["manage_users", "manage_roles"]
  }
}
```

### Create New Role
```bash
POST /api/roles

Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "supervisor",
  "description": "Supervisor role for department heads",
  "permissions": [
    "manage_alumni",
    "view_alumni",
    "view_reports",
    "export_data"
  ]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Role created successfully",
  "data": {
    "id": 5,
    "name": "supervisor",
    "description": "Supervisor role for department heads",
    "permissions": ["manage_alumni", "view_alumni", "view_reports", "export_data"]
  }
}
```

### Update Role
```bash
PUT /api/roles/{roleId}

Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "supervisor",
  "description": "Updated description",
  "permissions": [
    "manage_alumni",
    "view_alumni",
    "export_data"
  ]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Role updated successfully",
  "data": {
    "id": 5,
    "name": "supervisor",
    "description": "Updated description",
    "permissions": ["manage_alumni", "view_alumni", "export_data"]
  }
}
```

### Delete Role
```bash
DELETE /api/roles/{roleId}

Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "message": "Role deleted successfully"
}
```

**Note:** System roles (admin, manager, alumni, guest) cannot be deleted.

### Get Users with Specific Role
```bash
GET /api/roles/{roleId}/users

Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "username": "admin_user",
      "email": "admin@example.com",
      "first_name": "System",
      "last_name": "Administrator"
    }
  ]
}
```

## 🔧 Complete Examples

### Using cURL

#### Get All Roles
```bash
curl -X GET http://localhost:5000/api/roles \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### Create New Role (Auditor)
```bash
curl -X POST http://localhost:5000/api/roles \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "auditor",
    "description": "Audit and reporting role",
    "permissions": [
      "view_alumni",
      "view_reports",
      "export_data"
    ]
  }'
```

#### Update Role Permissions
```bash
curl -X PUT http://localhost:5000/api/roles/5 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "auditor",
    "description": "Audit and reporting role",
    "permissions": [
      "view_alumni",
      "view_reports",
      "export_data",
      "manage_alumni"
    ]
  }'
```

#### Delete Custom Role
```bash
curl -X DELETE http://localhost:5000/api/roles/5 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Using JavaScript/Fetch

```javascript
const API_URL = 'http://localhost:5000/api';
const token = localStorage.getItem('token');

// Get all roles
async function getRoles() {
  const response = await fetch(`${API_URL}/roles`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  const data = await response.json();
  console.log(data.data);
}

// Create new role
async function createRole(roleData) {
  const response = await fetch(`${API_URL}/roles`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(roleData)
  });
  const data = await response.json();
  console.log(data);
}

// Update role
async function updateRole(roleId, roleData) {
  const response = await fetch(`${API_URL}/roles/${roleId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(roleData)
  });
  const data = await response.json();
  console.log(data);
}

// Delete role
async function deleteRole(roleId) {
  const response = await fetch(`${API_URL}/roles/${roleId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  const data = await response.json();
  console.log(data);
}

// Usage
createRole({
  name: 'department_head',
  description: 'Department head role',
  permissions: [
    'manage_alumni',
    'view_alumni',
    'view_reports',
    'export_data'
  ]
});
```

### Using Axios

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
});

// Get all roles
api.get('/roles').then(res => console.log(res.data.data));

// Create role
api.post('/roles', {
  name: 'department_head',
  description: 'Department head role',
  permissions: ['manage_alumni', 'view_alumni', 'view_reports']
}).then(res => console.log(res.data));

// Update role
api.put('/roles/5', {
  name: 'department_head',
  description: 'Updated description',
  permissions: ['manage_alumni', 'view_alumni', 'export_data']
}).then(res => console.log(res.data));

// Delete role
api.delete('/roles/5').then(res => console.log(res.data));
```

## 🗂️ System Roles Details

### Admin Role
- **Permissions:** manage_users, manage_roles, manage_alumni, view_reports
- **Can:** Create/edit/delete users, manage roles, manage alumni, view reports
- **Cannot:** Deleted (system role)

### Manager Role
- **Permissions:** manage_alumni, view_alumni, export_data
- **Can:** Manage alumni profiles, export data, view directory
- **Cannot:** Manage users, deleted (system role)

### Alumni Role
- **Permissions:** view_alumni, update_profile, view_directory
- **Can:** Update own profile, view directory, limited alumni access
- **Cannot:** Manage anyone else's profile

### Guest Role
- **Permissions:** view_alumni, view_directory
- **Can:** View alumni directory, view all profiles
- **Cannot:** Create, edit, or delete anything

## 📋 Database Structure

Roles are stored in the `roles` table with the following structure:

```sql
CREATE TABLE roles (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  permissions JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Example permission JSON:**
```json
{
  "permissions": [
    "manage_users",
    "manage_roles",
    "manage_alumni",
    "view_reports"
  ]
}
```

## ✅ Best Practices

1. **Clear Naming** - Use descriptive role names (e.g., `department_head` not `dh`)
2. **Specific Permissions** - Only grant necessary permissions for each role
3. **Document Roles** - Use descriptions to explain role purpose
4. **Regular Audits** - Periodically review who has which roles
5. **Backup System Roles** - Don't modify the 4 system roles
6. **Test Before Assigning** - Create roles and test them before assigning to users

## 🚨 Common Issues

### Cannot Delete System Roles
System roles (admin, manager, alumni, guest) are protected and cannot be deleted.
**Solution:** Use custom roles instead, or modify permissions of existing system roles.

### Permission Not Working
Permissions must match exactly (case-sensitive).
**Solution:** Use provided permission list from API response.

### Cannot Create Role Without Permissions
All roles must have at least one permission.
**Solution:** Select at least one permission from available list.

### Authentication Failed
Token may have expired or be invalid.
**Solution:** Log out and log in again to get new token.

## 📞 Support

For detailed help, see:
- [SETUP_INSTRUCTIONS.md](../SETUP_INSTRUCTIONS.md)
- [README.md](../README.md)
- [FRONTEND_AUTH.md](../FRONTEND_AUTH.md)

---

**Ready to manage roles? Login as admin and navigate to "Manage Roles"!**
