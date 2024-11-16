import HTTP_STATUS_CODES from './statusCodes.js';

const { BAD_REQUEST, NOT_FOUND, INTERNAL_SERVER_ERROR } = HTTP_STATUS_CODES;

const formError = (message, statusCode = INTERNAL_SERVER_ERROR, details = null) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  error.details = details;
  return error;
};

const errorFactory = {
  missingFields: () => {
    return formError('Missing fields', BAD_REQUEST);
  },

  notFound: () => {
    return formError('Resource not found', NOT_FOUND);
  },

  createError: (details = null) => {
    return formError('Create error', INTERNAL_SERVER_ERROR, details);
  },

  getError: (details = null) => {
    return formError('Get error', INTERNAL_SERVER_ERROR, details);
  },

  updateError: (details = null) => {
    return formError('Update error', INTERNAL_SERVER_ERROR, details);
  },

  deleteError: (details = null) => {
    return formError('Delete error', INTERNAL_SERVER_ERROR, details);
  }
};

export default errorFactory;
