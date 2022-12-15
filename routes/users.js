const express = require("express");
const router = express.Router();
const User = require("../models/user");
const catchAsync = require("../utils/catchAsync");
const passport = require("passport");
const userController = require("../controller/userController");

router
  .route("/register")
  .get(userController.registerForm)
  .post(catchAsync(userController.registerUser));

router
  .route("/login")
  .get(userController.loginForm)
  .post(
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/login",
      keepSessionInfo: true,
    }),
    userController.login
  );

router.get("/logout", userController.logout);

module.exports = router;
