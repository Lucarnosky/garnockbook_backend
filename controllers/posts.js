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

getPost = (req, res, next,postId = 0) => {
    if(postId == 0)
        postId = req.params.id;
    sql = 'SELECT * FROM posts WHERE "postId" = $1';
    con.query(sql, [postId])
        .then(postData => {
            if (postData.rowCount > 0) {
                sql = 'SELECT COUNT(*) as totalLikes FROM posts_likes WHERE "postId" = $1';
                con.query(sql, [postId])
                    .then(postStats => {
                        if (postStats.rowCount > 0) {
                            sql = 'SELECT users."username" FROM posts_likes JOIN users ON users."userid" = posts_likes."userId" WHERE "postId" = $1';
                            con.query(sql, [postId])
                                .then(result => {
                                    if (result.rowCount > 0) {
                                        postStats.rows[0]["userLiked"] = result.rows;
                                        res.json({ status: "true", message: "Post retrieved successfully", results: { postData: postData.rows, postStats: postStats.rows } });
                                    } else {
                                        res.json({ status: "true", message: "Post retrieved successfully", results: { postData: postData.rows, postStats: postStats.rows } });
                                    }
                                })
                                .catch(err => {
                                    res.json({ status: "false", message: "Error occured: " + err });
                                });
                        } else {
                            res.json({ status: "true", message: "Post retrieved successfully", results: { postData: postData.rows, postStats: postStats.rows } });
                        }
                    })
                    .catch(err => {
                        res.json({ status: "false", message: "Error occured: " + err });
                    });
            } else {
                res.json({ status: "false", message: "Post not found" });
            }
        })
        .catch(err => {
            res.json({ status: "false", message: "Error occured: " + err });
        });
};


getUserPost = (req, res, next) => {
    const  userId  = req.params.id;
    sql = 'SELECT * FROM posts WHERE "userId" = $1';
    con.query(sql, [userId])
        .then(result => {
            res.json({ status: "true", results: result.rows });
        })
        .catch(err => {
            res.json({ status: "false", message: "Error occured " + err });
        });
};

insertPost = (req, res, next) => {
    const { userId, image, content } = req.body;
    sql = 'INSERT INTO posts ("userId", "image","content") VALUES ($1, $2, $3)';
    con.query(sql, [userId, image, content])
        .then(result => {
            res.json({ status: "true", results: result.insertId });
        })
        .catch(err => {
            res.json({ status: "false", message: "Error occured " + err });
        });
};

updatePost = (req, res, next) => {
    const { userId, image, content } = req.body;
    sql = 'UPDATE posts SET "userId" = $1, "image" = $2, "content" = $3 WHERE "postId" = $4';
    con.query(sql, [userId, image, content, req.params.id])
        .then(result => {
            res.json({ status: "true", message: "Post updated" });
        })
        .catch(err => {
            res.json({ status: "false", message: "Error occured " + err });
        });
};

getPostLikesQty = (req, res, next) => {
    sql = 'SELECT COUNT(*) as totalLikes FROM posts_likes WHERE "postId" = $1';
    con.query(sql, req.params.id, function (err, result) {
        if (err)
            res.json({ status: "false", message: "Error occured" });
        res.json({ status: "true", results: result.rows });
    });
};

toggleLike = (req, res, next) => {
    sql = 'SELECT * FROM posts_likes WHERE "postId" = $1 AND "userId" = $2';
    con.query(sql, [req.body.postId, req.body.userId], function (err, result) {
        if (err)
            res.json({ status: "false", message: "Error occured" });
        if (result.length > 0) {
            sql = 'DELETE FROM posts_likes WHERE "postId" = $1 AND "userId" = $2';
            con.query(sql, [req.body.postId, req.body.userId], function (err, result) {
                if (err)
                    res.json({ status: "false", message: "Error occured" });
                res.json({ status: "true", message: "Post unliked" });
            });
        } else {
            /**
            * Need a fix for this
            */
            sql = 'INSERT INTO posts_likes SET ?';
            con.query(sql, req.body, function (err, result) {
                if (err)
                    res.json({ status: "false", message: "Error occured" });
                res.json({ status: "true", results: "Post liked" });
            });
        }
    });
};

getPostComments = (req, res, next) => {
    sql = 'SELECT "postText","postedOn","firstName","lastName","username" FROM post_comments JOIN users ON users.userId = post_comments."postedBy" WHERE "postId" = $1 AND visible = true';
    con.query(sql, [req.params.id], function (err, result) {
        if (err)
            res.json({ status: "false", message: "Error occured" });
        res.json({ status: "true", totalPosts: result.rows.length,results: result.rows });
    });
}

timeLine = (req, res, next) => {
    offset = req.params.page * 20;
    sql = 'SELECT * FROM posts JOIN Users ON posts."userId" = users.userId WHERE "postedOn" <= $1 ORDER BY "postedOn" DESC LIMIT 100 OFFSET $2';
    con.query(sql, [req.params.startDate, offset], function (err, result) {
        if (err)
            res.json({ status: "false", message: "Error occured " + err });
        res.json({ status: "true", results: result.rows });
    });
};
module.exports = { getUserPost, getPost, insertPost, updatePost, toggleLike, getPostLikesQty,getPostComments, timeLine };