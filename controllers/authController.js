const User = require('../models/user');
const jwt = require('jsonwebtoken');

const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
    return jwt.sign({ id }, 'key', {
        expiresIn: maxAge
    });
};

module.exports.signup_get = (req, res) => {
    const token = req.cookies.jwt;

    if(token)
    {
        jwt.verify(token, 'key', async (err, decodedToken) => {
            if(err)
            {
                res.render('signup', {
                    msg: ""
                });
            }
            else
            {
                res.redirect(301, '/dashboard');
            }
        });
    }
    else
    {
        res.render('signup', {
            msg: ""
        });
    }
}

module.exports.signup_post = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        if(req.body.password != req.body.rpassword)
        {
            res.render('signup', {
                msg: "Passwords do not match !"
            });
        }
        else if(req.body.password.length < 8)
        {
            res.render('signup', {
                msg: "Minimum password length is 8 characters !"
            });
        }
        else
        {
            const user = new User({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
                userImg: "./images/noProfile.jpg"
            });
            user.save()
                .then((result) => {
                    const token = createToken(result._id);
                    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
                    res.redirect(301, '/dashboard');
                });
        }
    }
    catch(err) {
        res.render('signup', {
            msg: "Invalid Email or Password !"
        });
    }
}

module.exports.login_get = (req, res) => {
    const token = req.cookies.jwt;

    if(token)
    {
        jwt.verify(token, 'key', async (err, decodedToken) => {
            if(err)
            {
                res.render('index', {
                    msg: ""
                });
            }
            else
            {
                res.redirect(301, '/dashboard');
            }
        });
    }
    else
    {
        res.render('index', {
            msg: ""
        });
    }
}

module.exports.login_post = async (req, res) => {
    const { email, password } = req.body;
  
    try {
        const user = await User.login(email, password);
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.redirect(301, '/dashboard');
    } 
    catch(err) {
        res.render('index', {
            msg: "Invalid Email or Password !"
        });
    }
}
