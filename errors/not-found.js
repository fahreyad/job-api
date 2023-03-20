const CustomErrorAPI = require("./custom-error");
const { StatusCodes } = require("http-status-codes");
class NotFound extends CustomErrorAPI {
  constructor(message) {
    super(message);
    this.status = StatusCodes.NOT_FOUND;
  }
}

module.exports = NotFound;
