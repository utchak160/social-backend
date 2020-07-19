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

module.exports = {addPost};
