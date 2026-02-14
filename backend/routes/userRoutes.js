const express = require('express');
const { body } = require('express-validator');
const userController = require('../controllers/userController');
const { validateRequest } = require('../middleware/validation');
const { verifyToken, checkRole } = require('../middleware/auth');

const router = express.Router();

// Validation rules
const updateUserValidationRules = () => {
  return [
    body('first_name').optional().trim(),
    body('last_name').optional().trim(),
    body('phone').optional().matches(/^\d{10,}$/).withMessage('Valid phone number required'),
    body('is_active').optional().isBoolean().withMessage('is_active must be boolean')
  ];
};

const assignRoleValidationRules = () => {
  return [
    body('userId').isInt().withMessage('Valid user ID required'),
    body('roleId').isInt().withMessage('Valid role ID required')
  ];
};

// All user management routes require authentication and admin/manager role
router.use(verifyToken, checkRole(['admin', 'manager']));

// Get all users
router.get('/', userController.getAllUsers);

// Get user by ID
router.get('/:id', userController.getUserById);

// Update user
router.put('/:id', updateUserValidationRules(), validateRequest, userController.updateUser);

// Delete user
router.delete('/:id', userController.deleteUser);

// Get user roles
router.get('/:id/roles', userController.getUserRoles);

// Assign role to user (admin only)
router.post('/:id/assign-role', verifyToken, checkRole(['admin']), assignRoleValidationRules(), validateRequest, userController.assignRole);

// Remove role from user (admin only)
router.post('/:id/remove-role', verifyToken, checkRole(['admin']), assignRoleValidationRules(), validateRequest, userController.removeRole);

module.exports = router;
