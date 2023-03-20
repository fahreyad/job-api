const mongoose = require("mongoose");
const JobSchema = mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, "Company name required"],
    },
    position: {
      type: String,
      required: [true, "Position name required"],
    },
    status: {
      type: String,
      enum: ["inteview", "decliend", "pending"],
      default: "pending",
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Job", JobSchema);
