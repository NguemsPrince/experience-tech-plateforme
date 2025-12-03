// Send token response
const sendTokenResponse = (res, statusCode, token, data = {}) => {
  const tokenCookieOptions = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  };

  res.cookie('token', token, tokenCookieOptions);

  if (data.refreshToken) {
    const refreshCookieOptions = {
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    };

    res.cookie('refreshToken', data.refreshToken, refreshCookieOptions);
  }

  res.status(statusCode).json({
    success: true,
    token,
    ...data
  });
};

// Send error response
const sendErrorResponse = (res, statusCode, message, errors = null) => {
  const response = {
    success: false,
    message
  };

  if (errors) {
    response.errors = errors;
  }

  res.status(statusCode).json(response);
};

// Send success response
const sendSuccessResponse = (res, statusCode, message, data = null) => {
  const response = {
    success: true,
    message
  };

  if (data) {
    response.data = data;
  }

  res.status(statusCode).json(response);
};

module.exports = {
  sendTokenResponse,
  sendErrorResponse,
  sendSuccessResponse
};
