const UserModel = require('./user-model');

class AuthRepository {
  async findUserById(userId) {
    return UserModel.findById(userId);
  }

  async findUserByEmail(email) {
    return UserModel.findByEmail(email);
  }

  async findUserByUsername(username) {
    return UserModel.findByUsername(username);
  }

  async createUser(userData) {
    return UserModel.create(userData);
  }

  async updateUser(userId, userData) {
    return UserModel.update(userId, userData);
  }
}

module.exports = new AuthRepository();
