const mysql = require("mysql2");

const pool = mysql.createPool({
  host: process.env.DB_HOST || "82.112.238.13",
  user: process.env.DB_USER || "newuser",
  database: process.env.DB_NAME || "cms",
  password: process.env.DB_PASSWORD || "qwerty",
});

function query(queryString, callback) {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error establishing database connection:", err);
      callback(err, null);
      return;
    }
    connection.query(queryString, (err, results) => {
      connection.release();

      if (err) {
        console.error("Error executing database query:", err);
        callback(err, null);
        return;
      }
      callback(null, results);
    });
  });
}
module.exports = {
  query,
};
