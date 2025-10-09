const errorHandler = (err,  res, next) => {
  console.error("Error:", err);

  if (err.name === "SequelizeValidationError") {
    return res.status(400).json({
      success: false,
      error: "Validation error",
      details: err.errors.map((e) => e.message),
    });
  }

  if (err.name === "SequelizeUniqueConstraintError") {
    return res.status(409).json({
      success: false,
      error: "Duplicate entry",
      details: err.errors.map((e) => e.message),
    });
  }

  if (err.name === "SequelizeForeignKeyConstraintError") {
    return res.status(400).json({
      success: false,
      error: "Invalid reference",
      message: "Referenced record does not exist",
    });
  }

  if (err.name === "MulterError") {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        error: "File too large",
        message: "File size exceeds the 5MB limit",
      });
    }
    return res.status(400).json({
      success: false,
      error: "File upload error",
      message: err.message,
    });
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";

  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

export default errorHandler;
