const express = require('express');
const router = express.Router();
const auth = require('../middleware/check-auth');
const userController = require('../controllers/user-controller');


//Get Authorised User
router.get('/', auth,  userController.getAuthUser);

module.exports = router;
