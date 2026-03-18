const authService = require('../business-logic/auth-service');
const ApiResponse = require('../../../shared/utils/response-utils');

class AuthController {
  async register(req, res, next) {
    try {
      const result = await authService.register(req.body);
      return res.status(201).json(ApiResponse.created(result, 'Usuario registrado exitosamente'));
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const result = await authService.login(req.body);
      return res.status(200).json(ApiResponse.success(result, 'Login exitoso'));
    } catch (error) {
      next(error);
    }
  }

  async getCurrentUser(req, res, next) {
    try {
      const user = await authService.getCurrentUser(req.user.userId);
      return res.status(200).json(ApiResponse.success(user));
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();
