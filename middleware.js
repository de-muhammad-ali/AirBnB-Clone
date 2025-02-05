const Listing = require('./models/listing');
const Reviews = require('./models/review.js')
const ExpressError = require('./utils/ExpressError');
const { listingSchema, reviewSchema } = require('./schema');
const { userSchema, userSchemaLogin } = require('./schema.js');



module.exports.isLoggedIn = (req, res, next) => {

    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        // console.log(req.originalUrl)
        req.flash('error', 'LoggedIn first to create Listings!');
        return res.redirect('/login')
    }
    next();
}

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.userId = (req, res, next) => {
    res.locals.loginUserId = req.user.id;
    next();
}

module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;

    let user = await Listing.findById(id);

    if (!user.owner._id.equals(req.user.id)) {
        req.flash('error', `You don't have permission.`);
        return res.redirect(`/listings/${id}`)
    }
    next();
}

module.exports.isReviewOwner = async (req, res, next) => {
    let { id, reviewId } = req.params;

    let review = await Reviews.findById(reviewId);

    if (!review.author.equals(req.user.id)) {
        req.flash('error', `You are impermissible`);
        return res.redirect(`/listings/${id}`);
    }
    next();
}


//Validate Schema Middleware
module.exports.validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    console.log(req.body)
    if (error) {
        throw new ExpressError(400, error);
    } else {
        next();
    }
}

module.exports.validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);

    if (error) {
        throw new ExpressError(400, error);
    } else {
        next();
    }
}

module.exports.validateSchemaSignUp = (req, res, next) => {
    let { error } = userSchema.validate(req.body);

    if (error) {
        throw new ExpressError(400, error)
    } else {
        next()
    }
}


module.exports.validateSchemeLogin = (req, res, next) => {
    let { error } = userSchemaLogin.validate(req.body.loginUser);

    if (error) {
        throw new ExpressError(400, error);
    }
    else {
        next();
    }
}