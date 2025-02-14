const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema(
  {
    originalURL: {
      type: String,
      required: true,
    },
    shortId: {
      type: String,
      required: true,
      unique: true,
    },
    visitHistory: [
      {
        timestamp: {
          type: Number,
        },
      },
    ],
    deviceInfo: [
      {
        device: { type: String },
        browser: { type: String },
        os: { type: String },
      },
    ],
    locationInfo: [{
        country: { type: String },
        region: { type: String },
        city: { type: String },
    }],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
  },
  
  { timestamps: true }
);

const User = mongoose.model("Url", urlSchema);

module.exports = User;
