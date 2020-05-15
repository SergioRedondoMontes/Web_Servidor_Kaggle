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
      res.redirect("/staff/login");
    } else {
      next();
    }
  },
  middleWares.auth.checkLoggedIn,
  middleWares.auth.checkAuthAdmin,
  (req, res) => {
    res.redirect("/staff/home");
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
  res.render("staff/login");
});

// router.post("/login", controllers.staff.login);

router.get("/users", controllers.staff.getUsers);

router.post("/users", controllers.staff.postUser);

router.get("/users/:userId", controllers.staff.getUser);

router.put("/users/:userId", controllers.staff.updateUser);

router.put("/users/:userId/resetPassword", controllers.staff.resetPassword);

router.delete("/users/:userId", controllers.staff.deleteUser);

router.get("/challenges", controllers.staff.getChallenges);

router.get("/challenges/:challengeId", controllers.staff.getChallenge);

router.post(
  "/challenges",
  middleWares.auth.checkLoggedIn,
  controllers.staff.postChallenge
);

router.put("/challenges/:challengeId", controllers.staff.updateChallenge);

router.delete("/challenges/:challengeId", controllers.staff.deleteChallenge);

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

module.exports = router;
