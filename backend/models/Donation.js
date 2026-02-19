const pool = require('../config/database');

class Donation {
  static async create(data) {
    const { campaign_name, description, goal_amount, start_date, end_date, created_by } = data;
    try {
      const safe = (v) => (v === undefined ? null : v);
      const [result] = await pool.execute(
        'INSERT INTO donations (campaign_name, description, goal_amount, start_date, end_date, created_by) VALUES (?, ?, ?, ?, ?, ?)',
        [safe(campaign_name), safe(description), safe(goal_amount), safe(start_date), safe(end_date), safe(created_by)]
      );
      return result;
    } catch (error) {
      throw error;
    }
  }

  static async getAll() {
    try {
      const [rows] = await pool.execute('SELECT * FROM donations ORDER BY created_at DESC');
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async getById(id) {
    try {
      const [rows] = await pool.execute('SELECT * FROM donations WHERE id = ?', [id]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async update(id, data) {
    const { campaign_name, description, goal_amount, start_date, end_date, collected_amount } = data;
    try {
      const safe = (v) => (v === undefined ? null : v);
      const [result] = await pool.execute(
        'UPDATE donations SET campaign_name = ?, description = ?, goal_amount = ?, start_date = ?, end_date = ?, collected_amount = ?, updated_at = NOW() WHERE id = ?',
        [safe(campaign_name), safe(description), safe(goal_amount), safe(start_date), safe(end_date), safe(collected_amount), id]
      );
      return result;
    } catch (error) {
      throw error;
    }
  }

  static async delete(id) {
    try {
      const [result] = await pool.execute('DELETE FROM donations WHERE id = ?', [id]);
      return result;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Donation;
