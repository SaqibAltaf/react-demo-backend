var mongoose = require('mongoose');
var User = require("./User");


var RecipeSchema = mongoose.Schema({
    name: {
        type: String
    },
    recipeSteps: [],
    User: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    time: {
        type: Date,
        default: Date.now
    }
});




module.exports = mongoose.model('Recipe', RecipeSchema);