const jwt = require('jsonwebtoken');
const keys = require('../config/keys');

module.exports = authenticateJwt = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if(authHeader){
        const token = authHeader.split(' ')[1];

        jwt.verify(token, keys.secretOrKey, (err, user) => {
            if(err){
                return res.status(403).json({ error: 'Access Forbidden.' });
            }
            req.user = user;
            next();
        });
    } else {
        return res.status(401).json({ error: 'Unauthorized Access.' });
    }
}