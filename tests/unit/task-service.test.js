const taskService = require('../../src/modules/tasks/business-logic/task-service');
const ApiError = require('../../src/shared/utils/api-error');

jest.mock('../../src/modules/tasks/data-access/task-repository');

describe('TaskService', () => {
  let mockTaskRepository;

  beforeEach(() => {
    mockTaskRepository = require('../../src/modules/tasks/data-access/task-repository');
    jest.clearAllMocks();
  });

  describe('createTask', () => {
    it('debería crear una tarea exitosamente', async () => {
      const userId = 1;
      const taskData = {
        title: 'Mi primera tarea',
        description: 'Descripción de prueba'
      };

      mockTaskRepository.createTask.mockResolvedValue({
        id: 1,
        ...taskData,
        user_id: userId,
        status: 'pending'
      });

      const result = await taskService.createTask(userId, taskData);

      expect(result).toHaveProperty('id');
      expect(result.title).toBe('Mi primera tarea');
      expect(result.status).toBe('pending');
    });
  });

  describe('getTaskById', () => {
    it('debería obtener una tarea por ID', async () => {
      const mockTask = {
        id: 1,
        user_id: 1,
        title: 'Tarea de prueba',
        status: 'pending'
      };

      mockTaskRepository.findTaskByIdAndUserId.mockResolvedValue(mockTask);

      const result = await taskService.getTaskById(1, 1);

      expect(result.id).toBe(1);
      expect(result.title).toBe('Tarea de prueba');
    });

    it('debería lanzar error si la tarea no existe', async () => {
      mockTaskRepository.findTaskByIdAndUserId.mockResolvedValue(null);

      await expect(taskService.getTaskById(999, 1)).rejects.toThrow(ApiError);
    });
  });

  describe('getAllTasks', () => {
    it('debería listar todas las tareas del usuario con paginación', async () => {
      const mockTasks = [
        { id: 1, title: 'Tarea 1', status: 'pending' },
        { id: 2, title: 'Tarea 2', status: 'completed' }
      ];

      mockTaskRepository.findAllTasksByUserId.mockResolvedValue({
        tasks: mockTasks,
        total: 2
      });

      const result = await taskService.getAllTasks(1, { page: 1, limit: 10 });

      expect(result.tasks).toHaveLength(2);
      expect(result.pagination).toHaveProperty('total');
      expect(result.pagination.total).toBe(2);
    });
  });

  describe('updateTask', () => {
    it('debería actualizar una tarea', async () => {
      const existingTask = {
        id: 1,
        user_id: 1,
        title: 'Tarea original',
        description: 'Descripción original',
        status: 'pending'
      };

      const updatedTask = {
        ...existingTask,
        title: 'Tarea actualizada'
      };

      mockTaskRepository.findTaskByIdAndUserId.mockResolvedValue(existingTask);
      mockTaskRepository.updateTask.mockResolvedValue(updatedTask);

      const result = await taskService.updateTask(1, 1, { title: 'Tarea actualizada' });

      expect(result.title).toBe('Tarea actualizada');
    });

    it('debería lanzar error si la tarea no existe', async () => {
      mockTaskRepository.findTaskByIdAndUserId.mockResolvedValue(null);

      await expect(taskService.updateTask(999, 1, { title: 'New title' })).rejects.toThrow(ApiError);
    });
  });

  describe('updateTaskStatus', () => {
    it('debería marcar tarea como completada', async () => {
      const existingTask = {
        id: 1,
        user_id: 1,
        title: 'Tarea',
        status: 'pending',
        completed_at: null
      };

      const completedTask = {
        ...existingTask,
        status: 'completed',
        completed_at: new Date()
      };

      mockTaskRepository.findTaskByIdAndUserId.mockResolvedValue(existingTask);
      mockTaskRepository.updateTask.mockResolvedValue(completedTask);

      const result = await taskService.updateTaskStatus(1, 1, 'completed');

      expect(result.status).toBe('completed');
    });

    it('debería marcar tarea como pendiente', async () => {
      const existingTask = {
        id: 1,
        user_id: 1,
        title: 'Tarea',
        status: 'completed',
        completed_at: new Date()
      };

      mockTaskRepository.findTaskByIdAndUserId.mockResolvedValue(existingTask);
      mockTaskRepository.updateTask.mockResolvedValue({
        ...existingTask,
        status: 'pending',
        completed_at: null
      });

      const result = await taskService.updateTaskStatus(1, 1, 'pending');

      expect(result.status).toBe('pending');
    });
  });

  describe('deleteTask', () => {
    it('debería eliminar una tarea', async () => {
      const existingTask = {
        id: 1,
        user_id: 1,
        title: 'Tarea'
      };

      mockTaskRepository.findTaskByIdAndUserId.mockResolvedValue(existingTask);
      mockTaskRepository.deleteTask.mockResolvedValue(1);

      const result = await taskService.deleteTask(1, 1);

      expect(result).toHaveProperty('message');
    });

    it('debería lanzar error si la tarea no existe', async () => {
      mockTaskRepository.findTaskByIdAndUserId.mockResolvedValue(null);

      await expect(taskService.deleteTask(999, 1)).rejects.toThrow(ApiError);
    });
  });
});
