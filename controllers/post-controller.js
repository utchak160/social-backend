const {validationResult} = require('express-validator');
const User = require('../models/user');
const Post = require('../models/post');

const addPost = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).send({errors: errors.array()});
    }

    try {
        const user = await User.findById(req.authData.id).select('-password');
        const newPost = new Post({
            text: req.body.text,
            name: user.name,
            avatar: user.avatar,
            user: req.authData.id
        });
        await newPost.save();
        res.status(201).json(newPost);
    } catch (e) {
        console.log(e);
        res.status(500).send({
            msg: 'Server error'
        });
    }
};

const getPosts = async (req, res, next) => {
    try {
        const posts = await Post.find().sort({date: -1});
        res.json(posts);
    } catch (e) {
        console.log(e.message);
        res.status(500).send({
            msg: 'Server error'
        });
    }
};

const getPostById = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.postId);
        if (!post) {
            return res.status(404).send({
                msg: 'No Post not found'
            });
        }
        res.json(post);
    } catch (e) {
        console.log(e.message);
        if (e.kind === 'ObjectId') {
            return res.status(404).send({
                msg: 'No Post not found'
            });
        }
        res.status(500).send({
            msg: 'Server error'
        });
    }
};

const deletePostById = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.postId);
        if (!post) {
            return res.status(404).json({msg: 'Post not found'});
        }
        if (post.user.toString() !== req.authData.id) {
            return res.status(401).json({
                msg: 'User not authorized'
            });
        }
        await post.remove();
        res.json({msg: 'Post removed'});
    } catch (e) {
        console.log(e.message);
        if (e.kind === 'ObjectId') {
            return res.status(404).send({
                msg: 'No Post not found'
            });
        }
        res.status(500).send({
            msg: 'Server error'
        });
    }
}

module.exports = {addPost,getPosts, getPostById, deletePostById};
