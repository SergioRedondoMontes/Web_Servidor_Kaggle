const express = require("express");
const router = express.Router();
const middleWares = require("../../middlewares");
const controllers = require("../../controllers");
var multer = require("multer");
const fs = require("fs");

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const base = "./public/uploads/";
    var id = "hola";
    var url = base + id;
    fs.mkdir(url, (error) => {
      cb(null, url);
    });
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
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

router.get("/", (req, res) => {
  const user = res.locals.loggedInUser;
  res.render("common/home", {
    loggedIn: user ? true : false,
    user: user || null,
  });
});

router.get("/users/:userId", controllers.common.getUser);

router.put("/users/:userId", controllers.common.updateUser);

router.delete("/users/:userId", controllers.common.deleteUser);

router.get("/challenges", controllers.common.getChallenges);

router.get("/challenges/:challengeId", controllers.common.getChallenge);

router.post("/challenges", controllers.common.postChallenge);

router.put("/challenges/:challengeId", controllers.common.updateChallenge);

router.delete("/challenges/:challengeId", controllers.common.deleteChallenge);

router.put(
  "/challenges/:challengeId/participants",
  middleWares.auth.checkLoggedIn,
  controllers.common.updateParticipats
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

router.post(
  "/testUpload",
  upload.single("uploaded_file"),
  controllers.common.testUpload
);

module.exports = router;
