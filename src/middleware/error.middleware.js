import logger from "../config/winston.config.js";
function dublicateFieldError(err) {
  if (err?.code === 11000) {
    err.status = 409;
    err.isException = true;
    err.message = `${Object.values(err.keyValue).join(", ")} already exists`;
  }
  return err;
}

export const ErrorHandlerMiddleware = (err, _, res, __) => {
  logger.error(err.message);
  err = dublicateFieldError(err);
  if (err.isException) {
  }
  console.log(err);
  res.status(500).send({
    message: "Internal Server Error",
  });
};
