const Feedback = require('../models/Feedback');

exports.createFeedback = async (req, res) => {
  try {
    const data = req.body;
    if (req.user) data.user_id = req.user.id;
    const result = await Feedback.create(data);
    res.status(201).json({ success: true, message: 'Feedback submitted', data: { id: result.insertId, ...data } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error submitting feedback', error: error.message });
  }
};

exports.getAllFeedback = async (req, res) => {
  try {
    const entries = await Feedback.getAll();
    res.json({ success: true, data: entries });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching feedback', error: error.message });
  }
};

exports.getFeedbackById = async (req, res) => {
  try {
    const fb = await Feedback.getById(req.params.id);
    if (!fb) return res.status(404).json({ success: false, message: 'Feedback not found' });
    res.json({ success: true, data: fb });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error retrieving feedback', error: error.message });
  }
};

exports.updateFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await Feedback.getById(id);
    if (!existing) return res.status(404).json({ success: false, message: 'Feedback not found' });
    await Feedback.update(id, req.body);
    res.json({ success: true, message: 'Feedback updated', data: { id, ...req.body } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating feedback', error: error.message });
  }
};

exports.deleteFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await Feedback.getById(id);
    if (!existing) return res.status(404).json({ success: false, message: 'Feedback not found' });
    await Feedback.delete(id);
    res.json({ success: true, message: 'Feedback deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting feedback', error: error.message });
  }
};
