// server/models/userModel.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ChallengeSchema = new Schema(
  {
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
    dateStart: {
      type: String,
      required: true,
    },
    dateEnd: {
      type: String,
      required: true,
    },
    participant: [
      {
        userId: {
          type: String,
        },
        username: {
          type: String,
        },
        date: {
          type: Date,
        },
        _id: false,
      },
    ],
    ranking: [
      {
        userId: {
          type: String,
        },
        username: {
          type: String,
        },
        score: {
          type: Number,
        },
        date: {
          type: Date,
        },
      },
    ],
    url_files: {
      base: {
        type: String,
      },
      example: {
        type: String,
      },
      dev: {
        type: String,
      },
      python: {
        type: String,
      },
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

const Challenge = mongoose.model("challenge", ChallengeSchema);

module.exports = Challenge;
