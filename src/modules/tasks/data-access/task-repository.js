const TaskModel = require('./task-model');

class TaskRepository {
  async findTaskById(taskId) {
    return TaskModel.findById(taskId);
  }

  async findTaskByIdAndUserId(taskId, userId) {
    return TaskModel.findByIdAndUserId(taskId, userId);
  }

  async findAllTasksByUserId(userId, options) {
    return TaskModel.findAllByUserId(userId, options);
  }

  async createTask(taskData) {
    return TaskModel.create(taskData);
  }

  async updateTask(taskId, taskData) {
    return TaskModel.update(taskId, taskData);
  }

  async deleteTask(taskId) {
    return TaskModel.delete(taskId);
  }

  async countTasksByUserId(userId, status) {
    return TaskModel.countByUserId(userId, status);
  }
}

module.exports = new TaskRepository();
