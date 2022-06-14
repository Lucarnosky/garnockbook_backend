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

getPostComments = (req, res, next) => {
    sql = 'SELECT "postText","postedOn","firstName","lastName","username" FROM post_comments JOIN users ON users.userId = post_comments."postedBy" WHERE "postId" = $1 AND visible = true';
    con.query(sql, [req.params.id], function (err, result) {
        if (err)
            res.json({ status: "false", message: "Error occured" });
        res.json({ status: "true", totalPosts: result.rows.length,results: result.rows });
    });
}

deletePostComment = (req, res, next) => {
    sql = "UPDATE posts SET visible = false WHERE postId = $1";
    con.query(sql, [req.params.id], function (err, result) {
        if (err)
            res.json({ status: "false", message: "Error occured " + err });
        res.json({ status: "true", message: "Post deleted" });
    });
}




module.exports = {getPostComments,deletePostComment};