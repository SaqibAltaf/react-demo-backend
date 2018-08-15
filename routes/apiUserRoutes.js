var express = require('express');
var router = express.Router();

var userController = require('./../controllers/userController');

router.post('/userSignup', userController.signup);
router.post('/userLogin', userController.login);

module.exports = router;
