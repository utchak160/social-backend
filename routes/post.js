const express = require('express');
const {check} = require('express-validator');
const auth = require('../middleware/check-auth');
const postController = require('../controllers/post-controller');

const router = express.Router();

//Add Post
router.post('/add', [auth, [
    check('text', 'Text is required').not().isEmpty()
]], postController.addPost);

//Get All posts
router.get('/', auth, postController.getPosts);

//Get Post by ID
router.get('/:postId', auth, postController.getPostById);

//Delete post by ID
router.delete('/:postId', auth, postController.deletePostById);

//Like Post
router.put('/like/:postId', auth, postController.likePost);

//unlike post
router.put('/unlike/:postId', auth, postController.unlikePost);

//add comment
router.put('/comment/:postId', [auth, [
    check('text', 'Text is required').not().isEmpty()
]], postController.addComment);

//delete comment
router.delete('/comment/:postId/:commentId', auth, postController.deleteComment);

module.exports = router;
