var express = require('express');
var router = express.Router();

var userController = require('./../controllers/userController');

router.post('/userSignup', userController.signup);
router.post('/userLogin', userController.login);
router.post('/postRecipe', userController.recipe);
router.get('/getAllRecipe', userController.getAllRecipe);
router.get('/postedBy', userController.postedBy);
router.get('/getTokenInfo', userController.getTokenInfo);
router.get('/allUsers', userController.allUsers);
router.delete('/delRecipe/:id', userController.delRecipe);
router.get('/readStream', userController.streams);




module.exports = router;
