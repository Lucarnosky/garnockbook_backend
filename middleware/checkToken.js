const jwt = require("jsonwebtoken");
const userCtrl = require("../controllers/users");
const dotenv = require("dotenv");
const { Client } = require("pg");
const { Pool } = require('pg')

dotenv.config();
exports.verifyToken = async (req, res, next) => {
  try {
    const token = req.headers["x-access-token"];
    if (!token)
      return res.status(403).json({
        message: "No token provided",
      });
    const decoded = jwt.verify(token, process.env.TOKEN_SALT);
    userId = decoded.id;
    username = decoded.username;
    const pool = new Pool({
        connectionString: process.env.DB_CONNECTION_STRING,
        ssl: {
            rejectUnauthorized: false
        }
    })
    const client = await pool.connect();
    const result = await client.query("SELECT userid FROM users WHERE userid = $1 AND username = $2", [userId,username]);
    await client.end();
    if(result.rows.length == 0){
        return res.status(403).json({
            message: "Invalid token",
        });
    }else{
        next();
    }
  } catch (error) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }
};
