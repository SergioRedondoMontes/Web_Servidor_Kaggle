// server/routes/route.js
const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const challengeController = require("../controllers/challengeController");

router.post("/signup", userController.signup);

router.post("/login", userController.login);

//Users routes
router.get(
  "/user/:userId",
  userController.allowIfLoggedin,
  userController.getUser
);

router.get(
  "/users",
  userController.allowIfLoggedin,
  userController.grantAccess("readAny", "profile"),
  userController.getUsers
);

router.put(
  "/user/:userId",
  userController.allowIfLoggedin,
  userController.grantAccess("updateAny", "profile"),
  userController.updateUser
);

router.delete(
  "/user/:userId",
  userController.allowIfLoggedin,
  userController.grantAccess("deleteAny", "profile"),
  userController.deleteUser
);

//Challenge routes
router.get(
  "/challenge/:challengeId",
  challengeController.allowIfLoggedin,
  challengeController.getChallenge
);

router.get(
  "/challenges",
  challengeController.allowIfLoggedin,
  challengeController.grantAccess("readAny", "challenge"),
  challengeController.getChallenges
);

router.post(
  "/challenge",
  challengeController.allowIfLoggedin,
  challengeController.grantAccess("createAny", "challenge"),
  challengeController.postChallenge
);

router.put(
  "/challenge/:challengeId",
  challengeController.allowIfLoggedin,
  //si es mio
  challengeController.grantAccess("updateOwn", "challenge"),
  //si es mio o de otro
  //challengeController.grantAccess("updateAny", "challenge"),
  //mismo endpoint para ambas cosas
  challengeController.updateChallenge
);

router.delete(
  "/challenge/:challengeId",
  challengeController.allowIfLoggedin,
  challengeController.grantAccess("deleteAny", "challenge"),
  challengeController.deleteChallenge
);

module.exports = router;
