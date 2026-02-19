const Story = require('../models/Story');

exports.createStory = async (req, res) => {
  try {
    const data = req.body;
    if (req.user) data.created_by = req.user.id;
    const result = await Story.create(data);
    res.status(201).json({ success: true, message: 'Story created', data: { id: result.insertId, ...data } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error creating story', error: error.message });
  }
};

exports.getAllStories = async (req, res) => {
  try {
    const stories = await Story.getAll();
    res.json({ success: true, data: stories });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching stories', error: error.message });
  }
};

exports.getStoryById = async (req, res) => {
  try {
    const story = await Story.getById(req.params.id);
    if (!story) return res.status(404).json({ success: false, message: 'Story not found' });
    res.json({ success: true, data: story });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error retrieving story', error: error.message });
  }
};

exports.updateStory = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await Story.getById(id);
    if (!existing) return res.status(404).json({ success: false, message: 'Story not found' });
    await Story.update(id, req.body);
    res.json({ success: true, message: 'Story updated', data: { id, ...req.body } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating story', error: error.message });
  }
};

exports.deleteStory = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await Story.getById(id);
    if (!existing) return res.status(404).json({ success: false, message: 'Story not found' });
    await Story.delete(id);
    res.json({ success: true, message: 'Story deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting story', error: error.message });
  }
};