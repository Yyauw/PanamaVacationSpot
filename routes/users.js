const express = require("express");
const router = express.Router();
const User = require("../models/user");
const catchAsync = require("../utils/catchAsync");
const passport = require("passport");
const userController = require("../controller/userController");

router.get("/register", userController.registerForm);

router.post("/register", catchAsync(userController.registerUser));

router.get("/login", (req, res) => {
  res.render("./user/login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
    keepSessionInfo: true,
  }),
  userController.login
);

router.get("/logout", userController.logout);

module.exports = router;
