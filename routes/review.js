const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/WrapAsync.js");
const ExpressError = require("../utils/ExpressError");
const {validateReview , isloggedIn, isReviewAuthor} = require("../middleware.js");


const reviewController = require("../Controller/review.js");
//Create Reviews Roaut
router.post("/",isloggedIn, validateReview,wrapAsync(reviewController.creatReview));
// Delete Review Roaut
router.delete("/:reviewId",isloggedIn,isReviewAuthor, wrapAsync(reviewController.deleteReview));

module.exports = router;
