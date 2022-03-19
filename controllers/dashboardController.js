const Course = require('../models/courses');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const { redirect } = require('express/lib/response');

module.exports.dashboard_get = (req, res) => {
    const token = req.cookies.jwt;

    var user;
    if(token)
    {
        jwt.verify(token, 'key', async (err, decodedToken) => {
            if(err)
            {
                res.redirect(301, '/');
            }
            else
            {
                var user = await User.findById(decodedToken.id);
                res.render('dashboard', { user: user });
            }
        });
    }
    else
    {
        res.redirect(301, '/');
    }
}

module.exports.dashboard_post = async (req, res) => {
    res.cookie('jwt', '', { maxAge: 1 });
    res.redirect(301, '/');
}

module.exports.taskManager_get = (req, res) => {
    res.render('taskManager');
}

module.exports.courses_get = (req, res) => {
    const token = req.cookies.jwt;

    var user;
    if(token)
    {
        jwt.verify(token, 'key', async (err, decodedToken) => {
            if(err)
            {
                res.redirect(301, '/dashboard');
            }
            else
            {
                User.findById(decodedToken.id)
                    .then((data) => {
                        Course.find({ '_id': { $in: data.courses } })
                            .then((records) => {
                                res.render('courses', {
                                    courses: records
                                });
                            });
                    });
            }
        });
    }
    else
    {
        res.redirect(301, '/dashboard');
    }
}

module.exports.courses_post = (req, res) => {
    key = req.body.selectedCourse;

    Course.find().then((data) => {
        for(let i = 0; i < data.length; i++)
        {
            if(data[i]._id == key)
            {
                res.render('viewCourse', {
                    course: data[i]
                });
                break;
            }
        }
    });
}

module.exports.addCourse_get = (req, res) => {
    res.render('addCourse');
}

module.exports.addCourse_post = (req, res) => {
    statusC = false
    if(req.body.status != undefined)
        statusC = true

    const link = "https://www.youtube.com/embed/" + req.body.link.slice(32);

    const t = new Course({
        cname: req.body.name,
        cdescription: req.body.description,
        clink: link,
        completed: statusC
    });

    t.save()
        .then((result) => {
            const token = req.cookies.jwt;

            var user;
            if(token)
            {
                jwt.verify(token, 'key', async (err, decodedToken) => {
                    if(err)
                    {
                        user = null;
                    }
                    else
                    {
                        User.findById(decodedToken.id)
                            .then((data) => {
                                data.courses.push(result._id);
                                data.save();
                            });
                    }
                });
            }
            else
            {
                user = null;
            }
        });
    res.redirect(301, '/dashboard');
}

module.exports.profile_get = (req, res) => {
    const token = req.cookies.jwt;

    var user;
    if(token)
    {
        jwt.verify(token, 'key', async (err, decodedToken) => {
            if(err)
            {
                res.redirect(301, '/dashboard');
            }
            else
            {
                User.findById(decodedToken.id)
                    .then((data) => {
                        res.render('profile', {
                            data: data,
                            mailMsg: ""
                        });
                    });
            }
        });
    }
    else
    {
        res.redirect(301, '/dashboard');
    }
}

module.exports.profile_post = async (req, res) => {
    const token = req.cookies.jwt;

    var user;
    if(token)
    {
        jwt.verify(token, 'key', async (err, decodedToken) => {
            if(err)
            {
                res.redirect(301, '/dashboard');
            }
            else
            {
                User.findById(decodedToken.id)
                    .then((data) => {
                        data.name = req.body.name;
                        data.email = req.body.email;
                        //data.userImg
                        data.save();
                    });
                
                res.redirect(301, '/dashboard');
            }
        });
    }
    else
    {
        res.redirect(301, '/dashboard');
    }
}