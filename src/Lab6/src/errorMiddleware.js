import HTTP_STATUS_CODES from './statusCodes.js';

const { INTERNAL_SERVER_ERROR } = HTTP_STATUS_CODES;

const errorHandlingMiddleware = (err, req, res, next) => {
  const response = {
    statusCode: err.statusCode || INTERNAL_SERVER_ERROR,
    error: err.message || 'Internal Server Error',
  };

  if (err.details) {
    response.details = err.details;
  }

  res.status(response.statusCode).json(response);
};

export default errorHandlingMiddleware;
