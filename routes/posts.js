const express = require('express'); //import express

const router = express.Router();
const controller = require('../controllers/posts.js');
const auth = require('../middleware/checkToken.js');

router.get('/getPost/:id', [auth.verifyToken],controller.getPost);
router.get('/getUserPost/:id', [auth.verifyToken],controller.getUserPost);
router.post('/insertPost', [auth.verifyToken],controller.insertPost);
router.post('/updatePost/:id',[auth.verifyToken], controller.updatePost);
router.get('/getLikesQty/:id',[auth.verifyToken], controller.getPostLikesQty);
router.post('/toggleLike', [auth.verifyToken],controller.toggleLike);
router.get('/timeLine/:startDate/:page',[auth.verifyToken], controller.timeLine);
module.exports = router; // export to use in server.js