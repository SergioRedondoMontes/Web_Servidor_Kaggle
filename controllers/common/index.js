const User = require("../../models/userModel");
const Challenge = require("../../models/challengeModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { roles } = require("../../roles");
const fs = require("fs");
const DataFrame = require("dataframe-js").DataFrame;

async function hashPassword(password) {
  return await bcrypt.hash(password, 10);
}

async function validatePassword(plainPassword, hashedPassword) {
  return await bcrypt.compare(plainPassword, hashedPassword);
}

exports.signup = async (req, res, next) => {
  const { username, name, surname, email, password, role, payment } = req.body;
  try {
    const hashedPassword = await hashPassword(password);
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
    res.send("entro");
    res.cookie("authorization-kaggle", accessToken);
    // res.redirect("/");
  } catch (error) {
    res.render("common/signup", {
      alert: "email-exists",
      user: { username, name, surname, email, role },
    });

    // res.render("common/signup");
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
    if (!user.restPassword) {
      res.redirect("/");
    } else {
      //TODO: render form change password / updateUser()
    }
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
  console.log(req.body);
  //   res.send(req.files);
  try {
    // console.log("body ,", JSON.parse(req));
    const { title, description } = req.body;
    const newChallenge = new Challenge({
      title,
      description,
      owner: req.user._id,
      participant: [],
      ranking: [],
      url_files: { base: "", example: "", dev: "", python: "" },
    });
    await newChallenge.save();
    const challengeId = newChallenge._id;
    fs.mkdirSync(`./public/challenges/${challengeId}/`);
    const paths = [];
    //TODO: CAMBIAR EL INSERTAR DE UN ARRAY A LOS OBJETOS CORRESPONDIENTES
    Object.keys(req.files).forEach((file, index) => {
      const path = `./public/challenges/${challengeId}/${
        req.files[file][0].path.split("/")[
          req.files[file][0].path.split("/").length - 1
        ]
      }`;
      fs.renameSync(`./${req.files[file][0].path}`, path);

      paths.push(path);
    });

    await Challenge.findByIdAndUpdate(
      challengeId,
      { url_files: paths },
      function (err, updatedChallenge) {
        if (err) throw err;
        const challenge = updatedChallenge;
        res.status(200).json({
          data: challenge,
          message: "Challenge has been updated",
        });
      }
    );

    // res.send("gola");
  } catch (error) {
    res.send(error);
    // res.send("que lo que");
    return;
  }
};

exports.getChallenges = async (req, res, next) => {
  try {
    console.log("entrooooo");
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
exports.updateParticipants = async (req, res, next) => {
  try {
    const challengeId = req.params.challengeId;
    const participant = await Challenge.find({
      "participant.userId": req.user._id,
    });
    // console.log("participant", participant);
    if (participant.length === 0) {
      await Challenge.findByIdAndUpdate(
        challengeId,
        {
          $addToSet: {
            participant: {
              userId: req.user._id,
              username: req.user.username,
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
    } else {
      res.send("ya existe");
    }
  } catch (error) {
    next(error);
  }
};

exports.updateRanking = async (req, res, next) => {
  try {
    const update = req.body;
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

exports.uploadPredictions = async (req, res, next) => {
  try {
    DataFrame.fromCSV(req.file).then((df) => {
      const baseValues = df.select(df.listColumns()[df.listColumns().length]).toArray();
      let count;

      df.withColumn(df.listColumns()[df.listColumns().length], (row, j) => {
        if (baseValues[j][0] < 0.5) {
          return 0;
        } else {
          return 1;
        }
      });

      const challenge = await Challenge.findById(challengeId);
      if (!challenge) return next(new Error("Challenge does not exist"));
        
      DataFrame.fromCSV(
        challenge.url_files.base
      ).then((df1) => {
        let modifyValues = df1.select(df1.listColumns()[df1.listColumns().length]).toArray();

        for (let index = 0; index < baseValues.length; index++) {
          if ((baseValues[index] = modifyValues[index])) count++;
        }

        res.send(count / baseValues.length);
      });
    });
  } catch (error) {
    next(error);
  }
};
