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
router.get('/all', profileController.getAllProfile);

//get profile by user id
router.get('/user/:userId', profileController.getProfileByUserId);

//delete profile, user and post
router.delete('/', auth, profileController.deleteProfile);

//add experience
router.put('/experience', auth, profileController.addExperience);

//delete experience
router.delete('/experience/:expId', auth, profileController.deleteExperience);

module.exports = router;

