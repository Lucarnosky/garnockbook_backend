const { Client } = require('pg');
const dotenv = require('dotenv');
dotenv.config();

const con = new Client({
    connectionString: process.env.DB_CONNECTION_STRING,
    ssl: {
        rejectUnauthorized: false
    }
});

con.connect();

getAllComments = (req, res, next) => {
    sql = 'SELECT * FROM post_comments WHERE "postId" = $1';
    con.query(sql, [req.params.id], function (err, result) {
        if (err)
            res.json({ status: "false", message: "Error occured" });
        res.json({ status: "true", totalPosts: result.rows.length,results: result.rows });
    });
}

module.exports = { getAllComments };