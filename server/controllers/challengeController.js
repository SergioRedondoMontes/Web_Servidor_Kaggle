// server/controllers/userController.js

const Challenge = require("../models/challengeModel");
const { roles } = require("../roles");

exports.postChallenge = async (req, res, next) => {
  try {
    const { title, description } = req.body;
    const newChallenge = new Challenge({
      title,
      description,
    });
    await newChallenge.save();
    res.json({
      data: newChallenge,
    });
  } catch (error) {
    next(error);
  }
};

exports.getChallenges = async (req, res, next) => {
  const challenges = await Challenge.find({});
  res.status(200).json({
    data: challenges,
  });
};

exports.getChallenge = async (req, res, next) => {
  try {
    const challengeId = req.params.challengeId;
    const challenge = await Challenge.findById(challengeId);
    if (!challenge) return next(new Error("User does not exist"));
    res.status(200).json({
      data: challenge,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateChallenge = async (req, res, next) => {
  try {
    const update = req.body;
    const challengeId = req.params.challengeId;
    await Challenge.findByIdAndUpdate(challengeId, update);
    const challenge = await Challenge.findById(challengeId);
    res.status(200).json({
      data: challenge,
      message: "User has been updated",
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteChallenge = async (req, res, next) => {
  try {
    const challengeId = req.params.challengeId;
    await Challenge.findByIdAndDelete(challengeId);
    res.status(200).json({
      data: null,
      message: "User has been deleted",
    });
  } catch (error) {
    next(error);
  }
};

exports.grantAccess = function (action, resource) {
  return async (req, res, next) => {
    try {
      const permission = roles.can(req.user.role)[action](resource);
      if (!permission.granted) {
        return res.status(401).json({
          error: "You don't have enough permission to perform this action",
        });
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};

exports.allowIfLoggedin = async (req, res, next) => {
  try {
    const user = res.locals.loggedInUser;
    if (!user)
      return res.status(401).json({
        error: "You need to be logged in to access this route",
      });
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
