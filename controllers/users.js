const { Pool } = require('pg');
const dotenv = require('dotenv');
dotenv.config();

const con = new Pool({
  connectionString: process.env.DB_CONNECTION_STRING,
  ssl: {
    rejectUnauthorized: false
  }
});

con.connect();

/**
 * Need a fix for this
 */
newUser = (req, res, next) => {
  const { username, password, firstName, lastName } = req.body;
  var sql = 'INSERT INTO users (username, password,"firstName","lastName") VALUES ($1,$2,$3,$4)';
  con.query(sql, [username, password, firstName, lastName])
    .then(result => {
      res.json({ status: "true", results: result.insertId });
    })
    .catch(err => {
      res.json({ status: "false", message: "Error occured: " + err });
    });
};

getUsers = (req, res, next) => {
  con.query("SELECT * FROM users")
    .then(result => {
      res.json({ status: "true", results: result.rows });
    })
    .catch(err => {
      res.json({ status: "false", message: "Error occured" });
    });
};

logInUser = (req, res, next) => {
  const { username, password } = req.body;
  var sql = 'SELECT * FROM users WHERE username = $1';
  con.query(sql, [username])
    .then(result => {
      if (result.rowCount > 0) {
        if (result.rows[0].password == password) {
          res.json({ message: "User logged in" });
        } else {
          res.json({ message: "Wrong password" });
        }
      } else {
        res.json({ message: "User not found" });
      }
    })
    .catch(err => {
      res.json({ message: "Error occured "+err });
    })
};

module.exports = { newUser, getUsers, logInUser };