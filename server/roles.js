// server/roles.js
const AccessControl = require("accesscontrol");
const ac = new AccessControl();

exports.roles = (function () {
  ac.grant("competidor")
    .readOwn("profile")
    .updateOwn("profile")
    .deleteOwn("profile")
    .readAny("challenge");

  ac.grant("desafiador")
    .extend("competidor")
    .updateOwn("challenge")
    .deleteOwn("challenge");

  ac.grant("empleado").extend("desafiador").updateAny("challenge");

  ac.grant("admin")
    .extend("competidor")
    .extend("desafiador")
    .extend("empleado")
    .readAny("profile")
    .updateAny("profile")
    .deleteAny("profile")
    .deleteAny("challenge");

  return ac;
})();
