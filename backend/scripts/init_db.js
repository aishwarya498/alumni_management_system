const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config();

(async () => {
  try {
    const sqlPath = path.join(__dirname, '..', 'alumni_schema.sql');
    const sql = fs.readFileSync(sqlPath, { encoding: 'utf8' });

    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      multipleStatements: true
    });

    console.log('Connecting to MySQL...');
    await connection.query(sql);
    console.log('Database schema applied successfully.');
    await connection.end();
  } catch (err) {
    console.error('Failed to initialize database:', err.message || err);
    process.exit(1);
  }
})();
