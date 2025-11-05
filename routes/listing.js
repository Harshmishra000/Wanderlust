const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/WrapAsync.js");
const multer = require('multer');
const {isloggedIn,isOwner,validateListing} = require("../middleware.js");
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage })
const Listing = require("../Model/listing");

const listingController = require("../Controller/listings.js");
// Search Route FIRST (specific route)
router.get("/search", async (req, res) => {
  const query = req.query.q;
  const searchRegex = new RegExp(query, "i");

  const listings = await Listing.find({
    $or: [
      { title: searchRegex },
      { location: searchRegex },
      { category: searchRegex },
    ],
  });

  res.render("index", { allListings: listings, searchQuery: query,category: null});
});

// Category Route
router.get("/category/:category", async (req, res) => {
  const { category } = req.params;
  const allListings = await Listing.find({ category });
  res.render("index", { allListings, category });
});
router.route("/")
  .get(wrapAsync(listingController.index))
  .post(isloggedIn,upload.single('listing[image]'),validateListing, wrapAsync(listingController.creatListing))
 

// New Router
router.get("/new", isloggedIn,(listingController.renderNewForm));

router.route("/:id")
 .get(wrapAsync(listingController.showListing))
 .put(isloggedIn,isOwner,upload.single('listing[image]'), validateListing, wrapAsync(listingController.updateListing))
 .delete(isloggedIn,isOwner,  wrapAsync(listingController.deleteListing))

// Edit Raout
router.get("/:id/edit",isloggedIn,isOwner, wrapAsync(listingController.editListing));






module.exports = router;