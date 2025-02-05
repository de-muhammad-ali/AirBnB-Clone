const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');
const Listing = require('../models/listing');
const { isLoggedIn, userId, isOwner, validateListing } = require('../middleware');
const listingController = require('../controllers/listing');
const multer = require('multer');
const { cloudinary, storage } = require('../cloudConfig');
const upload = multer({ storage });


//Route
router.route("/")
    .get(wrapAsync(listingController.index))
    .post(isLoggedIn, upload.single("listing[image]"), wrapAsync(listingController.createListing));

//Get new
router.get('/new', isLoggedIn, validateListing, listingController.renderNewForm);

//Route Id
router.route("/:id")
    .get(wrapAsync(listingController.showListing))
    .delete(isLoggedIn, userId, isOwner, wrapAsync(listingController.destroyListing))
    .put(isLoggedIn, isOwner, upload.single("listing[image]"), validateListing, userId, wrapAsync(listingController.updateListing));

//Get edit
router.get('/:id/edit', isLoggedIn, isOwner, wrapAsync(listingController.renderEdit));

//Export
module.exports = router;