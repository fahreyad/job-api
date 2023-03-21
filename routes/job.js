const express = require("express");
const router = express.Router();

const {
  getJobs,
  createJobs,
  singleJobs,
  updateJobs,
  deleteJobs,
  showStats,
} = require("../controllers/job");
const testUser = require("../middlewares/testUser");
router.route("/stats").get(showStats);
router.route("/").get(getJobs).post(testUser, createJobs);
router
  .route("/:id")
  .get(singleJobs)
  .patch(testUser, updateJobs)
  .delete(testUser, deleteJobs);

module.exports = router;
