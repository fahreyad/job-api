const { Unauthenticate } = require("../errors");
const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
  const authorization = req.headers.authorization;
  if (!authorization || !authorization.startsWith("Bearer ")) {
    throw new Unauthenticate("user unauthorize");
  }
  const token = authorization.split(" ")[1];

  try {
    const varify = await jwt.verify(token, process.env.JWT_SECRET);
    if (!varify) {
      throw new Unauthenticate("user unauthorize");
    }
    req.user = { userId: varify.id };
    next();
  } catch (error) {
    throw new Unauthenticate("user unauthorize");
  }
};
module.exports = auth;
