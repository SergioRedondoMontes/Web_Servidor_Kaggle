const express = require("express");
const router = express.Router();
const middleWares = require("../../middlewares");
const controllers = require("../../controllers");

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
    role: user ? user.role : null,
  });
});

module.exports = router;
