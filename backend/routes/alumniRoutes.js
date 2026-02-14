const express = require('express');
const { body } = require('express-validator');
const alumniController = require('../controllers/alumniController');
const { validateRequest } = require('../middleware/validation');
const { verifyToken, checkRole } = require('../middleware/auth');

const router = express.Router();

// Validation rules
const alumniValidationRules = () => {
  return [
    body('first_name').trim().notEmpty().withMessage('First name is required'),
    body('last_name').trim().notEmpty().withMessage('Last name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('phone').optional().matches(/^\d{10,}$/).withMessage('Valid phone number is required'),
    body('graduation_year').isInt({ min: 1900, max: 2100 }).withMessage('Valid graduation year is required'),
    body('degree').trim().notEmpty().withMessage('Degree is required'),
    body('field_of_study').trim().notEmpty().withMessage('Field of study is required'),
    body('current_company').optional().trim(),
    body('current_position').optional().trim(),
    body('city').optional().trim(),
    body('country').optional().trim()
  ];
};

// Public routes (no authentication required for viewing)
router.get('/all', alumniController.getAllAlumni);
router.get('/search', alumniController.searchAlumni);
router.get('/statistics', alumniController.getStatistics);
router.get('/:id', alumniController.getAlumniById);

// Protected routes (require authentication)
router.post('/create', verifyToken, checkRole(['admin', 'manager', 'alumni']), alumniValidationRules(), validateRequest, alumniController.createAlumni);
router.put('/update/:id', verifyToken, checkRole(['admin', 'manager', 'alumni']), alumniValidationRules(), validateRequest, alumniController.updateAlumni);
router.delete('/delete/:id', verifyToken, checkRole(['admin', 'manager']), alumniController.deleteAlumni);

module.exports = router;
