const handleError = (res, err, message = 'Internal Server Error') => {
  console.error(err);
  res.status(500).json({ error: message });
};

const handleSuccess = (res, data = {}, message = 'Success') => {
  res.json({ success: true, message, ...data });
};

module.exports = { handleError, handleSuccess };
