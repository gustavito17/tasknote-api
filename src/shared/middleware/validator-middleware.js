const ApiResponse = require('../../shared/utils/response-utils');

const validate = (validator) => {
  return (req, res, next) => {
    const { error, value } = validator.validate(req.body, { abortEarly: false });
    
    if (error) {
      const messages = error.details.map(detail => detail.message).join(', ');
      return res.status(400).json(ApiResponse.validationError(messages));
    }
    
    req.body = value;
    next();
  };
};

const validateQuery = (validator) => {
  return (req, res, next) => {
    const { error, value } = validator.validate(req.query, { abortEarly: false });
    
    if (error) {
      const messages = error.details.map(detail => detail.message).join(', ');
      return res.status(400).json(ApiResponse.validationError(messages));
    }
    
    req.query = value;
    next();
  };
};

const validateParams = (validator) => {
  return (req, res, next) => {
    const { error, value } = validator.validate(req.params, { abortEarly: false });
    
    if (error) {
      const messages = error.details.map(detail => detail.message).join(', ');
      return res.status(400).json(ApiResponse.validationError(messages));
    }
    
    req.params = value;
    next();
  };
};

module.exports = { validate, validateQuery, validateParams };
