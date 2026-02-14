const User = require('../models/User');
const Role = require('../models/Role');

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.getAll();

    res.json({
      success: true,
      message: 'Users retrieved successfully',
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving users',
      error: error.message
    });
  }
};

// Get user by ID
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.getById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get user roles with permissions
    const roles = await User.getUserRoles(id);
    const rolesWithPermissions = await Promise.all(
      roles.map(async (role) => {
        const roleData = await Role.getById(role.id);
        return roleData;
      })
    );

    res.json({
      success: true,
      message: 'User retrieved successfully',
      data: {
        ...user,
        roles: rolesWithPermissions
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving user',
      error: error.message
    });
  }
};

// Update user
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { first_name, last_name, phone, is_active } = req.body;

    // Check if user exists
    const user = await User.getById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    await User.update(id, {
      first_name: first_name || user.first_name,
      last_name: last_name || user.last_name,
      phone: phone || user.phone,
      is_active: is_active !== undefined ? is_active : user.is_active
    });

    const updatedUser = await User.getById(id);

    res.json({
      success: true,
      message: 'User updated successfully',
      data: updatedUser
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating user',
      error: error.message
    });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if user exists
    const user = await User.getById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prevent deleting admin user
    const userRoles = await User.getUserRoles(id);
    const isAdmin = userRoles.some(role => role.name === 'admin');
    if (isAdmin && userRoles.length === 1) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete admin user'
      });
    }

    await User.delete(id);

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting user',
      error: error.message
    });
  }
};

// Assign role to user
exports.assignRole = async (req, res) => {
  try {
    const { userId, roleId } = req.body;

    // Validate user and role exist
    const user = await User.getById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const role = await Role.getById(roleId);
    if (!role) {
      return res.status(404).json({
        success: false,
        message: 'Role not found'
      });
    }

    await User.assignRole(userId, roleId, req.user.id);

    const updatedUser = await User.getById(userId);

    res.json({
      success: true,
      message: 'Role assigned successfully',
      data: updatedUser
    });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({
        success: false,
        message: 'User already has this role'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error assigning role',
      error: error.message
    });
  }
};

// Remove role from user
exports.removeRole = async (req, res) => {
  try {
    const { userId, roleId } = req.body;

    // Validate user and role exist
    const user = await User.getById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const role = await Role.getById(roleId);
    if (!role) {
      return res.status(404).json({
        success: false,
        message: 'Role not found'
      });
    }

    // Prevent removing last admin role
    const userRoles = await User.getUserRoles(userId);
    const isLastAdminRole = userRoles.length === 1 && userRoles[0].id === roleId && role.name === 'admin';

    if (isLastAdminRole) {
      return res.status(400).json({
        success: false,
        message: 'Cannot remove last admin role'
      });
    }

    await User.removeRole(userId, roleId);

    const updatedUser = await User.getById(userId);

    res.json({
      success: true,
      message: 'Role removed successfully',
      data: updatedUser
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error removing role',
      error: error.message
    });
  }
};

// Get user roles
exports.getUserRoles = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if user exists
    const user = await User.getById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const roles = await User.getUserRoles(id);

    res.json({
      success: true,
      message: 'User roles retrieved successfully',
      data: roles
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving user roles',
      error: error.message
    });
  }
};
