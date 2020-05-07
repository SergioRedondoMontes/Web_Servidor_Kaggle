// server/models/userModel.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ChallengeSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  accessToken: {
    type: String,
  },
});

const User = mongoose.model("challenge", ChallengeSchema);

module.exports = Challenge;
