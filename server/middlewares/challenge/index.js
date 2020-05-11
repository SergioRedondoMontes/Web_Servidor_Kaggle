const Challenge = require("../../models/challengeModel");
const { roles } = require("../../roles");

exports.checkAccessActionChallenge = function (action) {
  return async (req, res, next) => {
    try {
      // console.log(req);
      // check read any
      let permission = roles.can(req.user.role)[`${action}Any`]("challenge");
      //   check read own
      if (!permission.granted) {
        permission = roles.can(req.user.role)[`${action}Own`]("challenge");
        if (permission.granted) {
          try {
            const challengeId = req.params.challengeId;
            const challenge = await Challenge.findById(challengeId);
            const user = res.locals.loggedInUser;
            if (user._id != challenge.owner) {
              permission = { granted: false };
            }
          } catch (error) {
            return res.status(404).json({
              error: "Not found",
            });
          }
        }
      }
      console.log(permission.granted);
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
