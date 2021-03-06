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

router.get(
  "/",
  //   middleWares.auth.checkLoggedIn,
  (req, res, next) => {
    const user = res.locals.loggedInUser;

    if (!user) {
      res.redirect("/admin/login");
    } else {
      next();
    }
  },
  middleWares.auth.checkLoggedIn,
  middleWares.auth.checkAuthAdmin,
  (req, res) => {
    res.redirect("/admin/dashboard");
  }
);

router.get(
  "/dashboard",
  middleWares.auth.checkLoggedIn,
  middleWares.auth.checkAuthAdmin,
  controllers.admin.getDashboard
);

router.get("/login", (req, res) => {
  res.render("admin/login");
});

router.post("/login", controllers.admin.login);

router.post(
  "/users",
  middleWares.auth.checkLoggedIn,
  middleWares.auth.checkAuthAdmin,
  controllers.admin.postUser
);

router.get(
  "/users",
  middleWares.auth.checkLoggedIn,
  middleWares.auth.checkAuthAdmin,
  controllers.admin.getUsers
);

router.get(
  "/employees",
  middleWares.auth.checkLoggedIn,
  middleWares.auth.checkAuthAdmin,
  controllers.admin.getEmployees
);

router.post(
  "/employees",
  middleWares.auth.checkLoggedIn,
  middleWares.auth.checkAuthAdmin,
  controllers.admin.postEmployee
);

router.get(
  "/users/:userId",
  middleWares.auth.checkLoggedIn,
  middleWares.auth.checkAuthAdmin,
  controllers.admin.getUser
);

router.post(
  "/users/:userId",
  middleWares.auth.checkLoggedIn,
  middleWares.auth.checkAuthAdmin,
  controllers.admin.updateUser
);

router.get(
  "/users/:userId/resetPassword",
  middleWares.auth.checkLoggedIn,
  middleWares.auth.checkAuthAdmin,
  controllers.admin.resetPassword
);

router.get(
  "/users/:userId/delete",
  middleWares.auth.checkLoggedIn,
  middleWares.auth.checkAuthAdmin,
  controllers.admin.deleteUser
);

router.get(
  "/challenges",
  middleWares.auth.checkLoggedIn,
  middleWares.auth.checkAuthAdmin,
  controllers.admin.getChallenges
);

router.get(
  "/challenges/:challengeId",
  middleWares.auth.checkLoggedIn,
  middleWares.auth.checkAuthAdmin,
  controllers.admin.getChallenge
);

router.post(
  "/challenges",
  middleWares.auth.checkLoggedIn,
  upload.fields([{ name: "base" }, { name: "example" }]),
  controllers.admin.postChallenge
);

router.post(
  "/challenges/:challengeId",
  middleWares.auth.checkLoggedIn,
  middleWares.auth.checkAuthAdmin,
  controllers.admin.updateChallenge
);

router.get(
  "/challenges/:challengeId/delete",
  middleWares.auth.checkLoggedIn,
  middleWares.auth.checkAuthAdmin,
  controllers.admin.deleteChallenge
);

router.get("/signout", (req, res) => {
  res.clearCookie("authorization-kaggle");
  res.redirect("/");
});

module.exports = router;
