require("dotenv").config();
const connectDB = require("./db/connection");
const Job = require("./models/Job");
const mockData = require("./mock-jobs.json");

const start = async () => {
  try {
    console.log(process.env.MONGO_URI);
    await connectDB(process.env.MONGO_URI);
    await Job.deleteMany();
    await Job.create(mockData);
    console.log("success");
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
start();
