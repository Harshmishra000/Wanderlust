const Listing = require("../Model/listing.js");
const Review = require("../Model/review.js");


module.exports.creatReview = (async (req, res) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success", " New Reviews Created");
    res.redirect(`/listings/${listing._id}`);
});
module.exports.deleteReview = (async (req,res) => {
  let { id, reviewId } = req.params;
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", " Reviews Deleted!");
  res.redirect(`/listings/${id}`);
});