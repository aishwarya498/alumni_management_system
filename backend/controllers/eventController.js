const Event = require('../models/Event');

exports.createEvent = async (req, res) => {
  try {
    const data = req.body;
    if (req.user) data.created_by = req.user.id;
    const result = await Event.create(data);
    res.status(201).json({ success: true, message: 'Event created', data: { id: result.insertId, ...data } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error creating event', error: error.message });
  }
};

exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.getAll();
    res.json({ success: true, data: events });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching events', error: error.message });
  }
};

exports.getEventById = async (req, res) => {
  try {
    const evt = await Event.getById(req.params.id);
    if (!evt) return res.status(404).json({ success: false, message: 'Event not found' });
    res.json({ success: true, data: evt });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error retrieving event', error: error.message });
  }
};

exports.updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await Event.getById(id);
    if (!existing) return res.status(404).json({ success: false, message: 'Event not found' });
    await Event.update(id, req.body);
    res.json({ success: true, message: 'Event updated', data: { id, ...req.body } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating event', error: error.message });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await Event.getById(id);
    if (!existing) return res.status(404).json({ success: false, message: 'Event not found' });
    await Event.delete(id);
    res.json({ success: true, message: 'Event deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting event', error: error.message });
  }
};