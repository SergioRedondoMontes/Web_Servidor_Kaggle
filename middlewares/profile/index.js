const { roles } = require("../../roles");

exports.checkAccessActionProfile = function (action) {
  return async (req, res, next) => {
    try {
      // console.log(req);
      // check read any
      let permission = roles.can(req.user.role)[`${action}Any`]("profile");
      //   check read own
      if (!permission.granted) {
        const user = res.locals.loggedInUser;
        if (user._id == req.params.userId) {
          permission = roles.can(req.user.role)[`${action}Own`]("profile");
        }
      }

      if (permission.granted) {
        console.log("permision read own", permission);
        next();
      } else {
        return res.status(401).json({
          error: "You don't have enough permission to perform this action",
        });
      }
    } catch (error) {
      next(error);
    }
  };
};
