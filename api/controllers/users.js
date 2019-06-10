const User = require('../models/user');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const valueChecker = require('../utils/value-checker.util');

const checkAuth = (req, res) => {
    if (!req.headers.authorization) {
        res.status(401).json({
            message: 'Użytkonik nie znajduje się w bazie danych'
        });
    }
    try {
        let decoded = jwt.verify(req.headers.authorization.replace(/"/g, ''), process.env.JWT_KEY);
    } catch (err) {
        return res.status(401).json({
            error: err
        });
    }
}

const hashPassword = async (password) => {

    const saltRounds = 10;

    const hashedPassword = await new Promise((resolve, reject) => {
        bcrypt.hash(password, saltRounds, function (err, hash) {
            if (err) reject(err)
            resolve(hash)
        });
    })

    return hashedPassword
}

exports.user_get_experts = (req, res, next) => {
    User.find({ roles: 'EXPERT', disciplines: req.params.discipline })
        .select('_id email name discipline')
        .exec()
        .then(result => {
            res.status(200).json({ result });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}

exports.user_signup = (req, res, next) => {
    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            if (user.length >= 1) {
                return res.status(409).json({
                    message: 'Email istnieje'
                });
            } else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({
                            error: err
                        });
                    } else {
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            email: req.body.email,
                            password: hash,
                            name: req.body.name,
                            joined: new Date(),
                            roles: req.body.roles
                        });
                        user
                            .save()
                            .then(result => {
                                console.log(result);
                                res.status(201).json({
                                    message: 'User created'
                                });
                            })
                            .catch(err => {
                                console.log(err);
                                res.status(500).json({
                                    error: err
                                });
                            });
                    }
                });
            }
        });
}

exports.user_post_create_user = (req, res, next) => {
    checkAuth(req, res);
    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            if (user.length >= 1) {
                return res.status(409).json({
                    message: 'Email istnieje'
                });
            } else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({
                            error: err
                        });
                    } else {
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            email: req.body.email,
                            password: hash,
                            name: req.body.name,
                            joined: new Date(),
                            roles: req.body.roles,
                            disciplines: req.body.disciplines,
                            college: req.body.college
                        });
                        user
                            .save()
                            .then(result => {
                                console.log(result);
                                res.status(201).json({
                                    message: 'User created'
                                });
                            })
                            .catch(err => {
                                console.log(err);
                                res.status(500).json({
                                    error: err
                                });
                            });
                    }
                });
            }
        });
}

exports.user_put_update_user = (req, res, next) => {

    const {
        userId
    } = req.params;

    const chain = async () => {
        await User.findById(userId).exec().then(user => {
            if (!user) {
                return res.status(404).json({
                    message: "User doesn't exist"
                });
            }
        });

        let password = req.body.password; 
        if(password) {
            password = await hashPassword(password);
        }
        return await User.updateOne({ _id: userId }, { $set: valueChecker.ClearObject({...req.body, password}) }, { upsert: true }).exec();
    }

    chain()
        .then(result => res.status(200).json(result))
        .catch(() => res.statuc(400).json())

}


exports.user_login = (req, res, next) => {
    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            if (user.length < 1) {
                return res.status(401).json({
                    message: 'Autoryzacja sie nie powiodła!'
                });
            }
            bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                if (err) {
                    return res.status(401).json({
                        message: 'Autoryzacja sie nie powiodła!'
                    });
                }
                if (result) {
                    console.log("AA", process.env.JWT_KEY);
                    const token = jwt.sign(
                        {
                            email: user[0].email,
                            userId: user[0]._id
                        },
                        process.env.JWT_KEY,
                        {
                            expiresIn: "1h"
                        }
                    );
                    User.updateOne({ _id: user[0]._id }, { $set: { token: token } })
                        .exec();
                    return res.status(200).json({
                        message: 'Auth succesful',
                        token: token,
                        user: user[0]
                    });
                }
                res.status(401).json({
                    message: 'Auth failed'
                });
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}

