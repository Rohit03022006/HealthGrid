export const errorMiddleware = (err, req, res, next) => {
  console.error("Error:", err.message);

  return res.status(500).json({
    success: false,
    message: "Internal server error",
    ...(process.env.NODE_ENV === "development" && { error: err.message }),
  });
};