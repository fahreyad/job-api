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
      enum: {
        values: ["interview", "declined", "pending"],
        message: "{VALUE} not supported",
      },
      default: "pending",
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    jobType: {
      type: String,
      enum: {
        values: ["full-time", "part-time", "remote", "intern"],
        message: "{VALUE} not supported",
      },
      default: "full-time",
    },
    jobLocation: {
      type: String,
      required: [true, "Job location is required"],
      default: "my city",
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Job", JobSchema);
