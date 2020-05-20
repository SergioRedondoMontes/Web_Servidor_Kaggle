const express = require("express");
const router = express.Router();
const middleWares = require("../../middlewares");
const controllers = require("../../controllers");
var multer = require("multer");
const fs = require("fs");

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const path = `./public/tmp`;
    fs.mkdir(path, (error) => {
      cb(null, path);
    });
  },
  filename: (req, file, cb) => {
    cb(
      null,
      new Date().getTime() +
        "." +
        file.originalname.split(".")[file.originalname.split(".").length - 1]
    );
  },
});

var upload = multer({ storage: storage });

// AUTH
router.get("/signup", (req, res) => {
  res.render("common/signup");
});
router.post("/signup", controllers.common.signup);

router.get("/login", (req, res) => {
  res.render("common/login");
});

router.post("/login", controllers.common.login);

// HOME

router.get(
  "/",
  middleWares.auth.checkExistsLoggedIn,
  controllers.common.getChallenges
);

router.get("/users/:userId", controllers.common.getUser);

router.put("/users/:userId", controllers.common.updateUser);

router.delete("/users/:userId", controllers.common.deleteUser);

router.get("/challenges", controllers.common.getChallenges);

router.get(
  "/challenges/:challengeId",
  middleWares.auth.checkExistsLoggedIn,
  controllers.common.getChallenge
);

router.post(
  "/challenges",
  middleWares.auth.checkLoggedIn,
  upload.fields([{ name: "base" }, { name: "example" }]),
  controllers.common.postChallenge
);

router.put("/challenges/:challengeId", controllers.common.updateChallenge);

router.delete("/challenges/:challengeId", controllers.common.deleteChallenge);

router.post(
  "/challenges/:challengeId/participants",
  middleWares.auth.checkLoggedIn,
  controllers.common.updateParticipants
);

router.put(
  "/challenges/:challengeId/ranking",
  middleWares.auth.checkLoggedIn,
  controllers.common.updateRanking
);
router.get("/signout", (req, res) => {
  res.clearCookie("authorization-kaggle");
  res.redirect("/");
});

router.get(
  "/uploadPredictions",
  middleWares.auth.checkLoggedIn,
  upload.single({ name: "competition" }),
  controllers.common.uploadPredictions
);

// router.post(
//   "/testUpload",
//   upload.fields([{ name: "uploaded_file" }, { name: "uploaded_file2" }]),
//   controllers.common.testUpload,
//   (req, res) => {
//     res.send("guardado");
//   }
// );

module.exports = router;
