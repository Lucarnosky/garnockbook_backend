const express = require('express'); //import express

const router = express.Router();
const controller = require('../controllers/users.js');
router.post('/user', controller.newUser);
router.get('/user', controller.getUsers);
router.post('/login', controller.logInUser);
module.exports = router; // export to use in server.js