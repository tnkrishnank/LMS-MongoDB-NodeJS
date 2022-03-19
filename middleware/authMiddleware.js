const jwt = require('jsonwebtoken');
const User = require('../models/user');

const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;

    if(token)
    {
        jwt.verify(token, 'key', (err, decodedToken) => {
            if(err)
            {
                res.redirect(301, '/');
            }
            else
            {
                next();
            }
        });
    }
    else
    {
        res.redirect(301, '/');
    }
};

const checkUser = (req, res, next) => {
    const token = req.cookies.jwt;

    if(token)
    {
        jwt.verify(token, 'key', async (err, decodedToken) => {
            if(err)
            {
                res.locals.user = null;
                next();
            }
            else
            {
                let user = await User.findById(decodedToken.id);
                res.locals.user = user;
        	    next();
            }
        });
    }
    else
    {
        res.locals.user = null;
        next();
    }
};

module.exports = { requireAuth, checkUser };