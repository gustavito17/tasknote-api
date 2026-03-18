const taskRepository = require('../data-access/task-repository');
const ApiError = require('../../../shared/utils/api-error');
const { TASK_STATUS, PAGINATION } = require('../../../shared/constants');

class TaskService {
  async createTask(userId, taskData) {
    const task = await taskRepository.createTask({
      ...taskData,
      user_id: userId,
      status: TASK_STATUS.PENDING
    });
    return task;
  }

  async getTaskById(taskId, userId) {
    const task = await taskRepository.findTaskByIdAndUserId(taskId, userId);
    if (!task) {
      throw new ApiError('Tarea no encontrada', 404);
    }
    return task;
  }

  async getAllTasks(userId, queryParams) {
    const { status, page = PAGINATION.DEFAULT_PAGE, limit = PAGINATION.DEFAULT_LIMIT } = queryParams;

    const validatedPage = Math.max(1, parseInt(page, 10));
    const validatedLimit = Math.min(PAGINATION.MAX_LIMIT, Math.max(1, parseInt(limit, 10)));

    const result = await taskRepository.findAllTasksByUserId(userId, {
      status,
      page: validatedPage,
      limit: validatedLimit
    });

    return {
      tasks: result.tasks,
      pagination: {
        page: validatedPage,
        limit: validatedLimit,
        total: result.total,
        totalPages: Math.ceil(result.total / validatedLimit)
      }
    };
  }

  async updateTask(taskId, userId, taskData) {
    const existingTask = await taskRepository.findTaskByIdAndUserId(taskId, userId);
    if (!existingTask) {
      throw new ApiError('Tarea no encontrada', 404);
    }

    const allowedFields = ['title', 'description'];
    const updateData = {};
    
    for (const field of allowedFields) {
      if (taskData[field] !== undefined) {
        updateData[field] = taskData[field];
      }
    }

    const updatedTask = await taskRepository.updateTask(taskId, updateData);
    return updatedTask;
  }

  async updateTaskStatus(taskId, userId, newStatus) {
    const task = await taskRepository.findTaskByIdAndUserId(taskId, userId);
    if (!task) {
      throw new ApiError('Tarea no encontrada', 404);
    }

    if (!Object.values(TASK_STATUS).includes(newStatus)) {
      throw new ApiError('Estado inválido', 400);
    }

    const updateData = { status: newStatus };

    if (newStatus === TASK_STATUS.COMPLETED && !task.completed_at) {
      updateData.completed_at = new Date();
    } else if (newStatus === TASK_STATUS.PENDING) {
      updateData.completed_at = null;
    }

    const updatedTask = await taskRepository.updateTask(taskId, updateData);
    return updatedTask;
  }

  async deleteTask(taskId, userId) {
    const task = await taskRepository.findTaskByIdAndUserId(taskId, userId);
    if (!task) {
      throw new ApiError('Tarea no encontrada', 404);
    }

    await taskRepository.deleteTask(taskId);
    return { message: 'Tarea eliminada exitosamente' };
  }
}

module.exports = new TaskService();
