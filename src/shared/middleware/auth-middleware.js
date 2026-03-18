const jwt = require('jsonwebtoken');
const config = require('../../config/jwt');
const ApiResponse = require('../../shared/utils/response-utils');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json(ApiResponse.unauthorized('Token de acceso requerido'));
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = {
      userId: decoded.userId,
      email: decoded.email
    };
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json(ApiResponse.unauthorized('Token expirado'));
    }
    return res.status(401).json(ApiResponse.unauthorized('Token inválido'));
  }
};

const optionalAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token) {
    try {
      const decoded = jwt.verify(token, config.jwtSecret);
      req.user = {
        userId: decoded.userId,
        email: decoded.email
      };
    } catch (error) {
    }
  }
  next();
};

module.exports = { authenticateToken, optionalAuth };
