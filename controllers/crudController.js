const Task = require('../models/tasks');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

module.exports.create_get = (req, res) => {
    res.render('create');
}

module.exports.create_post = (req, res) => {
    statusC = false
    if(req.body.status != undefined)
        statusC = true

    const t = new Task({
        description: req.body.description,
        date: req.body.deadline,
        completed: statusC
    });

    t.save().then((result) => {
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
                            data.tasks.push(result._id);
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

module.exports.read_get = (req, res) => {
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
                        Task.find({ '_id': { $in: data.tasks } })
                            .then((records) => {
                                res.render('read', {
                                    tasks: records
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

module.exports.update_get = (req, res) => {
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
                        Task.find({ '_id': { $in: data.tasks } })
                            .then((records) => {
                                res.render('update', {
                                    tasks: records
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

module.exports.update_post = (req, res) => {
    key = req.body.selectedTask;

    Task.find().then((data) => {
        for(let i = 0; i < data.length; i++)
        {
            if(data[i]._id == key)
            {
                res.render('updatea', {
                    task: data[i]
                });
                break;
            }
        }
    });
}

module.exports.updatea_post = (req, res) => {
    statusC = false
    if(req.body.status != undefined)
        statusC = true

    Task.findById(req.body.sid)
        .then((data) => {
            data.description = req.body.description;
            data.date = req.body.deadline;
            data.completed = statusC;
            data.save();
        });

    res.redirect(301, '/dashboard');
}

module.exports.delete_get = (req, res) => {
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
                        Task.find({ '_id': { $in: data.tasks } })
                            .then((records) => {
                                res.render('delete', {
                                    tasks: records
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

module.exports.delete_post = (req, res) => {
    key = req.body.selectedTask;

    Task.deleteOne({ _id: key });

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
                        data.tasks.pop(key);
                        data.save();
                        res.redirect(301, '/dashboard');
                    });
            }
        });
    }
    else
    {
        res.redirect(301, '/dashboard');
    }
}