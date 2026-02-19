const pool = require('../config/database');

class Event {
  static async create(data) {
    const { name, description, event_date, location, created_by } = data;
    try {
      const safe = (v) => (v === undefined ? null : v);
      const [result] = await pool.execute(
        'INSERT INTO events (name, description, event_date, location, created_by) VALUES (?, ?, ?, ?, ?)',
        [safe(name), safe(description), safe(event_date), safe(location), safe(created_by)]
      );
      return result;
    } catch (error) {
      throw error;
    }
  }

  static async getAll() {
    try {
      const [rows] = await pool.execute('SELECT * FROM events ORDER BY event_date DESC');
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async getById(id) {
    try {
      const [rows] = await pool.execute('SELECT * FROM events WHERE id = ?', [id]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async update(id, data) {
    const { name, description, event_date, location } = data;
    try {
      const safe = (v) => (v === undefined ? null : v);
      const [result] = await pool.execute(
        'UPDATE events SET name = ?, description = ?, event_date = ?, location = ?, updated_at = NOW() WHERE id = ?',
        [safe(name), safe(description), safe(event_date), safe(location), id]
      );
      return result;
    } catch (error) {
      throw error;
    }
  }

  static async delete(id) {
    try {
      const [result] = await pool.execute('DELETE FROM events WHERE id = ?', [id]);
      return result;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Event;
