const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const { validateRequest } = require('../middleware/validation');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// Validation rules
const registerValidationRules = () => {
  return [
    body('username').trim().notEmpty().withMessage('Username is required').isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('confirm_password').custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords do not match');
      }
      return true;
    }),
    body('first_name').optional().trim(),
    body('last_name').optional().trim()
  ];
};

const loginValidationRules = () => {
  return [
    body('username').trim().notEmpty().withMessage('Username is required'),
    body('password').notEmpty().withMessage('Password is required')
  ];
};

const changePasswordValidationRules = () => {
  return [
    body('old_password').notEmpty().withMessage('Old password is required'),
    body('new_password').isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),
    body('confirm_password').custom((value, { req }) => {
      if (value !== req.body.new_password) {
        throw new Error('Passwords do not match');
      }
      return true;
    })
  ];
};

// Public routes
router.post('/register', registerValidationRules(), validateRequest, authController.register);
router.post('/login', loginValidationRules(), validateRequest, authController.login);

// Protected routes
router.get('/profile', verifyToken, authController.getProfile);
router.put('/profile', verifyToken, authController.updateProfile);
router.post('/change-password', verifyToken, changePasswordValidationRules(), validateRequest, authController.changePassword);
router.get('/verify', verifyToken, authController.verifyToken);

module.exports = router;
