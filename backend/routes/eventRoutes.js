const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const { verifyToken } = require('../middleware/auth');

router.get('/all', eventController.getAllEvents);
router.get('/:id', eventController.getEventById);
router.post('/create', verifyToken, eventController.createEvent);
router.put('/update/:id', verifyToken, eventController.updateEvent);
router.delete('/delete/:id', verifyToken, eventController.deleteEvent);

module.exports = router;