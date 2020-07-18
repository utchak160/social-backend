const jwt = require('jsonwebtoken');

const checkAuth = async (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    try {
        const verify = await jwt.verify(token, process.env.SECRET_KEY);
        if (!verify) {
            return res.status(401).send({
                msg: 'Invalid Token.'
            });
        }
        req.authData = {email: verify.user.email, id: verify.user.id};
        next();
    } catch (e) {
        return res.status(401).send({
            msg: 'Invalid Token.'
        });
    }
}

module.exports = checkAuth;
