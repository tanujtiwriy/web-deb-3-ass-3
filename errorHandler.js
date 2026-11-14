exports.notFound = (req, res, next) => {
  const err = new Error(`Route not found: ${req.originalUrl}`);
  err.status = 404;
  next(err);
};

exports.errorHandler = (err, req, res, next) => {
  let status = err.status || 500;
  let message = err.message;

  if (err.name === 'ValidationError') {
    status = 400;
    message = Object.values(err.errors).map(e => e.message).join(', ');
  } else if (err.name === 'CastError') {
    status = 400;
    message = 'Invalid ID';
  } else if (err.code === 11000) {
    status = 409;
    message = 'SKU already exists';
  }

  res.status(status).json({ error: message });
};