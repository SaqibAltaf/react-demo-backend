var mongoose = require('mongoose');
var Schema= mongoose.Schema;



var RecipeSchema = Schema({
    name: {
        type: String
    },
    chat: [],
    User: { type: Schema.Types.ObjectId, ref: User },
    time: {
        type: Date,
        default: Date.now
    }
});




module.exports = mongoose.model('Recipe', RecipeSchema);