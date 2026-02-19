const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');
const { verifyToken } = require('../middleware/auth');

router.get('/all', jobController.getAllJobs);
router.get('/:id', jobController.getJobById);
router.post('/create', verifyToken, jobController.createJob);
router.put('/update/:id', verifyToken, jobController.updateJob);
router.delete('/delete/:id', verifyToken, jobController.deleteJob);

module.exports = router;