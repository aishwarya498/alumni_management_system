const pool = require('../config/database');

class Story {
  static async create(data) {
    const { title, content, author_name, created_by } = data;
    try {
      const safe = (v) => (v === undefined ? null : v);
      const [result] = await pool.execute(
        'INSERT INTO stories (title, content, author_name, created_by) VALUES (?, ?, ?, ?)',
        [safe(title), safe(content), safe(author_name), safe(created_by)]
      );
      return result;
    } catch (error) {
      throw error;
    }
  }

  static async getAll() {
    try {
      const [rows] = await pool.execute('SELECT * FROM stories ORDER BY created_at DESC');
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async getById(id) {
    try {
      const [rows] = await pool.execute('SELECT * FROM stories WHERE id = ?', [id]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async update(id, data) {
    const { title, content, author_name } = data;
    try {
      const safe = (v) => (v === undefined ? null : v);
      const [result] = await pool.execute(
        'UPDATE stories SET title = ?, content = ?, author_name = ?, updated_at = NOW() WHERE id = ?',
        [safe(title), safe(content), safe(author_name), id]
      );
      return result;
    } catch (error) {
      throw error;
    }
  }

  static async delete(id) {
    try {
      const [result] = await pool.execute('DELETE FROM stories WHERE id = ?', [id]);
      return result;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Story;