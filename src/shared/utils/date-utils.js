const getCurrentTimestamp = () => new Date();

const formatTimestamp = (date = new Date()) => {
  return date.toISOString();
};

const addTimestamps = (data = {}) => {
  const now = getCurrentTimestamp();
  return {
    ...data,
    created_at: data.created_at || now,
    updated_at: now
  };
};

const updateTimestamp = (data = {}) => {
  return {
    ...data,
    updated_at: getCurrentTimestamp()
  };
};

const setCompletedAt = () => {
  return getCurrentTimestamp();
};

const clearCompletedAt = () => {
  return null;
};

module.exports = {
  getCurrentTimestamp,
  formatTimestamp,
  addTimestamps,
  updateTimestamp,
  setCompletedAt,
  clearCompletedAt
};
