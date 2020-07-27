const {validationResult} = require('express-validator');
const User = require('../models/user');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const register = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()})
    }
    const { name, email, password } = req.body;
    try {
        const existingUser = await User.findOne({email});
        if (existingUser) {
            return res.status(400).json({errors: [{msg: 'User already exists'}]});
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

        const payload = {
            user: {
                id: user.id,
                email
            }
        }
        const token = jwt.sign(payload, process.env.SECRET_KEY, {expiresIn: '1h'}, (err, token) => {
            if (err) {
                return res.status(400).json({errors: [{msg: 'Token not generated'}]});
            }
            res.status(201).json({token});
        });

        // res.status(201).send({
        //     message: 'User Registered',
        //     user,
        //     token
        // });

    } catch (e) {
        console.log(e.message);
        return res.status(500).send('Server error');
    }
};

const login = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()})
    }
    const { email, password } = req.body;
    try {
        const user = await User.findOne({email});
        if (!user) {
            return res.status(400).json({errors: [{msg: 'Invalid Credentials'}]});
        }
        const checkPassword = await bcrypt.compare(password, user.password);

        console.log(checkPassword);
        if (!checkPassword) {
            return res.status(400).json({errors: [{msg: 'Invalid Credentials'}]});
        }

        const payload = {
            user: {
                id: user.id,
                email
            }
        }
        const token = jwt.sign(payload, process.env.SECRET_KEY, {expiresIn: '1h'}, (err, token) => {
            if (err) {
                return res.status(400).send('Token not generated');
            }
            res.status(200).json({token});
        });

        // res.status(201).send({
        //     message: 'User Registered',
        //     user,
        //     token
        // });

    } catch (e) {
        console.log(e.message);
        return res.status(500).send('Server error');
    }
};

module.exports = {register, login};
