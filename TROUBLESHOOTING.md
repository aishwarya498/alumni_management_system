# Troubleshooting Guide - Backend Crash

## Common Issues and Solutions

### 1. MySQL Database Not Running

**Symptoms:** Backend crashes immediately with database connection errors

**Solution:**
- **Windows:** Start MySQL from Services or XAMPP/WAMP control panel
- **Mac:** `brew services start mysql` or start from System Preferences
- **Linux:** `sudo systemctl start mysql`

### 2. Database Doesn't Exist

**Symptoms:** Error message about database not found

**Solution:**
```bash
# Connect to MySQL
mysql -u root -p

# Create the database
CREATE DATABASE alumni_db;

# Import the schema
USE alumni_db;
SOURCE backend/alumni_schema.sql;

# Exit MySQL
EXIT;
```

Or use this command directly:
```bash
mysql -u root -p alumni_db < backend/alumni_schema.sql
```

### 3. Wrong Database Password

**Symptoms:** Access denied errors

**Solution:**
- Edit `backend/.env` file
- Update `DB_PASSWORD` with your MySQL root password
- If you don't have a password, leave it empty: `DB_PASSWORD=`

### 4. Missing Node Modules

**Symptoms:** Module not found errors

**Solution:**
```bash
cd backend
npm install
```

### 5. Port Already in Use

**Symptoms:** Error: Port 5000 is already in use

**Solution:**
- Change the port in `backend/.env`: `PORT=5001`
- Or kill the process using port 5000:
  - Windows: `netstat -ano | findstr :5000` then `taskkill /PID <PID> /F`
  - Mac/Linux: `lsof -ti:5000 | xargs kill -9`

## Quick Start Steps

1. **Start MySQL Server**
   - Make sure MySQL is running on your system

2. **Create Database**
   ```bash
   mysql -u root -p
   CREATE DATABASE alumni_db;
   EXIT;
   ```

3. **Import Schema**
   ```bash
   mysql -u root -p alumni_db < backend/alumni_schema.sql
   ```

4. **Install Dependencies**
   ```bash
   cd backend
   npm install
   ```

5. **Configure Environment**
   - Edit `backend/.env` with your MySQL credentials

6. **Start Backend**
   ```bash
   cd backend
   npm run dev
   ```

7. **Start Frontend** (in a new terminal)
   ```bash
   cd frontend
   npm start
   ```

## Checking Backend Status

To see detailed error messages:

```bash
cd backend
node server.js
```

This will show you the exact error causing the crash.

## Database Connection Test

Create a test file `backend/test-db.js`:

```javascript
const pool = require('./config/database');

async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Database connected successfully!');
    connection.release();
    process.exit(0);
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1);
  }
}

testConnection();
```

Run it:
```bash
cd backend
node test-db.js
```

## Still Having Issues?

1. Check if MySQL is running: `mysql -u root -p`
2. Verify database exists: `SHOW DATABASES;`
3. Check tables exist: `USE alumni_db; SHOW TABLES;`
4. Review backend logs for specific error messages
5. Ensure all environment variables are set correctly in `.env`

## Contact Support

If issues persist, provide:
- Error message from backend console
- MySQL version: `mysql --version`
- Node version: `node --version`
- Operating system
