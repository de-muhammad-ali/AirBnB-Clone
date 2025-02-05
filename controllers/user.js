const User = require('../models/user');

module.exports.renderSignUp = (req, res) => {
    res.render('user/signup.ejs')
};

module.exports.signUp = async (req, res) => {
    let { username, email, password } = req.body.user;

    const newUser = new User({username, email});
    
    try{
        let registerUser = await User.register(newUser, password);

        req.login(registerUser, (err) => {
            if(err){
                return next(err);
            }
            //Flash
            req.flash('success', 'Congratulations! You have created an account');
            res.redirect('/listings');
        })
                
    } catch(error){
        req.flash('error', 'Email already exist!');
        res.redirect('/signup')
    }
};

module.exports.renderLoginForm = (req, res) => {
    res.render('user/login.ejs');
};

module.exports.login = (req, res) => {
    let redirectUrl = res.locals.redirectUrl || "/listings";
    req.flash('success', 'You are logged in');
    res.redirect(redirectUrl);   
};

module.exports.logout = async (req, res, next) => {
    req.logOut((err) => {
        if (err) {
            next(err);
        }
        req.flash('success', 'logout!');  
        res.redirect('/listings');
    })
};