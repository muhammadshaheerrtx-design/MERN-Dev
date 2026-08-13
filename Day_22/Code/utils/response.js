// Standardized response helpers.
// Every endpoint in this API returns JSON in exactly one of these two shapes,
// so a client never has to guess the structure of a response.
//
// Success shape:
// { success: true, data: <any>, count?: <number>, message?: <string> }
//
// Error shape:
// { success: false, error: <string>, details?: <string[]> }

function sendSuccess(res, statusCode, data, extra = {}) {
  res.status(statusCode).json({
    success: true,
    data,
    ...extra,
  });
}

function sendError(res, statusCode, message, details) {
  const body = { success: false, error: message };
  if (details) body.details = details;
  res.status(statusCode).json(body);
}

module.exports = { sendSuccess, sendError };
