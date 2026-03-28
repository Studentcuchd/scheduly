export const successResponse = (data, message = "Success") => ({
  success: true,
  message,
  data,
});

export const errorResponse = (message, errors = null) => ({
  success: false,
  message,
  ...(errors && { errors }),
});
