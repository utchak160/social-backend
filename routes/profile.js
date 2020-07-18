const express = require('express');
const router = express.Router();
const auth = require('../middleware/check-auth');
const {check} = require('express-validator');
const profileController = require('../controllers/profile-controller');

//Get logged In user's profile
router.get('/me', auth, profileController.getProfile);

//Create or Update Profile
router.post('/', [
    check('status', 'Status is required').not().isEmpty(),
    check('skills', 'Skills is required').not().isEmpty()
], auth, profileController.createProfile);

//getAllProfiles
router.get('/', profileController.getAllProfile);

//get profile by user id
router.get('/user/user_id', profileController.getProfileByUserId);

module.exports = router;

