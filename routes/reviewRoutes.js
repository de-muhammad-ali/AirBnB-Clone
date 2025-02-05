const express = require('express');
const router = express.Router({ mergeParams : true });
const wrapAsync = require('../utils/wrapAsync');
const Reviews = require('../models/review');
const {validateReview, isLoggedIn, isReviewOwner} = require('../middleware');
const reviewController = require('../controllers/review');

//Reviews
router.post('/', isLoggedIn, validateReview, wrapAsync(reviewController.createReview))

router.delete('/:reviewId', isLoggedIn, isReviewOwner, wrapAsync(reviewController.destroyReview ))

//Import
module.exports = router;