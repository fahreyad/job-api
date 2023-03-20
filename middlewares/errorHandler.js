const { StatusCodes } = require("http-status-codes");
const errorHandlerMiddleware = (err, req, res, next) => {
  let customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || "Something wrong please try again",
  };
  if (err.code && err.code === 11000) {
    (customError.statusCode = StatusCodes.BAD_REQUEST),
      (customError.msg = `Duplicate ${Object.keys(
        err.keyValue
      )}. please provide a new one`);
  }
  if (err.name === "ValidationError") {
    customError.msg = Object.values(err.errors).map((item) => item.message);
    customError.statusCode = StatusCodes.BAD_REQUEST;
  }
  if (err.name === "CastError") {
    customError.msg = `data not found with id: ${err.value._id}`;
    customError.statusCode = StatusCodes.BAD_REQUEST;
  }
  return res.status(customError.statusCode).json({ msg: customError.msg });
};
module.exports = errorHandlerMiddleware;
