const express = require('express');
const {check} = require('express-validator');
const auth = require('../middleware/check-auth');
const postController = require('../controllers/post-controller');

const router = express.Router();

//Add Post
router.post('/add', [auth, [
    check('text', 'Text is required').not().isEmpty()
]], postController);



module.exports = router;
