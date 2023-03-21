const Job = require("../models/Job");
const { StatusCodes } = require("http-status-codes");
const { BadRequest, NotFound } = require("../errors");
const mongoose = require("mongoose");
const moment = require("moment");

const showStats = async (req, res) => {
  let stats = await Job.aggregate([
    { $match: { createdBy: mongoose.Types.ObjectId(req.user.userId) } },
    {
      $group: { _id: "$status", count: { $sum: 1 } },
    },
  ]);
  stats = stats.reduce((acc, curr) => {
    const { _id: title, count } = curr;
    acc[title] = count;
    return acc;
  }, {});

  let monthReport = await Job.aggregate([
    { $match: { createdBy: mongoose.Types.ObjectId(req.user.userId) } },
    {
      $group: {
        _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
        count: { $sum: 1 },
      },
    },
    {
      $sort: { "_id.year": -1, "_id.month": -1 },
    },
    {
      $limit: 6,
    },
  ]);
  monthReport = monthReport
    .map((item) => {
      const {
        _id: { year, month },
        count,
      } = item;
      const date = moment()
        .month(month - 1)
        .year(year)
        .format("MMM Y");
      return { date, count };
    })
    .reverse();
  res.status(StatusCodes.OK).json({
    defautStates: {
      interview: stats.interview || 0,
      pending: stats.pending || 0,
      declined: stats.declined || 0,
    },
    monthlyStats: monthReport,
  });
};
const getJobs = async (req, res) => {
  const { page, jobType, search, sort, status } = req.query;
  const queryObj = {
    createdBy: req.user.userId,
  };
  if (search) {
    queryObj.position = { $regex: search, $options: "i" };
  }
  if (jobType && jobType !== "all") {
    queryObj.jobType = jobType;
  }
  if (status && status !== "all") {
    queryObj.status = status;
  }
  const result = Job.find(queryObj);
  if (sort) {
    switch (sort) {
      case "latest":
        result.sort("-createdAt");
        break;
      case "oldest":
        result.sort("createdAt");
        break;
      case "a-z":
        result.sort("position");
        break;
      case "z-a":
        result.sort("-position");
        break;

      default:
        result.sort("createdAt");
        break;
    }
  }
  const pageNum = page || 1;
  const limit = process.env.PER_PAGE || 10;
  const skip = (page - 1) * limit;
  const jobs = await result.skip(skip).limit(limit);
  const totalJobs = await Job.countDocuments(queryObj);
  const numofPages = Math.ceil(totalJobs / limit);
  res.status(StatusCodes.OK).json({ jobs, totalJobs, numofPages });
};
const createJobs = async (req, res) => {
  req.body.createdBy = req.user.userId;
  const user = await Job.create(req.body);
  res.status(StatusCodes.CREATED).json(user);
};
const singleJobs = async (req, res) => {
  const {
    user: { userId },
    params: { id: jobId },
  } = req;
  const job = await Job.findById({
    _id: jobId,
    createdBy: userId,
  });
  if (!job) {
    throw new NotFound(`data not found with ${jobId}`);
  }
  res.status(StatusCodes.OK).json({ job: job });
};
const updateJobs = async (req, res) => {
  const {
    body: { company, position },
    user: { userId },
    params: { id: jobId },
  } = req;
  if (company === "" || position === "") {
    throw new BadRequest("company & position will not be empty ");
  }
  const job = await Job.findByIdAndUpdate(
    {
      _id: jobId,
      createdBy: userId,
    },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );
  if (!job) {
    throw new NotFound(`data not found with ${jobId}`);
  }
  res.status(StatusCodes.OK).json({ job: job });
};
const deleteJobs = async (req, res) => {
  const {
    user: { userId },
    params: { id: jobId },
  } = req;
  const job = await Job.findByIdAndRemove({
    _id: jobId,
    createdBy: userId,
  });
  if (!job) {
    throw new NotFound(`data not found with ${jobId}`);
  }
  res.status(StatusCodes.OK).send();
};

module.exports = {
  getJobs,
  createJobs,
  singleJobs,
  updateJobs,
  deleteJobs,
  showStats,
};
