const {validationResult} = require('express-validator');
const User = require('../models/user');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');

const register = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()})
    }
    const { name, email, password } = req.body;
    try {
        const existingUser = await User.findOne({email});
        if (existingUser) {
            return res.status(400).json({errors: [{msgs: 'User already exists'}]});
        }
        const avatar = await gravatar.url(email, {
            s: '200',
            r: 'pg',
            d: 'mm'
        });
        const user = new User({
            name,
            email,
            avatar,
            password
        });
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();


        res.status(201).send({
            message: 'User Registered',
            user
        })
    } catch (e) {
        console.log(e.message);
        return res.status(500).send('Server error');
    }
};

module.exports = {register};
