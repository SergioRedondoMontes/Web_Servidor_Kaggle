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

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({
      email,
      role: "employee",
    });
    if (!user) res.render("staff/login", { alert: "email", email: email });
    console.log(user);
    const validPassword = await validatePassword(password, user.password);
    if (!validPassword)
      res.render("staff/login", { alert: "password", email: email });
    const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    await User.findByIdAndUpdate(user._id, { accessToken });
    res.cookie("authorization-kaggle", accessToken);
    res.redirect("/staff/home");
  } catch (error) {
    res.render("staff/login");
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
  } catch (error) {
    next(error);
  }
};

exports.getUsers = async (req, res, next) => {
  const users = await User.find({ role: { $in: ["player", "challenger"] } });
  res.render("staff/users", {
    users,
    appUser: res.locals.loggedInUser,
    loggedIn: true,
  });
};

exports.getUser = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);
    if (!user) return next(new Error("User does not exist"));
    res.render("staff/user", {
      user,
      appUser: res.locals.loggedInUser,
      loggedIn: true,
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
    res.redirect(`/staff/users/${user._id.toString()}`);
  } catch (error) {
    next(error);
  }
};
exports.resetPassword = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    await User.findByIdAndUpdate(userId, { resetPassword: true });
    const user = await User.findById(userId);
    res.redirect(`/staff/users/${user._id.toString()}`);
  } catch (error) {
    next(error);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    await User.findByIdAndDelete(userId);
    res.redirect("/staff/users");
  } catch (error) {
    next(error);
  }
};

exports.postChallenge = async (req, res, next) => {
  try {
    const { title, description, dateStart, dateEnd } = req.body;
    const newChallenge = new Challenge({
      title,
      description,
      owner: req.user._id,
      participant: [],
      ranking: [],
      dateStart: dateStart,
      dateEnd: dateEnd,
      url_files: { base: "", example: "", dev: "", python: "" },
    });

    await newChallenge.save();
    const challengeId = newChallenge._id;
    fs.mkdirSync(`./public/data/challenges/${challengeId}/`);
    const paths = { base: "", example: "", dev: "", python: "" };

    DataFrame.fromCSV(req.file["base"][0].path).then((df) => {
      let df1 = df.drop(df1.listColumns()[df.listColumns().length]);
      //TODO: Cambiar url donde guardar
      let filename = new Date().getTime();
      df1.toCSV(
        true,
        `./public/data/challenges/${challengeId}/` + filename + ".csv"
      );
      path.dev =
        process.env.URL_PAGE +
        `/data/challenges/${challengeId}/` +
        filename +
        ".csv";
    });

    const pathBase = `./public/data/challenges/${challengeId}/${
      req.files["base"][0].path.split("/")[
        req.files["base"][0].path.split("/").length - 1
      ]
    }`;

    fs.renameSync(`./${req.file["base"][0].path}`, pathBase);

    path.base =
      process.env.URL_PAGE +
      `/data/challenges/${challengeId}/${
        req.files["base"][0].path.split("/")[
          req.files["base"][0].path.split("/").length - 1
        ]
      }`;

    const pathExample = `./public/data/challenges/${challengeId}/${
      req.files["example"][0].path.split("/")[
        req.files["example"][0].path.split("/").length - 1
      ]
    }`;
    fs.renameSync(`./${req.files["example"][0].path}`, pathExample);

    path.example =
      process.env.URL_PAGE +
      `/data/challenges/${challengeId}/${
        req.files["example"][0].path.split("/")[
          req.files["example"][0].path.split("/").length - 1
        ]
      }`;

    await Challenge.findByIdAndUpdate(
      challengeId,
      { url_files: paths },
      function (err, updatedChallenge) {
        if (err) throw err;
        const challenge = updatedChallenge;
        res.redirect(`/staff/challenges/${challengeId}`);
      }
    );
  } catch (error) {
    next(error);
  }
};

exports.getChallenges = async (req, res, next) => {
  const challenges = await Challenge.find({});
  res.render("staff/challenges", {
    challenges,
    appUser: res.locals.loggedInUser || null,
    loggedIn: true,
  });
};

exports.getChallenge = async (req, res, next) => {
  try {
    const challengeId = req.params.challengeId;
    const challenge = await Challenge.findById(challengeId);
    if (!challenge) return next(new Error("User does not exist"));
    res.render("staff/challenge", {
      challenge,
      appUser: res.locals.loggedInUser,
      loggedIn: true,
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
    res.redirect(`/staff/challenges/${challenge._id.toString()}`);
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
    res.redirect("/staff/challenges");
  } catch (error) {
    next(error);
  }
};

exports.uploadPredictions = async (req, res, next) => {
  try {
    DataFrame.fromCSV(req.file).then(async (df) => {
      const baseValues = df
        .select(df.listColumns()[df.listColumns().length])
        .toArray();
      let count;

      df.withColumn(df.listColumns()[df.listColumns().length], (row, j) => {
        if (baseValues[j][0] < 0.5) {
          return 0;
        } else {
          return 1;
        }
      });

      const challenge = await Challenge.findById(req.challengeId);
      if (!challenge) return next(new Error("Challenge does not exist"));

      DataFrame.fromCSV(challenge.url_files.base).then(async (df1) => {
        let modifyValues = df1
          .select(df1.listColumns()[df1.listColumns().length])
          .toArray();

        for (let index = 0; index < baseValues.length; index++) {
          if ((baseValues[index] = modifyValues[index])) count++;
        }

        let score = count / baseValues.length;

        await Challenge.findByIdAndUpdate(
          req.challengeId,
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
      });
    });
  } catch (error) {
    next(error);
  }
};
