const Alumni = require('../models/Alumni');

// Create alumni
exports.createAlumni = async (req, res) => {
  try {
    const data = req.body;
    // Add user_id if authenticated
    if (req.user) {
      data.user_id = req.user.id;
      data.created_by = req.user.id;
    }
    
    const result = await Alumni.create(data);
    res.status(201).json({
      success: true,
      message: 'Alumni profile created successfully',
      data: { id: result.insertId, ...data }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating alumni profile',
      error: error.message
    });
  }
};

// Get all alumni
exports.getAllAlumni = async (req, res) => {
  try {
    const alumni = await Alumni.getAll();
    res.status(200).json({
      success: true,
      message: 'Alumni retrieved successfully',
      data: alumni
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving alumni',
      error: error.message
    });
  }
};

// Get alumni by ID
exports.getAlumniById = async (req, res) => {
  try {
    const { id } = req.params;
    const alumnus = await Alumni.getById(id);
    
    if (!alumnus) {
      return res.status(404).json({
        success: false,
        message: 'Alumni not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Alumni retrieved successfully',
      data: alumnus
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving alumni',
      error: error.message
    });
  }
};

// Search alumni
exports.searchAlumni = async (req, res) => {
  try {
    const { searchTerm } = req.query;

    if (!searchTerm) {
      return res.status(400).json({
        success: false,
        message: 'Search term is required'
      });
    }

    const results = await Alumni.search(searchTerm);
    res.status(200).json({
      success: true,
      message: 'Search completed successfully',
      data: results
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error searching alumni',
      error: error.message
    });
  }
};

// Update alumni
exports.updateAlumni = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    // Check if alumni exists
    const alumnus = await Alumni.getById(id);
    if (!alumnus) {
      return res.status(404).json({
        success: false,
        message: 'Alumni not found'
      });
    }

    const result = await Alumni.update(id, data);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Alumni not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Alumni profile updated successfully',
      data: { id, ...data }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating alumni profile',
      error: error.message
    });
  }
};

// Delete alumni
exports.deleteAlumni = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if alumni exists
    const alumnus = await Alumni.getById(id);
    if (!alumnus) {
      return res.status(404).json({
        success: false,
        message: 'Alumni not found'
      });
    }

    const result = await Alumni.delete(id);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Alumni not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Alumni profile deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting alumni profile',
      error: error.message
    });
  }
};

// Get statistics
exports.getStatistics = async (req, res) => {
  try {
    const stats = await Alumni.getStatistics();
    res.status(200).json({
      success: true,
      message: 'Statistics retrieved successfully',
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving statistics',
      error: error.message
    });
  }
};
