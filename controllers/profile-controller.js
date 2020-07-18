const User = require('../models/user');
const Profile = require('../models/profile');

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
