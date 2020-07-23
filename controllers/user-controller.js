const User = require('../models/user');

exports.getAuthUser = async (req, res, next) => {
    const {email, id} = req.authData;
    try {
        const user = await User.findById(id).select('-password');
        if (!user) {
            return res.status(400).send({
                msg: 'User details not found'
            });
        }
        res.json(user);
    } catch (e) {
        console.log(e.message);
        res.status(500).send({
            msg: 'Server error'
        });
    }
}
