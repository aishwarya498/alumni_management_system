const Donation = require('../models/Donation');

exports.createCampaign = async (req, res) => {
  try {
    const data = req.body;
    if (req.user) data.created_by = req.user.id;
    const result = await Donation.create(data);
    res.status(201).json({ success: true, message: 'Donation campaign created', data: { id: result.insertId, ...data } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error creating campaign', error: error.message });
  }
};

exports.getAllCampaigns = async (req, res) => {
  try {
    const campaigns = await Donation.getAll();
    res.json({ success: true, data: campaigns });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching donations', error: error.message });
  }
};

exports.getCampaignById = async (req, res) => {
  try {
    const campaign = await Donation.getById(req.params.id);
    if (!campaign) return res.status(404).json({ success: false, message: 'Campaign not found' });
    res.json({ success: true, data: campaign });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error retrieving campaign', error: error.message });
  }
};

exports.updateCampaign = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await Donation.getById(id);
    if (!existing) return res.status(404).json({ success: false, message: 'Campaign not found' });
    await Donation.update(id, req.body);
    res.json({ success: true, message: 'Campaign updated', data: { id, ...req.body } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating campaign', error: error.message });
  }
};

exports.deleteCampaign = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await Donation.getById(id);
    if (!existing) return res.status(404).json({ success: false, message: 'Campaign not found' });
    await Donation.delete(id);
    res.json({ success: true, message: 'Campaign deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting campaign', error: error.message });
  }
};