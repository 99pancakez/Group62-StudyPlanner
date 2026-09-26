const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
const config = require('./src/database/config'); 

async function importSQL() {
  try {

    const connection = await mysql.createConnection({
      host: config.HOST,
      user: config.USER,
      password: config.PASSWORD,
      port: config.PORT,
      multipleStatements: true,
    });

    console.log('⏳ Reinitializing database...');

    // Drop and recreate the database
    await connection.query(`DROP DATABASE IF EXISTS \`${config.DB}\`;`);
    await connection.query(`CREATE DATABASE \`${config.DB}\`;`);
    await connection.changeUser({ database: config.DB });

    // Read and execute SQL dump
    const sql = fs.readFileSync(path.join(__dirname, 'cs.sql'), 'utf8');
    await connection.query(sql);

    console.log('✅ Database imported successfully!');

    // import summer semester from sim file, so not hard coded. in future if database is publically hosted, 
    // this will jujst be in another table that the admin/uni can cycle it in

    const rows = fs.readFileSync(path.join(__dirname, 'simulatedSummerCourses.txt'), 'utf8')
      .split('\n')
      .map(line => line.trim())
      .filter(Boolean)
      .map(courseId => [courseId, 3]);

    if (rows.length > 0) {
      const placeholders = rows.map(() => '(?, ?)').join(', ');
      const flatValues = rows.flat();

      await connection.query(
        `INSERT INTO course_availability VALUES ${placeholders}`,
        flatValues
      );
    
    }


    await connection.end();
  } catch (error) {
    console.error('❌ Failed to import database:', error.message);
  }
}

importSQL();
