const express = require("express");
const router = express.Router();
const middleWares = require("../../middlewares");
const controllers = require("../../controllers");

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
    res.redirect("/admin/home");
  }
);

router.get(
  "/home",
  middleWares.auth.checkLoggedIn,
  middleWares.auth.checkAuthAdmin,
  (req, res) => {
    res.send("esto funciona porque estas logged in");
  }
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

router.put(
  "/users/:userId",
  middleWares.auth.checkLoggedIn,
  middleWares.auth.checkAuthAdmin,
  controllers.admin.updateUser
);

router.put(
  "/users/:userId/resetPassword",
  middleWares.auth.checkLoggedIn,
  middleWares.auth.checkAuthAdmin,
  controllers.admin.resetPassword
);

router.delete(
  "/users/:userId",
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
  middleWares.auth.checkAuthAdmin,
  controllers.admin.postChallenge
);

router.put(
  "/challenges/:challengeId",
  middleWares.auth.checkLoggedIn,
  middleWares.auth.checkAuthAdmin,
  controllers.admin.updateChallenge
);

router.put(
  "/challenges/:challengeId/participants",
  middleWares.auth.checkLoggedIn,
  middleWares.auth.checkAuthAdmin,
  controllers.admin.updateParticipants
);

router.put(
  "/challenges/:challengeId/ranking",
  middleWares.auth.checkLoggedIn,
  middleWares.auth.checkAuthAdmin,
  controllers.admin.updateRanking
);

router.delete(
  "/challenges/:challengeId",
  middleWares.auth.checkLoggedIn,
  middleWares.auth.checkAuthAdmin,
  controllers.admin.deleteChallenge
);

router.get("/signout", (req, res) => {
  res.clearCookie("authorization-kaggle");
  res.redirect("/");
});

module.exports = router;
