const User = require("../../models/userModel");
const Challenge = require("../../models/challengeModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { roles } = require("../../roles");

async function hashPassword(password) {
  return await bcrypt.hash(password, 10);
}

async function validatePassword(plainPassword, hashedPassword) {
  return await bcrypt.compare(plainPassword, hashedPassword);
}

exports.signup = async (req, res, next) => {
  try {
    const { email, password, role } = req.body;
    const hashedPassword = await hashPassword(password);
    const newUser = new User({
      email,
      password: hashedPassword,
      role: role || "player",
    });
    const accessToken = jwt.sign(
      { userId: newUser._id },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );
    newUser.accessToken = accessToken;
    await newUser.save();
    res.cookie("authorization-kaggle", accessToken);
    res.redirect("/");
  } catch (error) {
    res.render("common/signup");
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({
      email,
      role: { $in: ["player", "challenger"] },
    });
    if (!user) res.render("common/login", { alert: "email", email: email });
    console.log(user);
    const validPassword = await validatePassword(password, user.password);
    if (!validPassword)
      res.render("common/login", { alert: "password", email: email });
    const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    await User.findByIdAndUpdate(user._id, { accessToken });
    res.cookie("authorization-kaggle", accessToken);
    res.redirect("/");
  } catch (error) {
    res.render("common/login");
  }
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
  try {
    const challenges = await Challenge.find({});
    res.status(200).json({
      data: challenges,
    });
  } catch (error) {
    next(error);
  }
};

exports.getChallenge = async (req, res, next) => {
  try {
    const challengeId = req.params.challengeId;
    const challenge = await Challenge.findById(challengeId);
    if (!challenge) return next(new Error("Challenge does not exist"));
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