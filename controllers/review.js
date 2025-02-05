const Reviews = require('../models/review');
const Listing = require('../models/listing')

module.exports.createReview = async (req, res) => {

    const listing = await Listing.findById(req.params.id);
    const newUser = new Reviews(req.body.review);

    newUser.author = req.user;

    listing.reviews.push(newUser);   //Automatically store only id not whole array :)

    await newUser.save();
    await listing.save();

    req.flash('success', 'Review has been Created!');

    res.redirect(`/listings/${listing.id}`);

};

module.exports.destroyReview = async (req, res) => {

    let { id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id, {$pull : {reviews : reviewId}});
    await Reviews.findByIdAndDelete(reviewId);

    req.flash('success', 'Review has been deleted!');
    
    res.redirect(`/listings/${id}`);

};