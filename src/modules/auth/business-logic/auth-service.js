const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../../../config/jwt');
const authRepository = require('../data-access/auth-repository');
const ApiError = require('../../../shared/utils/api-error');

class AuthService {
  async register(userData) {
    const { email, username, password } = userData;

    const existingEmail = await authRepository.findUserByEmail(email);
    if (existingEmail) {
      throw new ApiError('El email ya está registrado', 409);
    }

    const existingUsername = await authRepository.findUserByUsername(username);
    if (existingUsername) {
      throw new ApiError('El nombre de usuario ya está registrado', 409);
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await authRepository.createUser({
      username,
      email,
      password_hash: passwordHash
    });

    const token = this.generateToken(user);

    return {
      user: this.sanitizeUser(user),
      token
    };
  }

  async login(credentials) {
    const { email, password } = credentials;

    const user = await authRepository.findUserByEmail(email);
    if (!user) {
      throw new ApiError('Credenciales inválidas', 401);
    }

    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      throw new ApiError('Credenciales inválidas', 401);
    }

    const token = this.generateToken(user);

    return {
      user: this.sanitizeUser(user),
      token
    };
  }

  async getCurrentUser(userId) {
    const user = await authRepository.findUserById(userId);
    if (!user) {
      throw new ApiError('Usuario no encontrado', 404);
    }
    return this.sanitizeUser(user);
  }

  generateToken(user) {
    const payload = {
      userId: user.id,
      email: user.email
    };

    return jwt.sign(payload, config.jwtSecret, {
      expiresIn: config.jwtExpiresIn,
      algorithm: config.jwtAlgorithm
    });
  }

  sanitizeUser(user) {
    const { password_hash, ...sanitized } = user;
    return sanitized;
  }
}

module.exports = new AuthService();
