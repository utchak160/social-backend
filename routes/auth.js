const express = require('express');
const router = express.Router();
const { check } = require('express-validator')
const authController = require('../controllers/auth-controller');

//Register
router.post('/register', [
    check('name', 'Name is required')
        .not()
        .isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
], authController.register )

//Login
router.post('/login', [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').not().isEmpty()
], authController.login )

module.exports = router;
