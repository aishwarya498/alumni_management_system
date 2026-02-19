const pool = require('../config/database');

class Job {
  static async create(data) {
    const { title, description, company, location, posted_by } = data;
    try {
      const safe = (v) => (v === undefined ? null : v);
      const [result] = await pool.execute(
        'INSERT INTO jobs (title, description, company, location, posted_by) VALUES (?, ?, ?, ?, ?)',
        [safe(title), safe(description), safe(company), safe(location), safe(posted_by)]
      );
      return result;
    } catch (error) {
      throw error;
    }
  }

  static async getAll() {
    try {
      const [rows] = await pool.execute('SELECT * FROM jobs ORDER BY created_at DESC');
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async getById(id) {
    try {
      const [rows] = await pool.execute('SELECT * FROM jobs WHERE id = ?', [id]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async update(id, data) {
    const { title, description, company, location } = data;
    try {
      const safe = (v) => (v === undefined ? null : v);
      const [result] = await pool.execute(
        'UPDATE jobs SET title = ?, description = ?, company = ?, location = ?, updated_at = NOW() WHERE id = ?',
        [safe(title), safe(description), safe(company), safe(location), id]
      );
      return result;
    } catch (error) {
      throw error;
    }
  }

  static async delete(id) {
    try {
      const [result] = await pool.execute('DELETE FROM jobs WHERE id = ?', [id]);
      return result;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Job;
