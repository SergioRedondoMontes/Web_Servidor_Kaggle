const express = require("express");
const router = express.Router();
const middleWares = require("../../middlewares");
const controllers = require("../../controllers");
const User = require("../../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// AUTH ROUTES

async function hashPassword(password) {
  return await bcrypt.hash(password, 10);
}

router.get("/", async (req, res, next) => {
  try {
    const hashedPassword = await hashPassword("password");
    const newUser = new User({
      username: "adminKaggle",
      name: "Administrador",
      surname: "Kaggle",
      email: "admin@kaggle.es",
      password: hashedPassword,
      role: "admin",
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

    res.redirect("/");
  } catch (error) {
    // console.log(error);
    res.redirect("/");
  }
});

// END CHALLENGE ROUTES

module.exports = router;
