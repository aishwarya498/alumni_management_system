const Role = require('../models/Role');

// Create role
exports.createRole = async (req, res) => {
  try {
    const { name, description, permissions } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Role name is required'
      });
    }

    const result = await Role.create({
      name,
      description,
      permissions: permissions || []
    });

    res.status(201).json({
      success: true,
      message: 'Role created successfully',
      data: {
        id: result.insertId,
        name,
        description,
        permissions: permissions || []
      }
    });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({
        success: false,
        message: 'Role with this name already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error creating role',
      error: error.message
    });
  }
};

// Get all roles
exports.getAllRoles = async (req, res) => {
  try {
    const roles = await Role.getAll();

    res.json({
      success: true,
      message: 'Roles retrieved successfully',
      data: roles
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving roles',
      error: error.message
    });
  }
};

// Get role by ID
exports.getRoleById = async (req, res) => {
  try {
    const { id } = req.params;
    const role = await Role.getById(id);

    if (!role) {
      return res.status(404).json({
        success: false,
        message: 'Role not found'
      });
    }

    res.json({
      success: true,
      message: 'Role retrieved successfully',
      data: role
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving role',
      error: error.message
    });
  }
};

// Update role
exports.updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, permissions } = req.body;

    // Check if role exists
    const role = await Role.getById(id);
    if (!role) {
      return res.status(404).json({
        success: false,
        message: 'Role not found'
      });
    }

    // Prevent editing built-in roles
    const builtInRoles = ['admin', 'manager', 'alumni', 'guest'];
    if (builtInRoles.includes(role.name)) {
      return res.status(400).json({
        success: false,
        message: 'Cannot edit built-in roles'
      });
    }

    await Role.update(id, {
      name: name || role.name,
      description: description || role.description,
      permissions: permissions !== undefined ? permissions : role.permissions
    });

    const updatedRole = await Role.getById(id);

    res.json({
      success: true,
      message: 'Role updated successfully',
      data: updatedRole
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating role',
      error: error.message
    });
  }
};

// Delete role
exports.deleteRole = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if role exists
    const role = await Role.getById(id);
    if (!role) {
      return res.status(404).json({
        success: false,
        message: 'Role not found'
      });
    }

    // Prevent deleting built-in roles
    const builtInRoles = ['admin', 'manager', 'alumni', 'guest'];
    if (builtInRoles.includes(role.name)) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete built-in roles'
      });
    }

    await Role.delete(id);

    res.json({
      success: true,
      message: 'Role deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting role',
      error: error.message
    });
  }
};

// Add permission to role
exports.addPermission = async (req, res) => {
  try {
    const { id } = req.params;
    const { permission } = req.body;

    if (!permission) {
      return res.status(400).json({
        success: false,
        message: 'Permission is required'
      });
    }

    // Check if role exists
    const role = await Role.getById(id);
    if (!role) {
      return res.status(404).json({
        success: false,
        message: 'Role not found'
      });
    }

    const permissions = await Role.addPermission(id, permission);

    res.json({
      success: true,
      message: 'Permission added successfully',
      data: {
        roleId: id,
        permissions
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding permission',
      error: error.message
    });
  }
};

// Remove permission from role
exports.removePermission = async (req, res) => {
  try {
    const { id } = req.params;
    const { permission } = req.body;

    if (!permission) {
      return res.status(400).json({
        success: false,
        message: 'Permission is required'
      });
    }

    // Check if role exists
    const role = await Role.getById(id);
    if (!role) {
      return res.status(404).json({
        success: false,
        message: 'Role not found'
      });
    }

    const permissions = await Role.removePermission(id, permission);

    res.json({
      success: true,
      message: 'Permission removed successfully',
      data: {
        roleId: id,
        permissions
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error removing permission',
      error: error.message
    });
  }
};

// Get users with specific role
exports.getRoleUsers = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if role exists
    const role = await Role.getById(id);
    if (!role) {
      return res.status(404).json({
        success: false,
        message: 'Role not found'
      });
    }

    const users = await Role.getUsersByRole(id);

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
