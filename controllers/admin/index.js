const User = require("../../models/userModel");
const Challenge = require("../../models/challengeModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { roles } = require("../../roles");
const staffControllers = require("../staff");
const fs = require("fs");
const DataFrame = require("dataframe-js").DataFrame;
const pyModel = require("../../public/tmp/py");

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
    res.redirect("/admin/dashboard");
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
    res.redirect(`/admin/users/${user._id.toString()}`);
  } catch (error) {
    next(error);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    await User.findByIdAndUpdate(userId, { $set: { resetPassword: true } });
    const user = await User.findById(userId);
    res.redirect(`/admin/users/${user._id.toString()}`);
  } catch (error) {
    next(error);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    await User.findByIdAndDelete(userId);
    res.redirect("/admin/users");
  } catch (error) {
    next(error);
  }
};

exports.postChallenge = async (req, res, next) => {
  console.log("req body", req.body);
  console.log("req files", req.files);
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
        res.redirect(`/admin/challenges/${challengeId}`);
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
    res.redirect(`/admin/challenges/${challenge._id.toString()}`);
  } catch (error) {
    next(error);
  }
};

exports.deleteChallenge = async (req, res, next) => {
  try {
    const challengeId = req.params.challengeId;
    await Challenge.findByIdAndDelete(challengeId);
    res.redirect("/admin/challenges");
  } catch (error) {
    next(error);
  }
};

exports.getDashboard = async (req, res, next) => {
  try {
    const challenges = await Challenge.find({});
    const users = await User.find({});
    res.render("admin/dashboard", {
      challenges,
      users,
      appUser: res.locals.loggedInUser || null,
      loggedIn: true,
    });
  } catch (error) {
    res.redirect("/");
  }
};
