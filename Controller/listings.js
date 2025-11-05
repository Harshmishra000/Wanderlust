const Listing = require("../Model/listing");
const {listingSchema } = require("../schema.js");
  
    const mapToken = process.env.MAP_TOKEN;
  
module.exports.index = async (req, res) => {
    try {
        const allListings = await Listing.find({});
        res.render("index", { allListings, category: null, searchQuery: null });
    } catch (err) {
        console.error(err);
        res.send("Something went wrong!");
    };
};
module.exports.renderNewForm = (req,res) => {
    res.render("creat.ejs", { listing: undefined });
};

module.exports.showListing = (async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id).populate({path:"reviews",populate:{ path: "author",},}).populate("Owner");
  if(!listing){
    req.flash("error", "Listing you requested for does not exit!");
    return res.redirect("/listings");
  }
  res.render("show.ejs", { listing,  currentUser: req.user, });
});

module.exports.creatListing = async (req, res) => {

  try {
    const { location, lat, lng } = req.body.listing;
  const latitude = parseFloat(req.body.listing.lat);
const longitude = parseFloat(req.body.listing.lng);

    console.log("Location:", location);
    console.log("Latitude:", latitude);
    console.log("Longitude:", longitude);

    const url = req.file?.path;
    const filename = req.file?.filename;

    const newListing = new Listing({
      ...req.body.listing,
      geometry: {
        type: "Point",
        coordinates: [longitude, latitude]
      },
      Owner: req.user._id,
      image: { url, filename }
    });

    await newListing.save();
    req.flash("success", "New Listing Created Successfully!");
    res.redirect("/listings");
  } catch (error) {
    console.error("Error creating listing:", error);
    req.flash("error", "Could not create listing, please try again.");
    res.redirect("/listings/new");
  }
};



module.exports.editListing = (async (req,res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
      if(!listing){
    req.flash("error", "Listing you requested for does not exit!");
   return res.redirect("/listings");
  }
   let originalImageUrl = listing.image.url;
   originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_200,w_250");
    res.render("edit.ejs", { listing, originalImageUrl });
});
module.exports.updateListing = async (req, res) => {
    let { id } = req.params;



    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing }, { new: true });

    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
        await listing.save();
    }

    req.flash("success", "Listing Updated!");
    return res.redirect(`/listings/${id}`);
};

    // if (!updatedListing.image || !updatedListing.image.trim()) {
    //     updatedListing.image = listing.image;
    // } else {
    //     updatedListing.image = {
    //         filename: listing.image.filename || "defaultimage",
    //         url: updatedListing.image.trim()
    //     };
    // }

    // await Listing.findByIdAndUpdate(id, updatedListing);


module.exports.deleteListing = (async (req,res) => {
    let { id } = req.params;
    let deleteListing = await Listing.findByIdAndDelete(id)
    console.log(deleteListing);
    req.flash("success", " Listing Deleted!");
    res.redirect("/listings");
});

