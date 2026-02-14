const pool = require('../config/database');

class Role {
  // Create new role
  static async create(data) {
    const { name, description, permissions } = data;

    try {
      const safeDesc = description === undefined ? null : description;
      const safePermissions = permissions === undefined ? [] : permissions;

      const [result] = await pool.execute(
        'INSERT INTO roles (name, description, permissions) VALUES (?, ?, ?)',
        [name, safeDesc, JSON.stringify(safePermissions)]
      );

      return result;
    } catch (error) {
      throw error;
    }
  }

  // Get all roles
  static async getAll() {
    try {
      const [rows] = await pool.execute('SELECT * FROM roles ORDER BY name');

      // Parse permissions JSON
      return rows.map(role => ({
        ...role,
        permissions: JSON.parse(role.permissions || '[]')
      }));
    } catch (error) {
      throw error;
    }
  }

  // Get role by ID
  static async getById(id) {
    try {
      const safeId = id === undefined ? null : id;
      const [rows] = await pool.execute('SELECT * FROM roles WHERE id = ?', [safeId]);

      if (rows.length === 0) return null;

      return {
        ...rows[0],
        permissions: JSON.parse(rows[0].permissions || '[]')
      };
    } catch (error) {
      throw error;
    }
  }

  // Get role by name
  static async getByName(name) {
    try {
      const safeName = name === undefined ? null : name;
      const [rows] = await pool.execute('SELECT * FROM roles WHERE name = ?', [safeName]);

      if (rows.length === 0) return null;

      return {
        ...rows[0],
        permissions: JSON.parse(rows[0].permissions || '[]')
      };
    } catch (error) {
      throw error;
    }
  }

  // Update role
  static async update(id, data) {
    const { name, description, permissions } = data;

    try {
      const safeDesc = description === undefined ? null : description;
      const safePermissions = permissions === undefined ? [] : permissions;

      const [result] = await pool.execute(
        'UPDATE roles SET name = ?, description = ?, permissions = ? WHERE id = ?',
        [name, safeDesc, JSON.stringify(safePermissions), id]
      );

      return result;
    } catch (error) {
      throw error;
    }
  }

  // Delete role
  static async delete(id) {
    try {
      // Remove all user-role associations first
      await pool.execute('DELETE FROM user_roles WHERE role_id = ?', [id]);

      // Delete role
      const [result] = await pool.execute('DELETE FROM roles WHERE id = ?', [id]);

      return result;
    } catch (error) {
      throw error;
    }
  }

  // Get permissions for role
  static async getPermissions(roleId) {
    try {
      const safeId = roleId === undefined ? null : roleId;
      const [rows] = await pool.execute(
        'SELECT permissions FROM roles WHERE id = ?',
        [safeId]
      );

      if (rows.length === 0) return [];

      return JSON.parse(rows[0].permissions || '[]');
    } catch (error) {
      throw error;
    }
  }

  // Add permission to role
  static async addPermission(roleId, permission) {
    try {
      const safeId = roleId === undefined ? null : roleId;
      const [rows] = await pool.execute(
        'SELECT permissions FROM roles WHERE id = ?',
        [safeId]
      );

      if (rows.length === 0) {
        throw new Error('Role not found');
      }

      let permissions = JSON.parse(rows[0].permissions || '[]');

      if (!permissions.includes(permission)) {
        permissions.push(permission);

        await pool.execute(
          'UPDATE roles SET permissions = ? WHERE id = ?',
          [JSON.stringify(permissions), roleId]
        );
      }

      return permissions;
    } catch (error) {
      throw error;
    }
  }

  // Remove permission from role
  static async removePermission(roleId, permission) {
    try {
      const safeId = roleId === undefined ? null : roleId;
      const [rows] = await pool.execute(
        'SELECT permissions FROM roles WHERE id = ?',
        [safeId]
      );

      if (rows.length === 0) {
        throw new Error('Role not found');
      }

      let permissions = JSON.parse(rows[0].permissions || '[]');
      permissions = permissions.filter(p => p !== permission);

      await pool.execute(
        'UPDATE roles SET permissions = ? WHERE id = ?',
        [JSON.stringify(permissions), roleId]
      );

      return permissions;
    } catch (error) {
      throw error;
    }
  }

  // Get users with specific role
  static async getUsersByRole(roleId) {
    try {
      const safeId = roleId === undefined ? null : roleId;
      const [users] = await pool.execute(
        'SELECT u.id, u.username, u.email, u.first_name, u.last_name FROM users u INNER JOIN user_roles ur ON u.id = ur.user_id WHERE ur.role_id = ?',
        [safeId]
      );

      return users;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Role;
