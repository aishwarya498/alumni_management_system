const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const alumniRoutes = require('./routes/alumniRoutes');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const roleRoutes = require('./routes/roleRoutes');

const app = express();
const PORT = process.env.PORT || 5000;
const User = require('./models/User');
const Role = require('./models/Role');

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/alumni', alumniRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'Backend is running' });
});

// Development-only debug route: list users (do not enable in production)
if (process.env.NODE_ENV === 'development') {
  app.get('/api/debug/users', async (req, res) => {
    try {
      const users = await User.getAll();
      res.json({ success: true, data: users });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  });
}

// Development-only: seed demo users with known passwords
if (process.env.NODE_ENV === 'development') {
  app.post('/api/debug/seed-demo-users', async (req, res) => {
    const demoAccounts = [
      { username: 'admin_user', email: 'admin@university.edu', password: 'Demo@123', first_name: 'Admin', last_name: 'User', role: 'admin' },
      { username: 'manager_user', email: 'manager@university.edu', password: 'Demo@123', first_name: 'Manager', last_name: 'User', role: 'manager' },
      { username: 'alumni_user', email: 'alumni@university.edu', password: 'Demo@123', first_name: 'Alumni', last_name: 'User', role: 'alumni' },
      { username: 'guest_user', email: 'guest@university.edu', password: 'Demo@123', first_name: 'Guest', last_name: 'User', role: 'guest' }
    ];

    try {
      const created = [];

      for (const acct of demoAccounts) {
        const existing = await User.getByUsername(acct.username);

        if (!existing) {
          // register returns result with insertId
          const result = await User.register({
            username: acct.username,
            email: acct.email,
            password: acct.password,
            confirm_password: acct.password,
            first_name: acct.first_name,
            last_name: acct.last_name,
            phone: ''
          });

          const userId = result.insertId;
          const role = await Role.getByName(acct.role);
          if (role) {
            try { await User.assignRole(userId, role.id, 1); } catch (_) {}
          }

          created.push({ username: acct.username, password: acct.password, action: 'created' });
        } else {
          // update password
          await User.setPassword(existing.id, acct.password);
          const role = await Role.getByName(acct.role);
          if (role) {
            try { await User.assignRole(existing.id, role.id, 1); } catch (_) {}
          }
          created.push({ username: acct.username, password: acct.password, action: 'updated' });
        }
      }

      res.json({ success: true, data: created });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  });
}

// Dev-only: inspect a single user (includes password_hash) — development only
if (process.env.NODE_ENV === 'development') {
  app.get('/api/debug/user/:username', async (req, res) => {
    try {
      const user = await User.getByUsername(req.params.username);
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });
      res.json({ success: true, data: user });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  });
}

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: err.message
  });
});

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
