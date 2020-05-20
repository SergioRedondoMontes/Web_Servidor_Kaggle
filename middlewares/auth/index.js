const { roles } = require("../../roles");

exports.checkLoggedIn = function (req, res, next) {
  try {
    const user = res.locals.loggedInUser;
    if (!user) res.redirect("/");
    req.user = user;
    next();
  } catch (error) {
    res.redirect("/");
  }
};

exports.checkExistsLoggedIn = function (req, res, next) {
  try {
    const user = res.locals.loggedInUser;
    req.user = user;
    next();
  } catch (error) {
    next();
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

exports.checkAuthAdmin = function (req, res, next) {
  if (req.user) {
    if (req.user.role === "admin") {
      next();
    } else {
      res.redirect("/");
    }
  } else {
    res.redirect("/");
  }
};

exports.checkAuthChallenger = function (req, res, next) {
  if (req.user) {
    if (req.user.role === "challenger") {
      next();
    } else {
      res.redirect("/");
    }
  } else {
    res.redirect("/");
  }
};

exports.checkAuthStaff = function (req, res, next) {
  if (req.user) {
    if (req.user.role === "employee") {
      next();
    } else {
      res.redirect("/");
    }
  } else {
    res.redirect("/");
  }
};
