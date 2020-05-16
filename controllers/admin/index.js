const User = require("../../models/userModel");
const Challenge = require("../../models/challengeModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { roles } = require("../../roles");
const staffControllers = require("../staff");

async function hashPassword(password) {
  return await bcrypt.hash(password, 10);
}

async function validatePassword(plainPassword, hashedPassword) {
  return await bcrypt.compare(plainPassword, hashedPassword);
}

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({
      email,
      role: "admin",
    });
    if (!user) res.render("admin/login", { alert: "email", email: email });
    console.log(user);
    const validPassword = await validatePassword(password, user.password);
    if (!validPassword)
      res.render("admin/login", { alert: "password", email: email });
    const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    await User.findByIdAndUpdate(user._id, { accessToken });
    res.cookie("authorization-kaggle", accessToken);
    res.redirect("/admin/home");
  } catch (error) {
    res.render("admin/login");
  }
};

exports.postUser = async (req, res, next) => {
  try {
    const { username, name, surname, email, role, payment } = req.body;
    const hashedPassword = await hashPassword("password");
    const newUser = new User({
      username,
      name,
      surname,
      email,
      password: hashedPassword,
      role: role || "player",
      payment,
      resetPassword: false,
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
    res.redirect("/admin/users");
  } catch (error) {
    res.render("admin/users", {
      alert: "email-exists",
      dialogOpen: true,
      users: { username, name, surname, email, role },
      appUser: res.locals.loggedInUser,
      loggedIn: true,
    });
  }
};

exports.getUsers = staffControllers.getUsers;

exports.postEmployee = async (req, res, next) => {
  const { username, name, surname, email } = req.body;
  try {
    const hashedPassword = await hashPassword("password");
    const newUser = new User({
      username,
      name,
      surname,
      email,
      password: hashedPassword,
      role: "employee",
      resetPassword: false,
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
    res.redirect("/admin/employees");
  } catch (error) {
    res.render("admin/employees", {
      alert: "email-exists",
      dialogOpen: true,
      employee: { username, name, surname, email },
      appUser: res.locals.loggedInUser,
      loggedIn: true,
    });
  }
};

exports.getEmployees = async (req, res, next) => {
  try {
    const employees = await User.find({ role: { $in: ["employee"] } });
    res.render("admin/employees", {
      employees,
      appUser: res.locals.loggedInUser,
      loggedIn: true,
    });
  } catch (error) {
    next(error);
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

exports.resetPassword = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    await User.findByIdAndUpdate(userId, { $set: { resetPassword: true } });
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
    const { title, description, url_files } = req.body;
    const newChallenge = new Challenge({
      title,
      description,
      owner: req.user._id,
      participant: [],
      ranking: [],
      url_files: ["url1", "url2"],
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

exports.updateParticipants = async (req, res, next) => {
  try {
    const challengeId = req.params.challengeId;
    await Challenge.findByIdAndUpdate(
      challengeId,
      {
        $addToSet: {
          participant: {
            userId: req.user._id,
            username: req.user.username,
          },
        },
      },
      function (err, updatedChallenge) {
        if (err) throw err;
        const challenge = updatedChallenge;
        res.status(200).json({
          data: challenge,
          message: "Challenge has been updated",
        });
      }
    );
  } catch (error) {
    next(error);
  }
};

exports.updateRanking = async (req, res, next) => {
  try {
    const { score } = req.body;
    const challengeId = req.params.challengeId;
    await Challenge.findByIdAndUpdate(
      challengeId,
      {
        $addToSet: {
          ranking: {
            userId: req.user._id,
            username: req.user.username,
            score,
            date: new Date(),
          },
        },
      },
      function (err, updatedChallenge) {
        if (err) throw err;
        const challenge = updatedChallenge;
        res.status(200).json({
          data: challenge,
          message: "Challenge has been updated",
        });
      }
    );
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
