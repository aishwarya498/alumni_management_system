const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Role = require('../models/Role');

// Register user
exports.register = async (req, res) => {
  try {
    const { username, email, password, confirm_password, first_name, last_name, phone, selected_role } = req.body;

    // Validate input
    if (!password || password !== confirm_password) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match'
      });
    }

    // Register user
    const result = await User.register({
      username,
      email,
      password,
      first_name,
      last_name,
      phone
    });

    // Determine which role to assign
    let roleToAssign = selected_role || 'alumni';
    
    // Validate that selected role exists
    const selectedRole = await Role.getByName(roleToAssign);
    if (!selectedRole) {
      // If selected role doesn't exist, default to 'alumni'
      roleToAssign = 'alumni';
    }

    // Get the role to assign
    const roleData = await Role.getByName(roleToAssign);
    if (roleData) {
      await User.assignRole(result.insertId, roleData.id, 1);
    }

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        id: result.insertId,
        username,
        email,
        role: roleToAssign
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Error during registration'
    });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username and password are required'
      });
    }

    // Authenticate user
    const user = await User.login(username, password);

    // Get user roles and permissions
    const userRoles = await User.getUserRoles(user.id);
    let permissions = [];

    for (const role of userRoles) {
      const roleData = await Role.getById(role.id);
      permissions = [...new Set([...permissions, ...roleData.permissions])];
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
        roles: userRoles.map(r => r.name),
        permissions: permissions
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRY || '7d' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          roles: userRoles.map(r => r.name),
          permissions: permissions
        }
      }
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message || 'Authentication failed'
    });
  }
};

// Get current user profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.getById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'Profile retrieved successfully',
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving profile',
      error: error.message
    });
  }
};

// Update profile
exports.updateProfile = async (req, res) => {
  try {
    const { first_name, last_name, phone } = req.body;

    await User.update(req.user.id, {
      first_name,
      last_name,
      phone,
      is_active: true
    });

    const user = await User.getById(req.user.id);

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating profile',
      error: error.message
    });
  }
};

// Change password
exports.changePassword = async (req, res) => {
  try {
    const { old_password, new_password, confirm_password } = req.body;

    if (new_password !== confirm_password) {
      return res.status(400).json({
        success: false,
        message: 'New passwords do not match'
      });
    }

    await User.changePassword(req.user.id, old_password, new_password);

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Error changing password'
    });
  }
};

// Verify token
exports.verifyToken = (req, res) => {
  res.json({
    success: true,
    message: 'Token is valid',
    data: req.user
  });
};
