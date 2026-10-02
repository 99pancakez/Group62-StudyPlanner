const mysql = require("mysql2/promise");
const fs = require("fs");
const path = require("path");
const config = require("./src/database/config");

async function importSQL() {
  let connection;

  try {
    connection = await mysql.createConnection({
      host: config.HOST,
      user: config.USER,
      password: config.PASSWORD,
      port: config.PORT,
      multipleStatements: true,
    });

    console.log("⏳ Reinitializing database...");

    // Drop and recreate the database
    await connection.query(`DROP DATABASE IF EXISTS \`${config.DB}\`;`);
    await connection.query(`CREATE DATABASE \`${config.DB}\`;`);
    await connection.changeUser({ database: config.DB });

    // Read and execute SQL dump
    const sql = fs.readFileSync(
      path.join(__dirname, "cs_coreq_dump.sql"),
      "utf8",
    );
    await connection.query(sql);

    console.log("✅ Database imported successfully!");

    // import summer semester from sim file, so not hard coded. in future if database is publically hosted,
    // this will jujst be in another table that the admin/uni can cycle it in

    console.log("attempting to load summer semester classes")
    const rows = fs
      .readFileSync(path.join(__dirname, "simulatedSummerCourses.txt"), "utf8")
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((courseId) => [courseId, 3]);

    if (rows.length > 0) {
      const placeholders = rows.map(() => "(?, ?)").join(", ");
      const flatValues = rows.flat();

      // INSERT IGNORE: the dump now seeds semester 3, so re-imports must not
      // raise ER_DUP_ENTRY against the (course_id, semester_id) primary key.
      console.log("awaiting query")
      await connection.query(
        `INSERT IGNORE INTO course_availability (course_id, semester_id) VALUES ${placeholders}`,
        flatValues,
      );
      console.log("summer semester inserted")
    }
  } catch (error) {
    console.error("❌ Failed to import database:", error.message);
  } finally {
    if (connection) await connection.end();
  }
}

importSQL();
