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

router.get("/users", controllers.admin.getUsers);

router.get("/employees", controllers.admin.getEmployees);

router.get("/users/:userId", controllers.admin.getUser);

router.put("/users/:userId", controllers.admin.updateUser);

router.delete("/users/:userId", controllers.admin.deleteUser);

router.get("/challenges", controllers.admin.getChallenges);

router.get("/challenges/:challengeId", controllers.admin.getChallenge);

router.post("/challenges", controllers.admin.postChallenge);

router.put("/challenges/:challengeId", controllers.admin.updateChallenge);

router.delete("/challenges/:challengeId", controllers.admin.deleteChallenge);

router.get("/signout", (req, res) => {
  res.clearCookie("authorization-kaggle");
  res.redirect("/");
});

module.exports = router;
