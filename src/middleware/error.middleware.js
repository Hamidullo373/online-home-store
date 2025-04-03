export const errorHandler = (err, req, res, next) => {
  console.error(err);
  res.status(500).send({
    message: "Something went wrong",
    error: err.message,
  });
};
