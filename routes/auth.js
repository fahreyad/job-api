const express = require("express");
const auth = require("../middlewares/auth");
const rateLimiter = require("express-rate-limit");
const apiLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  message: {
    msg: "to many request from this IP, please wait 15 miniuts",
  },
});
const router = express.Router();
const { login, register, updateUser } = require("../controllers/auth");
const testUser = require("../middlewares/testUser");
router.route("/login").post(apiLimiter, login);
router.route("/register").post(apiLimiter, register);
router.route("/update-user").patch(auth, testUser, updateUser);
module.exports = router;
