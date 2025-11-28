require("dotenv").config();
const sqlite3 = require("sqlite3").verbose();
const DBSOURCE = process.env.DB_SOURCE || "direc.db";

const db = new sqlite3.Database(DBSOURCE, (err) => {
  if (err) {
    console.error(err.message);
    throw err;
  } else {
    console.log("Connected to the SQLite database.");

    db.serialize(() => {
      console.log("Running database setup...");

      // ==============================
      // TABLE DIRECTORS
      // ==============================
      db.run(
        `CREATE TABLE IF NOT EXISTS directors (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            nationality TEXT NOT NULL,
            birthYear INTEGER NOT NULL
        )`,
        (err) => {
          if (err) {
            console.error("Error creating directors table:", err.message);
            return;
          }
          console.log('Table "directors" is ready.');

          const sql_check = `SELECT COUNT(*) as count FROM directors`;

          db.get(sql_check, (err, row) => {
            if (err) {
              console.error("Error checking directors table:", err.message);
              return;
            }

            // Jika kosong → seed data awal
            if (row.count === 0) {
              console.log("Table is empty, seeding initial director data...");
              const sql_insert = `INSERT INTO directors (name, nationality, birthYear) VALUES (?,?,?)`;

              db.run(sql_insert, ["Christopher Nolan", "United Kingdom", 1970]);
              db.run(sql_insert, ["Bong Joon-ho", "South Korea", 1969]);
              db.run(sql_insert, ["Quentin Tarantino", "United States", 1963]);
              db.run(sql_insert, ["Hayao Miyazaki", "Japan", 1941]);

              console.log("Initial director data seeded.");
            }
          });
        }
      );

      // ==============================
      // TABLE USERS
      // ==============================
      db.run(
        `CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL,
            role TEXT NOT NULL DEFAULT 'user'
        )`,
        (err) => {
          if (err) {
            console.error("Error creating users table:", err.message);
            return;
          }
          console.log('Table "users" is ready.');
        }
      );
    });
  }
});

module.exports = db;
  