var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');
var secretKey = require('./../config/secretKey');

//user Models
var User = require('./../models/User');


var signup = function (req, res) {
    var response = {};

    if (req.body.name && req.body.lastname && req.body.password && req.body.email) {
        User.findOne({
            email: req.body.email
        }, function (err, user) {
            if (err) {
                res.status(300).json({
                    code: 300,
                    message: 'Mongo Query Error',
                    data: err
                })
                return;
            } else {
                if (user) {
                    res.status(400).json({
                        code: 400,
                        message: 'Duplicate User'
                    });
                    return;
                } else {
                    var salt = bcrypt.genSaltSync(secretKey.saltRounds);
                    var hash = bcrypt.hashSync(req.body.password, salt);

                    var newUser = User();
                    newUser.name = req.body.name;
                    newUser.email = req.body.email;
                    newUser.lastname = req.body.lastname;

                    newUser.password = hash;
                    newUser.save().then((result) => {
                        result.password = '';

                        res.status(200).json({
                            code: 200,
                            message: 'User Signup',
                            data: {
                                user: result,
                                token: jwt.sign({
                                    _id: newUser._id,
                                    name: newUser.name,
                                    email: newUser.email
                                }, secretKey.jwtSecret)
                            }
                        })

                    }).catch((err) => {
                        console.log(`Error Saving New User :  ${err}`);
                        res.status(500).json({
                            code: 500,
                            message: 'Error Saving New User ${err}',
                            data: err
                        })
                    });
                }
            }

        })
    } else {
        response.message = 'Fields can not be null';
        response.data = null;

        res.status(300).json({
            code: 300,
            body: response
        });
        return;
    }




}
var login = function (req, res) {
    var email = req.body.email;
    var password = req.body.password;
    if (email && password) {

        User.findOne({
            email: email
        }, function (err, user) {
            if (user) {
                user.verifyPassword(password).then(function (result) {
                        if (result) {
                            res.status(200).json({
                                code: 200,
                                user: user,
                                token: jwt.sign({
                                    name: user.name,
                                    email: user.email,
                                    password: '',
                                    userID: user._id
                                }, secretKey.jwtSecret)
                            })
                        } else {
                            res.status(404).json({
                                code: 404,
                                message: 'invalide email or password'
                            })
                        }
                    })
                    .catch((err) => {
                        console.log(`${err}`);
                        res.status(404).json({
                            code: 404,
                            message: 'Invalid Email or Password'
                        })
                    })
            } else {
                res.status(404).json({
                    code: 404,
                    message: 'User not found'
                })
            }
        });

    } else {
        res.status(500).json({
            code: 500,
            message: 'Params Missing'
        });
    }
}

module.exports = {
    signup,
    login
}