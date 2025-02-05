const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
    const currUser = req.user;
    const allListings = await Listing.find({});
    res.render('listings/index.ejs', { allListings, currUser });
};

module.exports.createListing = async (req, res, next) => {

    //Geocoding
    let map = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
    })
        .send();

    let url = req.file.path;
    let filename = req.file.filename;
    const currUser = req.user;
    const newListing = new Listing(req.body.listing);
    newListing.owner = currUser.id;
    newListing.image = { url, filename };
    newListing.geometry = map.body.features[0].geometry;
    await newListing.save();
    req.flash('success', 'New listing created');
    res.redirect('/listings', 500, { currUser });
}

module.exports.renderNewForm = (req, res) => {
    const currUser = req.user;
    res.render('listings/new.ejs', { currUser });
};

module.exports.showListing = async (req, res) => {
    const currUser = req.user;
    let { id } = req.params;

    const listing = await Listing.findById(id).populate({ path: 'reviews', populate: { path: "author" } }).populate('owner');

    if (!listing) {
        req.flash('error', 'Listing does not exists!');
        res.redirect('/listings');
    }

    res.render('listings/show.ejs', { listing, currUser });
};

module.exports.renderEdit = async (req, res) => {
    const currUser = req.user;
    let { id } = req.params;
    const user = await Listing.findById(id);

    if (!user) {
        req.flash('error', 'Listing does not exists!');
        res.redirect('/listings');
    }

    res.render('listings/edit.ejs', { user, currUser });
};

module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);

    req.flash('success', 'Listing has been Deleted!');
    res.redirect(`/listings`)
};

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    const userListing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        userListing.image = { url, filename };
        await userListing.save();
    }
    req.flash('success', 'Listing has been Update!');
    res.redirect(`/listings/${id}`);
};