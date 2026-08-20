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
    await connection.end();
  } catch (error) {
    console.error('❌ Failed to import database:', error.message);
  }
}

importSQL();
