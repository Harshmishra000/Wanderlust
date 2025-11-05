const express = require("express");
const router = express.Router();
const WrapAsync = require("../utils/WrapAsync");
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js");


const userController = require("../Controller/user.js");

router.route("/signup")
 .get((userController.singupFrom) )
 .post(WrapAsync(userController.singup))

router.route("/login")
 .get((userController.loginFrom))
 .post(saveRedirectUrl, passport.authenticate("local", { failureRedirect: "/login", failureFlash: true, }),(userController.login))

router.get("/logout", (userController.logout));
   
module.exports = router;