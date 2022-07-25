const express = require('express');
const router = express.Router();
const postCtrl = require('../controllers/post');;
const { verifToken, isModerator } = require('../middlewares/auth');
const multer = require('../middlewares/multer');

// CRUD -> CREATE READ UPDATE DELETE <- CRUD -> POST
router.post('/create', verifToken, multer, postCtrl.createPost);
router.post('/like-post/:id', verifToken, postCtrl.likePost);
router.get('/', verifToken, postCtrl.getAllPost);
router.get('/:id', verifToken, postCtrl.getOnePost);
router.patch('/update-post/:id', verifToken, multer, postCtrl.updateOnePost);
router.delete('/delete-post/:id', verifToken, postCtrl.deleteOnePost);
router.delete('/delete-anyone-post/:id', verifToken, isModerator, postCtrl.deleteAnyonePost);


// CRUD -> CREATE READ UPDATE DELETE <- CRUD -> COMMENT
router.post('/create-comment/:id', verifToken, multer, postCtrl.createComment);
router.post('/like-comment/:id', verifToken, postCtrl.likeComment);
router.get('/comment/:id', verifToken, postCtrl.getAllCommentFromOnePost);
router.patch('/update-comment/:id', verifToken, multer, postCtrl.updateComment);
router.delete('/delete-comment/:id', verifToken, postCtrl.deleteComment);
router.delete('/delete-anyone-comment/:id', verifToken, isModerator, postCtrl.deleteAnyoneComment);

module.exports = router;