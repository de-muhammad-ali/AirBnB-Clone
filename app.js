if (process.env.NODE_ENV != 'production') {
    require("dotenv").config();
}

const express = require('express');
const app = express();
const main = require('./connection');
const path = require('path');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const ExpressError = require('./utils/ExpressError');
const listingRoutes = require('./routes/listingRoutes.js');
const mainRoute = require('./routes/mainRoute.js');
const reviewRoutes = require('./routes/reviewRoutes.js');
const userRoutes = require('./routes/user.js')
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user.js');


app.use(methodOverride('_method'));
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', ejsMate)
app.use(express.static(path.join(__dirname, '/public')))

//Session Opt
const sessionOptions = {
    secret: 'mysupersecretcode',
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
}

//Session
app.use(session(sessionOptions));

//Flash
app.use(flash());

app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currUser = req.user;
    next();
})

//Passport
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



//Mongo Connection
main('mongodb://127.0.0.1:27017/wanderlust-second')
    .then((res) => {
        console.log('db connection was initailized')
    })
    .catch((e) => {
        console.log('db connection error -', e)
    })


//Import Router
app.use('/', mainRoute);
app.use('/listings', listingRoutes);
app.use('/listings/:id/reviews', reviewRoutes);
app.use('/', userRoutes);


// * Error
app.all('*', (req, res, next) => {
    next(new ExpressError(404, 'Page not found'))
})


//Middleware
app.use((err, req, res, next) => {
    let { status = 500, message = 'Some thing went wrong!' } = err;
    res.status(status).render('error.ejs', { err });

})

console.log(process.env.CLOUD_NAME)
//Port 
const port = 8080;
app.listen(port, (req, res) => console.log(`Server is running at port ${port}`));