const express = require("express");
const router = express.Router();

const {
  getJobs,
  createJobs,
  singleJobs,
  updateJobs,
  deleteJobs,
} = require("../controllers/job");
router.route("/").get(getJobs).post(createJobs);
router.route("/:id").get(singleJobs).patch(updateJobs).delete(deleteJobs);

module.exports = router;
