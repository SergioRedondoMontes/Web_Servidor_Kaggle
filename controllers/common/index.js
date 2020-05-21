const User = require("../../models/userModel");
const Challenge = require("../../models/challengeModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { roles } = require("../../roles");
const fs = require("fs");
const DataFrame = require("dataframe-js").DataFrame;
const pyModel = require("../../public/tmp/py");

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
    res.cookie("authorization-kaggle", accessToken);
    res.redirect("/");
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
    if (!user.resetPassword) {
      res.redirect("/");
    } else {
      res.render("common/login", { form: "reset-password" });
    }
  } catch (error) {
    res.render("common/login");
  }
};

exports.getProfile = async (req, res, next) => {
  res.render("common/profile", {
    user: req.user,
    appUser: req.user || null,
    loggedIn: req.user ? true : false,
  });
};

exports.updateUser = async (req, res, next) => {
  try {
    const update = req.body;
    const userId = req.user._id;
    if (update.password) {
      update.password = await hashPassword(update.password);
    }
    await User.findByIdAndUpdate(userId, update);
    const user = await User.findById(userId);
    res.redirect("/profile");
  } catch (error) {
    next(error);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const userId = req.user._id;
    await User.findByIdAndDelete(userId);
    res.redirect("/signout");
  } catch (error) {
    next(error);
  }
};

exports.postChallenge = async (req, res, next) => {
  console.log(req.body);
  //   res.send(req.files);
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

    // CREATE BASE CSV
    const pathBase = `./public/data/challenges/${challengeId}/${
      req.files["base"][0].path.split("/")[
        req.files["base"][0].path.split("/").length - 1
      ]
    }`;

    fs.renameSync(`./${req.files["base"][0].path}`, pathBase);

    paths.base =
      process.env.URL_PAGE +
      `/data/challenges/${challengeId}/${
        req.files["base"][0].path.split("/")[
          req.files["base"][0].path.split("/").length - 1
        ]
      }`;

    let filename = new Date().getTime();

    // CREATE DEV CSV
    DataFrame.fromCSV(paths.base)
      .then((df) => {
        let df1 = df.drop(df.listColumns()[df.listColumns().length - 1]);

        df1.toCSV(
          true,
          `./public/data/challenges/${challengeId}/` + filename + ".csv"
        );
      })
      .catch((err) => {
        console.log(err);
      });
    paths.dev =
      process.env.URL_PAGE +
      `/data/challenges/${challengeId}/` +
      filename +
      ".csv";

    // CREATE EXAMPLE CSV
    const pathExample = `./public/data/challenges/${challengeId}/${
      req.files["example"][0].path.split("/")[
        req.files["example"][0].path.split("/").length - 1
      ]
    }`;
    fs.renameSync(`./${req.files["example"][0].path}`, pathExample);

    paths.example =
      process.env.URL_PAGE +
      `/data/challenges/${challengeId}/${
        req.files["example"][0].path.split("/")[
          req.files["example"][0].path.split("/").length - 1
        ]
      }`;

    // CREATE PYTHON FILE
    fs.writeFile(
      `./public/data/challenges/${challengeId}/competition.py`,
      pyModel.pyTemplate(challengeId),
      (err) => {
        if (err) console.log(err);
      }
    );
    paths.python =
      process.env.URL_PAGE + `/data/challenges/${challengeId}/competition.py`;

    await Challenge.findByIdAndUpdate(
      challengeId,
      { url_files: paths },
      function (err, updatedChallenge) {
        if (err) throw err;
        const challenge = updatedChallenge;
        res.redirect(`/challenges/${challengeId}/edit`);
      }
    );
  } catch (error) {
    next(error);
  }
};

exports.getMyChallenges = async (req, res, next) => {
  try {
    const challenges = await Challenge.find({ owner: req.user._id });
    res.render("common/mychallenges", {
      challenges: challenges,
      appUser: req.user || null,
      loggedIn: req.user ? true : false,
    });
  } catch (error) {
    next(error);
  }
};

exports.getChallenges = async (req, res, next) => {
  try {
    const challenges = await Challenge.find({});
    res.render("common/home", {
      challenges: challenges,
      appUser: req.user || null,
      loggedIn: req.user ? true : false,
    });
  } catch (error) {
    next(error);
  }
};

exports.getMyChallenge = async (req, res, next) => {
  try {
    const challengeId = req.params.challengeId;
    const challenge = await Challenge.findById(challengeId);
    if (!challenge) return next(new Error("Challenge does not exist"));
    res.render("common/challengeEdit", {
      challenge: challenge,
      appUser: req.user || null,
      loggedIn: req.user ? true : false,
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
    res.render("common/challenge", {
      challenge: challenge,
      appUser: req.user || null,
      loggedIn: req.user ? true : false,
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
    res.redirect(`/challenges/${challenge._id}/edit`);
  } catch (error) {
    next(error);
  }
};
exports.updateParticipants = async (req, res, next) => {
  try {
    const challengeId = req.params.challengeId;
    const participant = await Challenge.find({
      "participant.userId": req.user._id,
      challengeId,
    });
    console.log("participant", participant);
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
        }
      );
      const challenge = await Challenge.findById(challengeId);
      res.render("common/challenge", {
        challenge: challenge,
        appUser: req.user || null,
        loggedIn: req.user ? true : false,
        alert: "participant-added",
      });
    } else {
      res.redirect("/");
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
    res.redirect("/challenges");
  } catch (error) {
    next(error);
  }
};

exports.uploadPredictions = async (req, res, next) => {
  try {
    DataFrame.fromCSV(process.env.URL_PAGE + "/tmp/" + req.file.filename).then(
      async (df) => {
        const baseValues = df
          .select(df.listColumns()[df.listColumns().length - 1])
          .toArray();
        let count = 0;

        df.withColumn(
          df.listColumns()[df.listColumns().length - 1],
          (row, j) => {
            if (baseValues[j][0] < 0.5) {
              baseValues[j][0] = "0";
            } else {
              baseValues[j][0] = "1";
            }
          }
        );

        const challenge = await Challenge.findById(req.params.challengeId);
        if (!challenge) return next(new Error("Challenge does not exist"));

        DataFrame.fromCSV(challenge.url_files.base).then(async (df1) => {
          let modifyValues = df1
            .select(df1.listColumns()[df1.listColumns().length - 1])
            .toArray();

          for (let index = 0; index < baseValues.length; index++) {
            if (baseValues[index][0] == modifyValues[index][0]) {
              count += 1;
            }
          }

          let score = count / baseValues.length;

          await Challenge.findByIdAndUpdate(
            req.params.challengeId,
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
              res.json({ score: score });
            }
          );
        });
      }
    );
  } catch (error) {
    next(error);
  }
};

exports.loginBeforePredictions = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({
      email,
    });
    if (!user) {
      res.send("Wrong username or password");
    } else {
      req.user = user;
      next();
    }
  } catch (error) {
    res.send("Wrong username or password");
  }
};
