const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');
const { verifyToken } = require('../middleware/auth');

router.get('/all', feedbackController.getAllFeedback);
router.get('/:id', feedbackController.getFeedbackById);
router.post('/create', verifyToken, feedbackController.createFeedback);
router.put('/update/:id', verifyToken, feedbackController.updateFeedback);
router.delete('/delete/:id', verifyToken, feedbackController.deleteFeedback);

module.exports = router;