const express = require('express');
const router = express.Router({mergeParams: true});
const ExpressError = require('../utils/ExpressError');
const User = require('../models/user.js');
const wrapAsync = require('../utils/wrapAsync');
const passport = require('passport');
const user = require('../models/user.js');
const { saveRedirectUrl, userId, validateSchemaSignUp, validateSchemeLogin } = require('../middleware.js');
const userController = require('../controllers/user.js');

//Signup
router.route("/signup")
.get(userController.renderSignUp)
.post(validateSchemaSignUp, userController.signUp);

//Login
router.route("/login")
.get(userController.renderLoginForm)
.post(validateSchemeLogin, saveRedirectUrl,
    passport.authenticate('local', {  session : true , failureRedirect : '/login', failureFlash : true  }), userId,  
    userController.login);

//Logout
router.get('/logout', userController.logout)


module.exports = router;