const User = require('../models/user');
const Profile = require('../models/profile');
const Post = require('../models/post');
const axios = require('axios');
const {validationResult} = require('express-validator');

const getProfile = async (req, res, next) => {
    try {
        const profile = await Profile.findOne({user: req.authData.id}).populate('user', ['name', 'avatar']);
        if (!profile) {
            return res.status(400).send({
                msg: 'There is no profile for this user'
            });
        }
        res.json(profile)
    } catch (e) {
        console.log(e.message);
        res.status(500).send({
            msg: 'Server error'
        })
    }
}

const createProfile = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).send({errors: errors.array()});
    }

    const profileFields = {};
    profileFields.user = req.authData.id;
    if (req.body.handle) profileFields.handle = req.body.handle;
    if (req.body.company) profileFields.company = req.body.company;
    if (req.body.website) profileFields.website = req.body.website;
    if (req.body.location) profileFields.location = req.body.location;
    if (req.body.bio) profileFields.bio = req.body.bio;
    if (req.body.status) profileFields.status = req.body.status;
    if (req.body.githubusername)
        profileFields.githubusername = req.body.githubusername;
    // Skills - Spilt into array
    if (typeof req.body.skills !== 'undefined') {
        profileFields.skills = req.body.skills.split(',').map(skill => skill.trim());
    }

    // Social
    profileFields.social = {};
    if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
    if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
    if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
    if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
    if (req.body.instagram) profileFields.social.instagram = req.body.instagram;

    Profile.findOne({user: req.authData.id}).then(profile => {
        if (profile) {
            Profile.findOneAndUpdate(
                {user: req.authData.id},
                {$set: profileFields},
                {new: true}
            ).then(profile => res.json(profile));
        } else {
            Profile.findOne({handle: profileFields.handle}).then(profile => {
                if (profile && req.body.handle) {
                    errors.handle = 'This handle already exists';
                    return res.status(400).send(errors);
                }
                new Profile(profileFields).save().then(profile => res.json(profile));
            });
        }
    });
};

const getAllProfile = async (req, res, next) => {
    try {
        const profiles = await Profile.find().populate('user', ['name', 'avatar']);
        res.json(profiles);
    } catch (e) {
        console.log(e.message);
        return res.status(500).send({
            msg: 'Server error'
        });
    }
};

const getProfileByUserId = async (req, res, next) => {
    try {
        const profile = await Profile.findOne({user: req.params.userId}).populate('user', ['name', 'avatar']);
        if (!profile) {
            return res.status(400).send({
                msg: 'Profile not found'
            })
        }
        res.json(profile);
    } catch (e) {
        console.log(e.message);
        if (e.kind === 'ObjectId') {
            return res.status(400).send({
                msg: 'Profile not found'
            })
        }
        res.status(500).send({
            msg: 'Server error'
        });
    }
};

const deleteProfile = async (req, res, next) => {
    try {
        await Post.findOneAndRemove({user: req.authData.id});
        await Profile.findOneAndRemove({user: req.authData.id});
        await User.findOneAndRemove({_id: req.authData.id});
        res.json({
            msg: 'User deleted!'
        });
    } catch (e) {
        console.log(e.message);
        return res.status(500).send({
            msg: 'Server error'
        });
    }
};

const addExperience = async (req, res, next) => {
    const newExp = {
        title: req.body.title,
        company: req.body.company,
        location: req.body.location,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        description: req.body.description
    }
    try {
        const profile = await Profile.findOne({user: req.authData.id});
        if (!profile) {
            return res.status(400).send({
                msg: 'There is no profile for this user'
            });
        }
        await profile.experience.unshift(newExp);
        await profile.save();
        res.json(profile);
    } catch (e) {
        console.log(e.message);
        return res.status(500).send({
            msg: 'Server error'
        });
    }
};

const deleteExperience = async (req, res, next) => {
    try {
        const profile = await Profile.findOne({user: req.authData.id});
        const index = await profile.experience.map(exp => exp._id).indexOf(req.params.expId);

        profile.experience.splice(index, 1);
        await profile.save();
        res.json({
            msg: 'Experience deleted'
        })
    } catch (e) {
        console.log(e.message);
        return res.status(500).send({
            msg: 'Server error'
        });
    }
};

const addEducation = async (req, res, next) => {
    const newEdu = {
        school: req.body.school,
        degree: req.body.degree,
        fieldofstudy: req.body.fieldofstudy,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        description: req.body.description
    }
    try {
        const profile = await Profile.findOne({user: req.authData.id});
        if (!profile) {
            return res.status(400).send({
                msg: 'There is no profile for this user'
            });
        }
        profile.education.push(newEdu);
        await profile.save();
        res.json(profile);
    } catch (e) {
        console.log(e.message);
        return res.status(500).send({
            msg: 'Server error'
        });
    }
};

const deleteEducation = async (req, res, next) => {
    try {
        const profile = await Profile.findOne({user: req.authData.id});
        const index = await profile.education.map(edu => edu._id).indexOf(req.params.expId);

        profile.experience.splice(index, 1);
        await profile.save();
        res.json({
            msg: 'Education deleted'
        });
    } catch (e) {
        console.log(e.message);
        return res.status(500).send({
            msg: 'Server error'
        });
    }
};

const getGitHubRepos = async (req, res, next) => {
    const url = `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc&client_id=${process.env.GITHUB_CLIENT_ID}&client_secret=${process.env.GITHUB_SECRET}`;
    axios.get(url).then((response) => {
        if (response.status !== 200) {
            return res.status(404).send({
                msg: 'No GitHub profile found'
            })
        }
        res.json(response.data);
    }).catch(err => {
        console.log(err.message);
        return res.status(500).send({
            msg: 'Server error'
        });
    })
}


module.exports = {
    getProfile,
    createProfile,
    getAllProfile,
    getProfileByUserId,
    deleteProfile,
    addExperience,
    deleteExperience,
    addEducation,
    deleteEducation,
    getGitHubRepos
};
