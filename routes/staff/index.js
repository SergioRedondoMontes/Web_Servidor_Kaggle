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

// LOGIC INITIAL
router.get(
  "/",
  //   middleWares.auth.checkLoggedIn,
  (req, res, next) => {
    const user = res.locals.loggedInUser;

    if (!user) {
      res.redirect("/staff/login");
    } else {
      next();
    }
  },
  middleWares.auth.checkLoggedIn,
  middleWares.auth.checkAuthStaff,
  (req, res) => {
    res.redirect("/staff/home");
  }
);

// AUTH ROUTES

router.post("/login", controllers.staff.login);

router.get("/signout", (req, res) => {
  res.clearCookie("authorization-kaggle");
  res.redirect("/");
});

router.get("/login", (req, res) => {
  res.render("staff/login");
});

// END AUTH ROUTES

router.get(
  "/home",
  middleWares.auth.checkLoggedIn,
  middleWares.auth.checkAuthStaff,
  (req, res) => {
    res.send("esto funciona porque estas logged in");
  }
);

// USER ROUTES

router.get(
  "/users",
  middleWares.auth.checkLoggedIn,
  middleWares.auth.checkAuthStaff,
  controllers.staff.getUsers
);

router.post(
  "/users",
  middleWares.auth.checkLoggedIn,
  middleWares.auth.checkAuthStaff,
  controllers.staff.postUser
);

router.get(
  "/users/:userId",
  middleWares.auth.checkLoggedIn,
  middleWares.auth.checkAuthStaff,
  controllers.staff.getUser
);

router.post(
  "/users/:userId",
  middleWares.auth.checkLoggedIn,
  middleWares.auth.checkAuthStaff,
  controllers.staff.updateUser
);

router.get(
  "/users/:userId/resetPassword",
  middleWares.auth.checkLoggedIn,
  middleWares.auth.checkAuthStaff,
  controllers.staff.resetPassword
);

router.get(
  "/users/:userId/delete",
  middleWares.auth.checkLoggedIn,
  middleWares.auth.checkAuthStaff,
  controllers.staff.deleteUser
);

// END USER ROUTES

// CHALLENGER ROUTES
router.get(
  "/challenges",
  middleWares.auth.checkLoggedIn,
  middleWares.auth.checkAuthStaff,
  controllers.staff.getChallenges
);

router.get(
  "/challenges/:challengeId",
  middleWares.auth.checkLoggedIn,
  middleWares.auth.checkAuthStaff,
  controllers.staff.getChallenge
);

router.post(
  "/challenges",
  middleWares.auth.checkLoggedIn,
  upload.fields([{ name: "competition" }, { name: "test_competition" }]),
  controllers.staff.postChallenge
);

router.post(
  "/challenges/:challengeId",
  middleWares.auth.checkLoggedIn,
  middleWares.auth.checkAuthStaff,
  controllers.staff.updateChallenge
);

router.get(
  "/challenges/:challengeId/delete",
  middleWares.auth.checkLoggedIn,
  middleWares.auth.checkAuthStaff,
  controllers.staff.deleteChallenge
);

router.put(
  "/challenges/:challengeId/participants",
  middleWares.auth.checkLoggedIn,
  controllers.staff.updateParticipants
);

router.put(
  "/challenges/:challengeId/ranking",
  middleWares.auth.checkLoggedIn,
  controllers.staff.updateRanking
);

// END CHALLENGE ROUTES

module.exports = router;
