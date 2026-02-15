// Success response
// Supports both (res, data, message, statusCode) and (res, statusCode, message, data) call patterns
const successResponse = (res, dataOrCode, messageOrData = 'Success', codeOrData = 200) => {
  let data, message, statusCode;
  if (typeof dataOrCode === 'number') {
    // Called as successResponse(res, statusCode, message, data)
    statusCode = dataOrCode;
    message = typeof messageOrData === 'string' ? messageOrData : 'Success';
    data = codeOrData;
  } else {
    // Called as successResponse(res, data, message, statusCode)
    data = dataOrCode;
    message = typeof messageOrData === 'string' ? messageOrData : 'Success';
    statusCode = typeof codeOrData === 'number' ? codeOrData : 200;
  }

  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

// Error response
// Supports both (res, message, statusCode) and (res, statusCode, message) call patterns
const errorResponse = (res, messageOrCode = 'Error', codeOrMessage = 400, errors = null) => {
  let message, statusCode;
  if (typeof messageOrCode === 'number') {
    // Called as errorResponse(res, statusCode, message, errors)
    statusCode = messageOrCode;
    message = typeof codeOrMessage === 'string' ? codeOrMessage : 'Error';
    // errors might be in 4th arg already
  } else {
    // Called as errorResponse(res, message, statusCode, errors)
    message = messageOrCode;
    statusCode = typeof codeOrMessage === 'number' ? codeOrMessage : 400;
  }

  const response = {
    success: false,
    message
  };
  
  if (errors) {
    response.errors = errors;
  }
  
  return res.status(statusCode).json(response);
};

// Pagination response
const paginatedResponse = (res, data, pagination, message = 'Success') => {
  return res.status(200).json({
    success: true,
    message,
    data,
    pagination
  });
};

// Create pagination object
const createPagination = (page, limit, total) => {
  const totalPages = Math.ceil(total / limit);
  return {
    page: parseInt(page),
    limit: parseInt(limit),
    total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1
  };
};

module.exports = {
  successResponse,
  errorResponse,
  paginatedResponse,
  createPagination
};
