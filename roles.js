// server/roles.js
const AccessControl = require("accesscontrol");
const ac = new AccessControl();

exports.roles = (function () {
  ac.grant("player")
    .readOwn("profile")
    .updateOwn("profile")
    .deleteOwn("profile")
    .readAny("challenge");

  ac.grant("challenger")
    .extend("player")
    .createAny("challenge")
    .updateOwn("challenge")
    .deleteOwn("challenge");

  ac.grant("employee").extend("challenger").updateAny("challenge");

  ac.grant("admin")
    .extend("player")
    .extend("challenger")
    .extend("employee")
    .readAny("profile")
    .updateAny("profile")
    .deleteAny("profile")
    .deleteAny("challenge");

  return ac;
})();