exports.user_get_user = (req, res, next) => {
    if (!req.headers.authorization) {
        res.status(401).json({
            message: 'Użytkonik nie znajduje się w bazie danych'
        });
    }
    try {
        let decoded = jwt.verify(req.headers.authorization.replace(/"/g, ''), process.env.JWT_KEY);
    } catch (err) {
        return res.status(401).json({
            error: err
        });
    }
    User.findOne({ token: req.headers.authorization.replace(/"/g, '') })
        .exec()
        .then(user => {
            if (!user) {
                return res.status(401).json({
                    message: 'Użytkonik nie znajduje się w bazie danych'
                });
            }
            console.log('User', user);
            return res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                roles: user.roles
            });
        });
}

exports.user_get_user_by_id = (req, res, next) => {
    checkAuth(req, res);
    const {
        userId
    } = req.params;

    User.findById(userId)
        .exec()
        .then(user => {
            if (!user) {
                return res.status(401).json({
                    message: 'Użytkonik nie znajduje się w bazie danych'
                });
            }
            console.log('User', user);
            return res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                roles: user.roles,
                disciplines: user.disciplines,
                college: user.college
            });
        });
}

exports.user_get_users = (req, res, next) => {
    User.find()
        .select('_id name email roles college')
        .exec()
        .then(users => {
            return res.status(201).json(users);
        })
        .catch(err => {
            return res.status(500).json({
                error: err
            });
        });
}

exports.user_get_users_by_discipline = (req, res, next) => {
    console.log(req.params.discipline);
    User.find({
        $and: [
            { disciplines: req.params.discipline },
            { roles: { $ne: "EXPERT" } }
        ]
    })
        .select('_id name email roles discipline')
        .exec()
        .then(users => {
            return res.status(201).json(users);
        })
        .catch(err => {
            return res.status(500).json({
                error: err
            });
        });
}

exports.user_forgot = (req, res, next) => {
    if (!req.body.email) {
        res.status(401).json({
            message: "Nie znaleziono konta email"
        });
    }
    if (!req.headers.origin) {
        return res.status(401).json({
            message: "Nie dozwolone"
        });
    }
    User.findOne({ email: req.body.email })
        .then(user => {
            let payload = {
                id: user._id,
                email: req.body.email
            };
            let secret = user.password + user.seen;
            let token = jwt.sign(payload, secret);
            let email = user.email;
            let subject = 'Zrestartuj hasło';
            let text = 'text';
            let html = '<p>Kliknij tutaj, aby zrestartować hasło <a href="http://localhost:4200/reset' + user._id + '/' + token + '">here</a></p>';
            sendOne(email, subject, text, html).catch(err => console.log('Error', err));
            return res.status(201).json({
                message: 'Email wysłany pomyślnie'
            });
        })
        .catch(err => {
            return res.status(500).json({
                error: err
            });
        });
}

exports.user_reset = (req, res, next) => {
    User.findOne({ _id: req.body.id })
        .then(user => {
            if (!user) {
                return res.status(401).json({
                    message: 'Użytkownik nie znaleziony w bazie danych'
                });
            }
            let secret = user.password + user.seen;
            let payload = jwt.verify(req.body.token, secret);
            console.log('Payload', payload);
        })
        .then(result => {
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if (err) {
                    return res.status(501).json({
                        error: err
                    });
                }
                User.updateOne({ _id: req.body.id }, { $set: { password: hash } })
                    .exec()
                    .then(result => {
                        return res.status(201).json({
                            message: 'Hasło zmienione'
                        });
                    })
            });
        })
        .catch(err => {
            return res.status(500).json({
                error: err
            });
        });

}

exports.user_update_user = (req, res, next) => {
    User.updateOne({ _id: req.body._id }, { $set: req.body })
        .exec()
        .then(result => {
            res.status(200).json({
                message: "Użytkownik zaktualizowany"
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}

exports.user_delete_user = (req, res, next) => {
    User.remove({ _id: req.params.userId })
        .exec()
        .then(result => {
            res.status(200).json({
                message: "Użytkownik usunięty"
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}

async function sendOne(email, subject, text, html) {

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.PieseEmailAddress, // generated ethereal user
            pass: process.env.PieseEmailPassword // generated ethereal password
        }
    });

    // setup email data with unicode symbols
    let mailOptions = {
        from: '"Nazwa " <your email>', // sender address
        to: email, // list of receivers
        subject: subject, // Subject line
        text: text, // plain text body
        html: html // html body
    };

    // send mail with defined transport object
    let info = await transporter.sendMail(mailOptions);

    console.log("Message sent: %s", info.messageId);
    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

exports.user_number_of_assigned_forms = (req, res, next) => {
    User.find({ _id: req.userData.userId })
        .select('_id assignedDiscipline numberOfForms')
        .exec()
        .then(users => {
            return res.status(201).json({
                numberOfAssignments: users && users[0] && users[0].numberOfForms ? users[0].numberOfForms : 0,
                assignedDiscipline: users && users[0] ? users[0].assignedDiscipline : ''
            });
        })
        .catch(err => {
            return res.status(500).json({
                error: err
            });
        });
}
