const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const { BadRequest } = require("../errors");
const { Unauthenticate } = require("../errors");
const jwt = require("jsonwebtoken");
const register = async (req, res) => {
  const user = await User.create({ ...req.body });
  const token = user.createJWT();
  res
    .status(StatusCodes.CREATED)
    .json({ user: { name: user.getName() }, token });
};
const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequest("please provide email & password");
  }
  const user = await User.findOne({ email: email });
  if (!user) {
    throw new Unauthenticate("user unauthenticate");
  }
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    throw new Unauthenticate("user unauthenticate");
  }
  const token = user.createJWT();
  res.status(StatusCodes.OK).json({ user: { name: user.getName() }, token });
};
module.exports = {
  register,
  login,
};
