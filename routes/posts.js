const express = require('express'); //import express

const router = express.Router();
const controller = require('../controllers/posts.js');
const auth = require('../middleware/checkToken.js');

router.get('/getPost/:id', controller.getPost);
router.get('/getUserPost/:id', controller.getUserPost);
router.post('/insertPost', controller.insertPost);
router.post('/updatePost/:id', controller.updatePost);
router.get('/getLikesQty/:id', controller.getPostLikesQty);
router.post('/toggleLike', [auth.verifyToken],controller.toggleLike);
router.get('/timeLine/:startDate/:page',[auth.verifyToken], controller.timeLine);
module.exports = router; // export to use in server.js