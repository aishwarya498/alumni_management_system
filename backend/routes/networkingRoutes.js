const express = require('express');
const router = express.Router();
const networkingController = require('../controllers/networkingController');
const { verifyToken } = require('../middleware/auth');

// public or auth-protected depending on requirement
router.get('/all', networkingController.getAllPosts);
router.get('/:id', networkingController.getPostById);
router.post('/create', verifyToken, networkingController.createPost);
router.put('/update/:id', verifyToken, networkingController.updatePost);
router.delete('/delete/:id', verifyToken, networkingController.deletePost);

module.exports = router;