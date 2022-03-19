const User = require('../models/user');
const jwt = require('jsonwebtoken');

const handleErrors = (err) => {
    console.log(err.message, err.code);
    let errors = { email: '', password: '' };

    // incorrect email
    if (err.message === 'incorrect email') {
    errors.email = 'That email is not registered';
    }

    // incorrect password
    if (err.message === 'incorrect password') {
    errors.password = 'That password is incorrect';
    }

    // duplicate email error
    if (err.code === 11000) {
    errors.email = 'that email is already registered';
    return errors;
    }

    // validation errors
    if (err.message.includes('user validation failed')) {
    // console.log(err);
    Object.values(err.errors).forEach(({ properties }) => {
        // console.log(val);
        // console.log(properties);
        errors[properties.path] = properties.message;
    });
    }

    return errors;
}

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
                    usrMsg: "",
                    mailMsg: "",
                    psswdMsg: ""
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
            usrMsg: "",
            mailMsg: "",
            psswdMsg: ""
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
                    usrMsg: "",
                    passMsg: ""
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
            usrMsg: "",
            passMsg: ""
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
        res.redirect(301, '/');
    }
}

module.exports.signup_post = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        });
        user.save()
            .then((result) => {
                const token = createToken(result._id);
                res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
                res.redirect(301, '/dashboard');
            });
    }
    catch(err) {
        console.log(err);
        res.redirect(301, '/');
    }
}