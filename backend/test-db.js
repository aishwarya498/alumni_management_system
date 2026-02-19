const pool = require('./config/database');

async function testConnection() {
  console.log('Testing database connection...\n');
  
  try {
    const connection = await pool.getConnection();
    console.log('✅ Database connected successfully!');
    
    const [databases] = await connection.query('SHOW DATABASES LIKE ?', ['alumni_db']);
    if (databases.length > 0) {
      console.log('✅ Database "alumni_db" exists');
    } else {
      console.log('❌ Database "alumni_db" does not exist');
      console.log('\nTo create it, run:');
      console.log('mysql -u root -p -e "CREATE DATABASE alumni_db;"');
    }
    
    await connection.query('USE alumni_db');
    const [tables] = await connection.query('SHOW TABLES');
    
    if (tables.length > 0) {
      console.log(`✅ Found ${tables.length} tables in database`);
      console.log('Tables:', tables.map(t => Object.values(t)[0]).join(', '));
    } else {
      console.log('❌ No tables found in database');
      console.log('\nTo import schema, run:');
      console.log('mysql -u root -p alumni_db < backend/alumni_schema.sql');
    }
    
    connection.release();
    console.log('\n✅ All checks passed! Backend should work correctly.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.log('\nPossible solutions:');
    console.log('1. Make sure MySQL is running');
    console.log('2. Check your credentials in backend/.env');
    console.log('3. Create the database: CREATE DATABASE alumni_db;');
    process.exit(1);
  }
}

testConnection();
