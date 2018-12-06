var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');
var secretKey = require('./../config/secretKey');
const server = require('http').createServer();
const io = require('socket.io')(server);

//user Models


var signup = function (req, res) {
    var User = require('./../models/User');
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
    var User = require('./../models/User');
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

var recipe = function (req, res) {
    var Recipe = require('./../models/Recipe');
    let token = req.headers.authorization;
    let userobj = jwt.decode(token, secretKey);

    var name = req.body.name;
    var steps = req.body.steps;
    var UserID = userobj.userID;
    var Recipe = Recipe();
    Recipe.name = name;
    Recipe.recipeSteps = steps;
    Recipe.User = UserID;

    Recipe.save().then(data => {
        res.status(200).json({
            data: data
        })
    });
}


var  getAllRecipe = function(req, res) {
    var Recipe = require('./../models/Recipe');


    // const changeStream = Recipe.watch();
    // changeStream.on("change", data =>{
    //     res.json({
    //         data:data
    //     })
    // })


    // io.on('connection', function (err,socket) {
    //     console.log("connection")
    //     changeStream.on('change', function (change) {
    //         Recipe.find().populate('User', { "_id": 1, "name": 1, "lastname": 1 }).exec(function (err, response) {
    //             socket.emit("data",response);
    //             // res.status(200).json({
    //             //     code: 200,
    //             //     data: response
    //             // })
    //         });
    //     })
    // });

    Recipe.find().populate('User', { "_id": 1, "name": 1, "lastname": 1 }).exec(function (err, response) {
        res.render('recipe', response)
        // res.status(200).json({
        //     code: 200,
        //     data: response
        // })
    });
}

 var postedBy = function(req, res){
    var Recipe = require('./../models/Recipe');
    var id = req.query.recipeID;
// Recipe.findOne({id})
 }

module.exports = {
    signup,
    login,
    recipe,
    getAllRecipe,
    postedBy

}