// server/routes/route.js
const express = require("express");
const router = express.Router();
// const userController = require("../controllers/userController");
// const middleWare = require("../middlewares");
// const challengeController = require("../controllers/challengeController");
// const controller = require("../controllers");
const common = require("./common");
const admin = require("./admin");
const staff = require("./staff");
const start = require("./start");

// NOT LOGGED IN VIEWS
router.use("/", common);
router.use("/admin", admin);
router.use("/staff", staff);
router.use("/start", start);

//Users routes
// router.get(
//   "/users/:userId",
//   userController.allowIfLoggedin,
//   middleWare.profile.checkAccessActionProfile("read"),
//   userController.getUser
// );

// router.get(
//   "/users",
//   userController.allowIfLoggedin,
//   userController.grantAccess("readAny", "profile"),
//   userController.getUsers
// );

// router.put(
//   "/users/:userId",
//   userController.allowIfLoggedin,
//   userController.grantAccess("updateAny", "profile"),
//   userController.updateUser
// );

// router.delete(
//   "/users/:userId",
//   userController.allowIfLoggedin,
//   userController.grantAccess("deleteAny", "profile"),
//   userController.deleteUser
// );

// //Challenge routes
// router.get(
//   "/challenges/:challengeId",
//   challengeController.allowIfLoggedin,
//   challengeController.getChallenge
// );

// router.get(
//   "/challenges",
//   challengeController.allowIfLoggedin,
//   challengeController.grantAccess("readAny", "challenge"),
//   challengeController.getChallenges
// );

// router.post(
//   "/challenges",
//   challengeController.allowIfLoggedin,
//   challengeController.grantAccess("createAny", "challenge"),
//   challengeController.postChallenge
// );

// router.put(
//   "/challenges/:challengeId",
//   challengeController.allowIfLoggedin,
//   //si es mio
//   // challengeController.grantAccess("updateOwn", "challenge"),
//   //si es mio o de otro
//   //challengeController.grantAccess("updateAny", "challenge"),
//   //mismo endpoint para ambas cosas
//   middleWare.challenge.checkAccessActionChallenge("update"),
//   challengeController.updateChallenge
// );

// router.delete(
//   "/challenges/:challengeId",
//   challengeController.allowIfLoggedin,
//   challengeController.grantAccess("deleteAny", "challenge"),
//   challengeController.deleteChallenge
// );

module.exports = router;
