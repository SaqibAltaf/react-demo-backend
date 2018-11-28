var mongoose = require('mongoose');



var RecipeSchema = mongoose.Schema({
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




 module.exports = mongoose.model('Recipe', RecipeSchema);