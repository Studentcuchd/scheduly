export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const errorInfo = {
    method: req.method,
    path: req.originalUrl,
    statusCode,
    message: err.message,
    code: err.code,
    meta: err.meta,
  };

  if (statusCode >= 500) {
    console.error("[errorHandler] Server error", errorInfo, err.stack);
  } else {
    console.warn("[errorHandler] Request error", errorInfo);
  }

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal server error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};
