if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./Model/user.js");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.engine("ejs", ejsMate);
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "publics")));

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const dbUrl = process.env.ATLASDB_URL || "mongodb+srv://harshmishra:mSxf1YZ0FM48A5dJ@cluster0.wyd60sd.mongodb.net/?appName=Cluster0";

mongoose.connect(dbUrl)
.then(() => console.log("✅ Connected to MongoDB"))
.catch((err) => console.log("❌ MongoDB connection error:", err));

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET || "thisShouldBeSecret",
    },
    touchAfter: 24 * 3600, 
});

store.on("error", (err) => {
    console.log("ERROR in MONGO SESSION STORE", err);
});

app.use(
    session({
        store,
        secret: process.env.SECRET || "thisShouldBeSecret",
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // 1 week
            maxAge: 1000 * 60 * 60 * 24 * 7,
        },
    })
);

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

app.all(/.*/, (req, res, next) => {
    next(new Error("Page not found"));
});

app.use((err, req, res, next) => {
    const { status = 500, message = "Something went wrong!" } = err;
    res.status(status).render("error", { message });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});
