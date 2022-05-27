const mariadb = require("mariadb");

const pool = mariadb.createPool({
  host: "us-cdbr-east-05.cleardb.net",
  user: "beaeb16c34cdd4",
  password: "0e45828b",
  database: "heroku_9da7f8b5cbdaffa",
  port: 3306,
  connectionLimit: 5,
});

// Connect and check for errors
pool.getConnection((err, connection) => {
  if (err) {
    if (err.code === "PROTOCOL_CONNECTION_LOST") {
      console.error("Database connection lost");
    }
    if (err.code === "ER_CON_COUNT_ERROR") {
      console.error("Database has too many connection");
    }
    if (err.code === "ECONNREFUSED") {
      console.error("Database connection was refused");
    }
  }
  if (connection) connection.release();
  return;
});

module.exports = pool;
