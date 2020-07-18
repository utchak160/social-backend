const express = require('express');
const router = express.Router();
const auth = require('../middleware/check-auth');

//Get logged In user's profile
router.get('/me', auth, )
