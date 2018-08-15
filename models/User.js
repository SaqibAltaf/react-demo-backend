var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var uniqueValidator = require('mongoose-unique-validator');


var UserSchema = mongoose.Schema({
    name: {
        type: String
    },
    lastname: {
        type: String
    },
    password: {
        type: String
    },
    email: {
        type: String,
        bcrypt: true,
        required: true
    },
    facebookId: {
        type: String,
        default: ''
    },
    gmailId: {
        type: String,
        default: ''
    },
    gender: {
        type: String
    },
    country: {
        type: String
    },
    time: {
        type: Date,
        default: Date.now
    }
});





UserSchema.methods.verifyPassword = function (password) {
    var user = this;

    return new Promise((resolve, reject) => {
        bcrypt.compare(password, user.password, (err, result) => {
            if (result) {
                return resolve(true);
            } else {
                return reject(result);
            }
        });
    });
};

var User = module.exports = mongoose.model('User', UserSchema);