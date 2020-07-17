const express = require('express');
const router = express.Router();
const { check } = require('express-validator')
const {register} = require('../controllers/auth-controller');

//Register
router.post('/register', [
    check('name', 'Name is required')
        .not()
        .isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
], register )

module.exports = router;
