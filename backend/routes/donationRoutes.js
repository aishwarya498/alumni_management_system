const express = require('express');
const router = express.Router();
const donationController = require('../controllers/donationController');
const { verifyToken } = require('../middleware/auth');

router.get('/all', donationController.getAllCampaigns);
router.get('/:id', donationController.getCampaignById);
router.post('/create', verifyToken, donationController.createCampaign);
router.put('/update/:id', verifyToken, donationController.updateCampaign);
router.delete('/delete/:id', verifyToken, donationController.deleteCampaign);

module.exports = router;