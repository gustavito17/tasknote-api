const authService = require('../business-logic/auth-service');
const authServiceGoogle = require('../business-logic/auth-service-google');
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

  async googleLogin(req, res, next) {
    try {
      const { access_token } = req.body;
      if (!access_token) throw new (require('../../../shared/utils/api-error'))('access_token requerido', 400);
      const result = await authServiceGoogle.loginWithGoogle(access_token);
      return res.status(200).json(ApiResponse.success(result, 'Login con Google exitoso'));
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
