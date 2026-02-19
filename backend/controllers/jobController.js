const Job = require('../models/Job');

exports.createJob = async (req, res) => {
  try {
    const data = req.body;
    if (req.user) data.posted_by = req.user.id;
    const result = await Job.create(data);
    res.status(201).json({ success: true, message: 'Job posted', data: { id: result.insertId, ...data } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error creating job', error: error.message });
  }
};

exports.getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.getAll();
    res.json({ success: true, data: jobs });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching jobs', error: error.message });
  }
};

exports.getJobById = async (req, res) => {
  try {
    const job = await Job.getById(req.params.id);
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
    res.json({ success: true, data: job });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error retrieving job', error: error.message });
  }
};

exports.updateJob = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await Job.getById(id);
    if (!existing) return res.status(404).json({ success: false, message: 'Job not found' });
    await Job.update(id, req.body);
    res.json({ success: true, message: 'Job updated', data: { id, ...req.body } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating job', error: error.message });
  }
};

exports.deleteJob = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await Job.getById(id);
    if (!existing) return res.status(404).json({ success: false, message: 'Job not found' });
    await Job.delete(id);
    res.json({ success: true, message: 'Job deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting job', error: error.message });
  }
};