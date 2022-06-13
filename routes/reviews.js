// Imports requires modules/utilites/models etc
const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utils/catchAsync');
const reviews = require('../controllers/reviews');
const { isLoggedIn, validateReview, campStatus, isReviewAuthor } = require('../middleware');

// Route to add a review
router.post('/', isLoggedIn, catchAsync(campStatus), validateReview, catchAsync(reviews.createReview));

// Route to delete a review
router.delete('/:reviewId', isLoggedIn, catchAsync(campStatus), catchAsync(isReviewAuthor), catchAsync(reviews.deleteReview));

module.exports = router;