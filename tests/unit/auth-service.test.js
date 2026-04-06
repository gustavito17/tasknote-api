const authService = require('../../src/modules/auth/business-logic/auth-service');
const ApiError = require('../../src/shared/utils/api-error');

jest.mock('../../src/modules/auth/data-access/auth-repository');

describe('AuthService', () => {
  let mockAuthRepository;

  beforeEach(() => {
    mockAuthRepository = require('../../src/modules/auth/data-access/auth-repository');
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('debería crear un usuario exitosamente', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@test.com',
        password: 'password123'
      };

      mockAuthRepository.findUserByEmail.mockResolvedValue(null);
      mockAuthRepository.findUserByUsername.mockResolvedValue(null);
      mockAuthRepository.createUser.mockResolvedValue({
        id: 1,
        ...userData,
        password_hash: 'hashed_password'
      });

      const result = await authService.register(userData);

      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('token');
      expect(result.user.username).toBe('testuser');
    });

    it('debería lanzar error si el email ya existe', async () => {
      const userData = {
        username: 'testuser',
        email: 'existing@test.com',
        password: 'password123'
      };

      mockAuthRepository.findUserByEmail.mockResolvedValue({ id: 1, email: 'existing@test.com' });

      await expect(authService.register(userData)).rejects.toThrow(ApiError);
    });

    it('debería lanzar error si el username ya existe', async () => {
      const userData = {
        username: 'existinguser',
        email: 'test@test.com',
        password: 'password123'
      };

      mockAuthRepository.findUserByEmail.mockResolvedValue(null);
      mockAuthRepository.findUserByUsername.mockResolvedValue({ id: 1, username: 'existinguser' });

      await expect(authService.register(userData)).rejects.toThrow(ApiError);
    });
  });

  describe('login', () => {
    it('debería iniciar sesión exitosamente con credenciales válidas', async () => {
      const credentials = {
        email: 'test@test.com',
        password: 'password123'
      };

      const mockUser = {
        id: 1,
        email: 'test@test.com',
        password_hash: 'hashed_password'
      };

      mockAuthRepository.findUserByEmail.mockResolvedValue(mockUser);

      const result = await authService.login(credentials);

      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('token');
    });

    it('debería lanzar error si el usuario no existe', async () => {
      const credentials = {
        email: 'nonexistent@test.com',
        password: 'password123'
      };

      mockAuthRepository.findUserByEmail.mockResolvedValue(null);

      await expect(authService.login(credentials)).rejects.toThrow(ApiError);
    });

    it('debería lanzar error si la contraseña es incorrecta', async () => {
      const credentials = {
        email: 'test@test.com',
        password: 'wrongpassword'
      };

      const mockUser = {
        id: 1,
        email: 'test@test.com',
        password_hash: 'hashed_password'
      };

      mockAuthRepository.findUserByEmail.mockResolvedValue(mockUser);
      
      const bcrypt = require('bcryptjs');
      bcrypt.compare.mockResolvedValueOnce(false);

      await expect(authService.login(credentials)).rejects.toThrow(ApiError);
    });
  });

  describe('getCurrentUser', () => {
    it('debería obtener el usuario actual', async () => {
      const mockUser = {
        id: 1,
        username: 'testuser',
        email: 'test@test.com',
        password_hash: 'hashed_password'
      };

      mockAuthRepository.findUserById.mockResolvedValue(mockUser);

      const result = await authService.getCurrentUser(1);

      expect(result.id).toBe(1);
      expect(result).not.toHaveProperty('password_hash');
    });

    it('debería lanzar error si el usuario no existe', async () => {
      mockAuthRepository.findUserById.mockResolvedValue(null);

      await expect(authService.getCurrentUser(999)).rejects.toThrow(ApiError);
    });
  });
});
