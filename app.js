require("dotenv").config();
const express = require("express");
const app = express();
require("express-async-errors");
const connectDB = require("./db/connection");
const notFound = require("./middlewares/not-found");
const errorHandlerMiddelware = require("./middlewares/errorHandler");
const PORT = process.env.PORT || 3000;
const auth = require("./routes/auth");
const jobs = require("./routes/job");
const authMiddleware = require("./middlewares/auth");
const rateLimiter = require("express-rate-limit");
const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
//swagger
const swaggerUI = require("swagger-ui-express");
const YMAL = require("yamljs");
const swaggerFile = YMAL.load("./swagger.yaml");
//middleware
app.set("trust proxy", 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  })
);
app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  })
);
app.use(helmet());
app.use(cors());
app.use(xss());
app.get("/", (req, res) => {
  res.send('<a href="/api-doc">Documentation</a> ');
});
app.use("/api-doc", swaggerUI.serve, swaggerUI.setup(swaggerFile));
//router
app.use("/api/v1/", auth);
app.use("/api/v1/jobs/", authMiddleware, jobs);
app.use(notFound);
app.use(errorHandlerMiddelware);

//listen
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(PORT, () => {
      console.log(`Server listen at port ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};
start();
