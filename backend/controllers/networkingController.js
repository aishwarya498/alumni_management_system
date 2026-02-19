const Networking = require('../models/Networking');

exports.createPost = async (req, res) => {
  try {
    const data = req.body;
    if (req.user) data.user_id = req.user.id;
    const result = await Networking.create(data);
    res.status(201).json({ success: true, message: 'Post created', data: { id: result.insertId, ...data } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error creating post', error: error.message });
  }
};

exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Networking.getAll();
    res.json({ success: true, data: posts });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching posts', error: error.message });
  }
};

exports.getPostById = async (req, res) => {
  try {
    const post = await Networking.getById(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });
    res.json({ success: true, data: post });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error retrieving post', error: error.message });
  }
};

exports.updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await Networking.getById(id);
    if (!existing) return res.status(404).json({ success: false, message: 'Post not found' });
    const result = await Networking.update(id, req.body);
    res.json({ success: true, message: 'Post updated', data: { id, ...req.body } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating post', error: error.message });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await Networking.getById(id);
    if (!existing) return res.status(404).json({ success: false, message: 'Post not found' });
    await Networking.delete(id);
    res.json({ success: true, message: 'Post deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting post', error: error.message });
  }
};