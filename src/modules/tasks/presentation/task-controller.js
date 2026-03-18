const taskService = require('../business-logic/task-service');
const ApiResponse = require('../../../shared/utils/response-utils');

class TaskController {
  async createTask(req, res, next) {
    try {
      const task = await taskService.createTask(req.user.userId, req.body);
      return res.status(201).json(ApiResponse.created(task, 'Tarea creada exitosamente'));
    } catch (error) {
      next(error);
    }
  }

  async getTaskById(req, res, next) {
    try {
      const task = await taskService.getTaskById(parseInt(req.params.id, 10), req.user.userId);
      return res.status(200).json(ApiResponse.success(task));
    } catch (error) {
      next(error);
    }
  }

  async getAllTasks(req, res, next) {
    try {
      const result = await taskService.getAllTasks(req.user.userId, req.query);
      return res.status(200).json(ApiResponse.paginated(
        result.tasks,
        result.pagination
      ));
    } catch (error) {
      next(error);
    }
  }

  async updateTask(req, res, next) {
    try {
      const task = await taskService.updateTask(
        parseInt(req.params.id, 10),
        req.user.userId,
        req.body
      );
      return res.status(200).json(ApiResponse.success(task, 'Tarea actualizada exitosamente'));
    } catch (error) {
      next(error);
    }
  }

  async updateTaskStatus(req, res, next) {
    try {
      const task = await taskService.updateTaskStatus(
        parseInt(req.params.id, 10),
        req.user.userId,
        req.body.status
      );
      return res.status(200).json(ApiResponse.success(task, 'Estado de tarea actualizado'));
    } catch (error) {
      next(error);
    }
  }

  async deleteTask(req, res, next) {
    try {
      const result = await taskService.deleteTask(parseInt(req.params.id, 10), req.user.userId);
      return res.status(200).json(ApiResponse.success(result));
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new TaskController();
