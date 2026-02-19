const express = require('express');
const router = express.Router();
const storyController = require('../controllers/storyController');
const { verifyToken } = require('../middleware/auth');

router.get('/all', storyController.getAllStories);
router.get('/:id', storyController.getStoryById);
router.post('/create', verifyToken, storyController.createStory);
router.put('/update/:id', verifyToken, storyController.updateStory);
router.delete('/delete/:id', verifyToken, storyController.deleteStory);

module.exports = router;