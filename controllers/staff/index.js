const User = require("../../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { roles } = require("../../roles");

exports.getUsers = async (req, res, next) => {
  const users = await User.find({ role: { $in: ["player", "challenger"] } });
  res.status(200).json({
    data: users,
  });
};

exports.getUser = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);
    if (!user) return next(new Error("User does not exist"));
    res.status(200).json({
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const update = req.body;
    const userId = req.params.userId;
    await User.findByIdAndUpdate(userId, update);
    const user = await User.findById(userId);
    res.status(200).json({
      data: user,
      message: "User has been updated",
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    await User.findByIdAndDelete(userId);
    res.status(200).json({
      data: null,
      message: "User has been deleted",
    });
  } catch (error) {
    next(error);
  }
};

exports.postChallenge = async (req, res, next) => {
  try {
    const { title, description } = req.body;
    const newChallenge = new Challenge({
      title,
      description,
      owner: req.user._id,
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
      message: "Challenge has been updated",
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
      message: "Challenge has been deleted",
    });
  } catch (error) {
    next(error);
  }
};
