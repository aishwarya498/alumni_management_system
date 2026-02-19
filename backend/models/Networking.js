const pool = require('../config/database');

class Networking {
  static async create(data) {
    const { user_id, title, content } = data;
    try {
      const safe = (v) => (v === undefined ? null : v);
      const [result] = await pool.execute(
        'INSERT INTO networking_posts (user_id, title, content) VALUES (?, ?, ?)',
        [safe(user_id), safe(title), safe(content)]
      );
      return result;
    } catch (error) {
      throw error;
    }
  }

  static async getAll() {
    try {
      const [rows] = await pool.execute('SELECT * FROM networking_posts ORDER BY created_at DESC');
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async getById(id) {
    try {
      const [rows] = await pool.execute('SELECT * FROM networking_posts WHERE id = ?', [id]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async update(id, data) {
    const { title, content } = data;
    try {
      const safe = (v) => (v === undefined ? null : v);
      const [result] = await pool.execute(
        'UPDATE networking_posts SET title = ?, content = ?, updated_at = NOW() WHERE id = ?',
        [safe(title), safe(content), id]
      );
      return result;
    } catch (error) {
      throw error;
    }
  }

  static async delete(id) {
    try {
      const [result] = await pool.execute('DELETE FROM networking_posts WHERE id = ?', [id]);
      return result;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Networking;
