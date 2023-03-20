const Job = require("../models/Job");
const { StatusCodes } = require("http-status-codes");
const { BadRequest, NotFound } = require("../errors");
const getJobs = async (req, res) => {
  const jobs = await Job.find({ createdBy: req.user.userId }).sort("createdAt");
  res.status(StatusCodes.OK).json({ jobs: jobs, count: jobs.length });
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
};
