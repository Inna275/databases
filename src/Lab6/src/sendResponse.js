const sendResponse = (res, statusCode, data = null) => {
  const response = { message: 'Success' };
  
  if (data !== null) {
    response.data = data;
  }
  
  return res.status(statusCode).json(response);
};

export default sendResponse;
