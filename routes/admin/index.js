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

router.post("/users", controllers.admin.postUser);

router.get("/users", controllers.admin.getUsers);

router.get("/employees", controllers.admin.getEmployees);

router.get("/users/:userId", controllers.admin.getUser);

router.put("/users/:userId", controllers.admin.updateUser);

router.put("/users/:userId/resetPassword", controllers.admin.resetPassword);

router.delete("/users/:userId", controllers.admin.deleteUser);

router.get("/challenges", controllers.admin.getChallenges);

router.get("/challenges/:challengeId", controllers.admin.getChallenge);

router.post(
  "/challenges",
  middleWares.auth.checkLoggedIn,
  controllers.admin.postChallenge
);

router.put("/challenges/:challengeId", controllers.admin.updateChallenge);

router.put(
  "/challenges/:challengeId/participants",
  middleWares.auth.checkLoggedIn,
  controllers.admin.updateParticipants
);

router.put(
  "/challenges/:challengeId/ranking",
  middleWares.auth.checkLoggedIn,
  controllers.admin.updateRanking
);

router.delete("/challenges/:challengeId", controllers.admin.deleteChallenge);

router.get("/signout", (req, res) => {
  res.clearCookie("authorization-kaggle");
  res.redirect("/");
});

module.exports = router;
