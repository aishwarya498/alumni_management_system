const pool = require('../config/database');

class Alumni {
  // Create new alumni record
  static async create(data) {
    const { first_name, last_name, email, phone, graduation_year, degree, field_of_study, current_company, current_position, city, country } = data;
    
    try {
      const safe = (v) => (v === undefined ? null : v);
      const [result] = await pool.execute(
        'INSERT INTO alumni (first_name, last_name, email, phone, graduation_year, degree, field_of_study, current_company, current_position, city, country) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [safe(first_name), safe(last_name), safe(email), safe(phone), safe(graduation_year), safe(degree), safe(field_of_study), safe(current_company), safe(current_position), safe(city), safe(country)]
      );
      return result;
    } catch (error) {
      throw error;
    }
  }

  // Get all alumni
  static async getAll() {
    try {
      const [rows] = await pool.execute('SELECT * FROM alumni ORDER BY created_at DESC');
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Get alumnus by ID
  static async getById(id) {
    try {
      const safeId = id === undefined ? null : id;
      const [rows] = await pool.execute('SELECT * FROM alumni WHERE id = ?', [safeId]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Get alumni by search term
  static async search(searchTerm) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM alumni WHERE CONCAT(first_name, " ", last_name) LIKE ? OR email LIKE ? OR current_company LIKE ? ORDER BY created_at DESC',
        [`%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Update alumni record
  static async update(id, data) {
    const { first_name, last_name, email, phone, graduation_year, degree, field_of_study, current_company, current_position, city, country } = data;
    
    try {
      const safe = (v) => (v === undefined ? null : v);
      const [result] = await pool.execute(
        'UPDATE alumni SET first_name = ?, last_name = ?, email = ?, phone = ?, graduation_year = ?, degree = ?, field_of_study = ?, current_company = ?, current_position = ?, city = ?, country = ?, updated_at = NOW() WHERE id = ?',
        [safe(first_name), safe(last_name), safe(email), safe(phone), safe(graduation_year), safe(degree), safe(field_of_study), safe(current_company), safe(current_position), safe(city), safe(country), id]
      );
      return result;
    } catch (error) {
      throw error;
    }
  }

  // Delete alumni record
  static async delete(id) {
    try {
      const [result] = await pool.execute('DELETE FROM alumni WHERE id = ?', [id]);
      return result;
    } catch (error) {
      throw error;
    }
  }

  // Get statistics
  static async getStatistics() {
    try {
      const [stats] = await pool.execute(
        'SELECT COUNT(*) as totalAlumni, YEAR(created_at) as year FROM alumni GROUP BY YEAR(created_at) ORDER BY year DESC'
      );
      return stats;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Alumni;
