const { BadRequest } = require("../errors");

const testUser = (req, res, next) => {
  if (req.user.testUser) {
    throw new BadRequest("Test user,read only");
  }
  next();
};

module.exports = testUser;
