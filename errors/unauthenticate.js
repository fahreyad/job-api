const CustomErrorAPI = require("./custom-error");
const { StatusCodes } = require("http-status-codes");
class Unauthenticate extends CustomErrorAPI {
  constructor(message) {
    super(message);
    this.status = StatusCodes.UNAUTHORIZED;
  }
}

module.exports = Unauthenticate;
