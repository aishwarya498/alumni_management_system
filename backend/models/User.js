const pool = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  // Register new user
  static async register(userData) {
    const { username, email, password, first_name, last_name, phone } = userData;

    try {
      // Check if user exists
      const [existingUser] = await pool.execute(
        'SELECT id FROM users WHERE email = ? OR username = ?',
        [email, username]
      );

      if (existingUser.length > 0) {
        throw new Error('User already exists with this email or username');
      }

      // Hash password
      const saltRounds = 10;
      const password_hash = await bcrypt.hash(password, saltRounds);

      // Create user
      const safeFirst = first_name === undefined ? null : first_name;
      const safeLast = last_name === undefined ? null : last_name;
      const safePhone = phone === undefined ? null : phone;

      const [result] = await pool.execute(
        'INSERT INTO users (username, email, password_hash, first_name, last_name, phone) VALUES (?, ?, ?, ?, ?, ?)',
        [username, email, password_hash, safeFirst, safeLast, safePhone]
      );

      return result;
    } catch (error) {
      throw error;
    }
  }

  // Login user
  static async login(username, password) {
    try {
      // Find user
      const [users] = await pool.execute(
        'SELECT u.*, GROUP_CONCAT(r.name) as roles FROM users u LEFT JOIN user_roles ur ON u.id = ur.user_id LEFT JOIN roles r ON ur.role_id = r.id WHERE u.username = ? AND u.is_active = TRUE GROUP BY u.id',
        [username]
      );

      if (users.length === 0) {
        throw new Error('User not found');
      }

      const user = users[0];

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password_hash);
      if (!isPasswordValid) {
        throw new Error('Invalid password');
      }

      return user;
    } catch (error) {
      throw error;
    }
  }

  // Get user by ID
  static async getById(id) {
    try {
      const safeId = id === undefined ? null : id;
      const [users] = await pool.execute(
        'SELECT u.id, u.username, u.email, u.first_name, u.last_name, u.phone, u.is_active, GROUP_CONCAT(r.name) as roles FROM users u LEFT JOIN user_roles ur ON u.id = ur.user_id LEFT JOIN roles r ON ur.role_id = r.id WHERE u.id = ? GROUP BY u.id',
        [safeId]
      );

      const user = users[0];
      if (!user) return null;
      // Normalize roles to array
      return {
        ...user,
        roles: user.roles ? user.roles.split(',') : []
      };
    } catch (error) {
      throw error;
    }
  }

  // Get user by username
  static async getByUsername(username) {
    try {
      const safeUsername = username === undefined ? null : username;
      const [users] = await pool.execute(
        'SELECT * FROM users WHERE username = ?',
        [safeUsername]
      );

      return users.length ? users[0] : null;
    } catch (error) {
      throw error;
    }
  }

  // Set user password (hashes new password)
  static async setPassword(userId, newPassword) {
    try {
      const saltRounds = 10;
      const password_hash = await bcrypt.hash(newPassword, saltRounds);
      const [result] = await pool.execute(
        'UPDATE users SET password_hash = ? WHERE id = ?',
        [password_hash, userId]
      );
      return result;
    } catch (error) {
      throw error;
    }
  }

  // Get all users
  static async getAll() {
    try {
      const [users] = await pool.execute(
        'SELECT u.id, u.username, u.email, u.first_name, u.last_name, u.is_active, GROUP_CONCAT(r.name) as roles, u.created_at FROM users u LEFT JOIN user_roles ur ON u.id = ur.user_id LEFT JOIN roles r ON ur.role_id = r.id GROUP BY u.id ORDER BY u.created_at DESC'
      );

      // Normalize roles to arrays
      return users.map(u => ({
        ...u,
        roles: u.roles ? u.roles.split(',') : []
      }));
    } catch (error) {
      throw error;
    }
  }

  // Update user
  static async update(id, userData) {
    const { first_name, last_name, phone, is_active } = userData;

    try {
      const safeFirst = first_name === undefined ? null : first_name;
      const safeLast = last_name === undefined ? null : last_name;
      const safePhone = phone === undefined ? null : phone;
      const safeActive = is_active === undefined ? null : is_active;

      const [result] = await pool.execute(
        'UPDATE users SET first_name = ?, last_name = ?, phone = ?, is_active = ?, updated_at = NOW() WHERE id = ?',
        [safeFirst, safeLast, safePhone, safeActive, id]
      );

      return result;
    } catch (error) {
      throw error;
    }
  }

  // Delete user
  static async delete(id) {
    try {
      const [result] = await pool.execute('DELETE FROM users WHERE id = ?', [id]);
      return result;
    } catch (error) {
      throw error;
    }
  }

  // Assign role to user
  static async assignRole(userId, roleId, assignedBy) {
    try {
      const [result] = await pool.execute(
        'INSERT INTO user_roles (user_id, role_id, assigned_by) VALUES (?, ?, ?)',
        [userId, roleId, assignedBy]
      );

      return result;
    } catch (error) {
      throw error;
    }
  }

  // Remove role from user
  static async removeRole(userId, roleId) {
    try {
      const [result] = await pool.execute(
        'DELETE FROM user_roles WHERE user_id = ? AND role_id = ?',
        [userId, roleId]
      );

      return result;
    } catch (error) {
      throw error;
    }
  }

  // Get user roles
  static async getUserRoles(userId) {
    try {
      const [roles] = await pool.execute(
        'SELECT r.id, r.name, r.description FROM roles r INNER JOIN user_roles ur ON r.id = ur.role_id WHERE ur.user_id = ?',
        [userId]
      );

      return roles;
    } catch (error) {
      throw error;
    }
  }

  // Change password
  static async changePassword(userId, oldPassword, newPassword) {
    try {
      // Get current password hash
      const [users] = await pool.execute(
        'SELECT password_hash FROM users WHERE id = ?',
        [userId]
      );

      if (users.length === 0) {
        throw new Error('User not found');
      }

      // Verify old password
      const isValid = await bcrypt.compare(oldPassword, users[0].password_hash);
      if (!isValid) {
        throw new Error('Old password is incorrect');
      }

      // Hash new password
      const saltRounds = 10;
      const newHashPassword = await bcrypt.hash(newPassword, saltRounds);

      // Update password
      const [result] = await pool.execute(
        'UPDATE users SET password_hash = ?, updated_at = NOW() WHERE id = ?',
        [newHashPassword, userId]
      );

      return result;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = User;
