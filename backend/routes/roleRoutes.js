const express = require('express');
const { body } = require('express-validator');
const roleController = require('../controllers/roleController');
const { validateRequest } = require('../middleware/validation');
const { verifyToken, checkRole } = require('../middleware/auth');

const router = express.Router();

// Validation rules
const createRoleValidationRules = () => {
  return [
    body('name').trim().notEmpty().withMessage('Role name is required'),
    body('description').optional().trim(),
    body('permissions').optional().isArray().withMessage('Permissions must be an array')
  ];
};

const updateRoleValidationRules = () => {
  return [
    body('name').optional().trim(),
    body('description').optional().trim(),
    body('permissions').optional().isArray().withMessage('Permissions must be an array')
  ];
};

const permissionValidationRules = () => {
  return [
    body('permission').trim().notEmpty().withMessage('Permission is required')
  ];
};

// Public endpoint to list roles (used by registration page)
router.get('/', roleController.getAllRoles);

// All other role management routes require authentication and admin role
router.use(verifyToken, checkRole(['admin']));

// Create role
router.post('/', createRoleValidationRules(), validateRequest, roleController.createRole);

// Get role by ID (admin only)
router.get('/:id', roleController.getRoleById);

// Update role
router.put('/:id', updateRoleValidationRules(), validateRequest, roleController.updateRole);

// Delete role
router.delete('/:id', roleController.deleteRole);

// Add permission to role
router.post('/:id/add-permission', permissionValidationRules(), validateRequest, roleController.addPermission);

// Remove permission from role
router.post('/:id/remove-permission', permissionValidationRules(), validateRequest, roleController.removePermission);

// Get users with specific role
router.get('/:id/users', roleController.getRoleUsers);

module.exports = router;
