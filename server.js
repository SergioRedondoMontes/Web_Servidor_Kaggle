// server/server.js
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const path = require("path");
const User = require("./models/userModel");
const routes = require("./routes");
const register = require("@react-ssr/express/register");

const cookieParser = require("cookie-parser");

const app = express();
(async () => {
  await register(app);

  app.use(cookieParser());

  require("dotenv").config({
    path: path.join(__dirname, "../.env"),
  });
  const PORT = process.env.PORT || 3000;

  mongoose.connect("mongodb://localhost:27017/rbac").then(() => {
    console.log("Connected to the Database successfully");
  });

  app.use(bodyParser.urlencoded({ extended: true }));

  app.use(async (req, res, next) => {
    // CHECK EXISTS ACCESS TOKEN IN HEADERS
    try {
      if (req.headers["x-access-token"]) {
        const accessToken = req.headers["x-access-token"];
        const { userId, exp } = await jwt.verify(
          accessToken,
          process.env.JWT_SECRET
        );
        // Check if token has expired
        if (exp < Date.now().valueOf() / 1000) {
          return res.status(401).json({
            error: "JWT token has expired, please login to obtain a new one",
          });
        }
        res.locals.loggedInUser = await User.findById(userId);
        next();
      } else {
        // CHECK EXISTS ACCESS TOKEN IN COOKIE
        if (req.cookies["authorization-kaggle"]) {
          const accessToken = req.cookies["authorization-kaggle"];
          const { userId, exp } = await jwt.verify(
            accessToken,
            process.env.JWT_SECRET
          );
          // Check if token has expired
          if (exp < Date.now().valueOf() / 1000) {
            return res.status(401).json({
              error: "JWT token has expired, please login to obtain a new one",
            });
          }
          res.locals.loggedInUser = await User.findById(userId);
          next();
        } else {
          next();
        }
      }
    } catch (err) {
      res.send("ho ");
    }
  });

  app.use("/", routes);
  app.listen(PORT || 3000, () => {
    console.log("Server is listening on Port:", PORT);
  });
})();
