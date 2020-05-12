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
  owner: {
    type: String,
    required: true,
  },
});

const Challenge = mongoose.model("challenge", ChallengeSchema);

module.exports = Challenge;
