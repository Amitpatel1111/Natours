// const { stack } = require("sequelize/lib/utils");
const AppError = require("./../utils/appError");
const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};
const handleDuplicateFieldDB = (err) => {
  const value = err.message.match(/(["'])(?:(?=(\\?))\2.)*?\1/)[0];
  const message = `Duplicate field value: ${value}. please use another value`;
  return new AppError(message, 400);
};
const handleValidatorErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);

  const message = `Invalid Input Data. ${errors.join(". ")} `;
  return new AppError(message, 400);
};
const handleJWTError = () => {
  return new AppError("Invalid Token. Please log in again!", 401);
};
const handleJWTExpiredError = () => {
  return new AppError("Your Token has expired Please Login Again", 401);
};
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
  console.log(err.errors.name.name);
  console.log(
    Object.values(err.errors)
      .map((el) => el.message)
      .join(". ")
  );
};
const sendErrorPro = (err, res) => {
  //Operatinal and Trusted Error send Messege to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
    //Browser error caused by some fault
  } else {
    //1)Log Error
    console.error("Error 💥", err);
    //2) Send Generic messege
    res.status(500).json({
      status: "error",
      error: err,
      message: "Something went very wrong",
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
    console.log("running");
  } else if (process.env.NODE_ENV === "production") {
    console.log("thid..");

    let error = { ...err };
    if (error.name === "CastError") error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldDB(error);
    if (error.name === "ValidationError") error = handleValidatorErrorDB(error);
    if (error.name === "JsonWebTokenError") error = handleJWTError();
    if (error.name === "TokenExpiredError") error = handleJWTExpiredError();
    sendErrorPro(error, res);
  }
};
