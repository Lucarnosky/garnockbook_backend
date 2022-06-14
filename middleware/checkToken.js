const jwt = require('jsonwebtoken');
const userCtrl = require('../controllers/users');
const { Pool } = require('pg');

exports.verifyToken = async (req, res, next) => {
    try {
        const token = req.headers["x-access-token"];
        if (!token) return res.status(403).json({
            message: "No token provided"
        })
        const decoded = jwt.verify(token, 'secretKey')
        req.userId = decoded.id;
        const res = await Pool.query(
           "SELECT * FROM users WHERE userid = "+decoded.id
        );
        console.log(res.rows[0]);
        /*.then
        con.query(sql, [req.userId], function (err, result) {
            console.log("Test 2");
            if (err)
                res.json({ status: "false", message: "Error occured" });
            user = result.rows[0];
            console.log (user);
            if (!user) return res.status(404).json({
                message: "No user found"
            })
            console.log("E si va");
            next();
        });
        console.log("Er!");*/
    } catch (error) {
        return res.status(401).json({
            message: "Unauthorized"
        })
    }

}