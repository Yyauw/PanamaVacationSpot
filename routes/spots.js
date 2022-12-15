const express = require("express");
const Spot = require("../models/spot");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const { isLoggedIn, isAuthor, validateSpot } = require("../middleware");
const spotController = require("../controller/spotsController");
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })

router
  .route("/")
  .get(spotController.index)
  // .post(isLoggedIn, validateSpot, catchAsync(spotController.createSpot));
  .post(upload.single('image'),(req,res) =>{
    console.log(req.file, req.body)
    res.send(req.body)
  })

router.get("/new", isLoggedIn, spotController.newSpot);

router
  .route("/:id")
  .get(catchAsync(spotController.showSpot))
  .put(isLoggedIn, isAuthor, validateSpot, catchAsync(spotController.editSpot))
  .delete(isLoggedIn, isAuthor, catchAsync(spotController.deleteSpot));

router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(spotController.editForm)
);

module.exports = router;
