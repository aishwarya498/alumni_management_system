const pool = require('../config/database');

class Feedback {
  static async create(data) {
    const { user_id, message, status } = data;
    try {
      const safe = (v) => (v === undefined ? null : v);
      const [result] = await pool.execute(
        'INSERT INTO feedback (user_id, message, status) VALUES (?, ?, ?)',
        [safe(user_id), safe(message), safe(status)]
      );
      return result;
    } catch (error) {
      throw error;
    }
  }

  static async getAll() {
    try {
      const [rows] = await pool.execute('SELECT * FROM feedback ORDER BY created_at DESC');
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async getById(id) {
    try {
      const [rows] = await pool.execute('SELECT * FROM feedback WHERE id = ?', [id]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async update(id, data) {
    const { message, response, status } = data;
    try {
      const safe = (v) => (v === undefined ? null : v);
      const [result] = await pool.execute(
        'UPDATE feedback SET message = ?, response = ?, status = ?, updated_at = NOW() WHERE id = ?',
        [safe(message), safe(response), safe(status), id]
      );
      return result;
    } catch (error) {
      throw error;
    }
  }

  static async delete(id) {
    try {
      const [result] = await pool.execute('DELETE FROM feedback WHERE id = ?', [id]);
      return result;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Feedback;
