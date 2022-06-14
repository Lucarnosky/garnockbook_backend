const express = require('express');

const router = express.Router();
const controller = require('../controllers/comments.js');

router.get('/getComments/:id', controller.getPostComments);

module.exports = router;