const noteService = require('../../src/modules/notes/business-logic/note-service');
const ApiError = require('../../src/shared/utils/api-error');

jest.mock('../../src/modules/notes/data-access/note-repository');
jest.mock('../../src/modules/tasks/data-access/task-repository');

describe('NoteService', () => {
  let mockNoteRepository;
  let mockTaskRepository;

  beforeEach(() => {
    mockNoteRepository = require('../../src/modules/notes/data-access/note-repository');
    mockTaskRepository = require('../../src/modules/tasks/data-access/task-repository');
    jest.clearAllMocks();
  });

  describe('createNote', () => {
    it('debería crear una nota exitosamente', async () => {
      const userId = 1;
      const taskId = 1;
      const noteData = {
        title: 'Mi nota',
        content: 'Contenido de la nota'
      };

      const mockTask = { id: 1, user_id: userId };

      mockTaskRepository.findTaskByIdAndUserId.mockResolvedValue(mockTask);
      mockNoteRepository.createNote.mockResolvedValue({
        id: 1,
        ...noteData,
        task_id: taskId,
        user_id: userId
      });

      const result = await noteService.createNote(userId, taskId, noteData);

      expect(result).toHaveProperty('id');
      expect(result.title).toBe('Mi nota');
    });

    it('debería lanzar error si la tarea no existe', async () => {
      mockTaskRepository.findTaskByIdAndUserId.mockResolvedValue(null);

      await expect(noteService.createNote(1, 999, { title: 'Nota' })).rejects.toThrow(ApiError);
    });
  });

  describe('getNoteById', () => {
    it('debería obtener una nota por ID', async () => {
      const mockNote = {
        id: 1,
        user_id: 1,
        task_id: 1,
        title: 'Nota de prueba',
        content: 'Contenido'
      };

      mockNoteRepository.findNoteByIdAndUserId.mockResolvedValue(mockNote);

      const result = await noteService.getNoteById(1, 1);

      expect(result.id).toBe(1);
      expect(result.title).toBe('Nota de prueba');
    });

    it('debería lanzar error si la nota no existe', async () => {
      mockNoteRepository.findNoteByIdAndUserId.mockResolvedValue(null);

      await expect(noteService.getNoteById(999, 1)).rejects.toThrow(ApiError);
    });
  });

  describe('getNotesByTaskId', () => {
    it('debería listar notas de una tarea', async () => {
      const mockTask = { id: 1, user_id: 1 };
      const mockNotes = [
        { id: 1, title: 'Nota 1' },
        { id: 2, title: 'Nota 2' }
      ];

      mockTaskRepository.findTaskByIdAndUserId.mockResolvedValue(mockTask);
      mockNoteRepository.findNotesByTaskIdAndUserId.mockResolvedValue(mockNotes);

      const result = await noteService.getNotesByTaskId(1, 1);

      expect(result).toHaveLength(2);
    });

    it('debería lanzar error si la tarea no existe', async () => {
      mockTaskRepository.findTaskByIdAndUserId.mockResolvedValue(null);

      await expect(noteService.getNotesByTaskId(999, 1)).rejects.toThrow(ApiError);
    });
  });

  describe('updateNote', () => {
    it('debería actualizar una nota', async () => {
      const existingNote = {
        id: 1,
        user_id: 1,
        title: 'Nota original',
        content: 'Contenido original'
      };

      const updatedNote = {
        ...existingNote,
        title: 'Nota actualizada'
      };

      mockNoteRepository.findNoteByIdAndUserId.mockResolvedValue(existingNote);
      mockNoteRepository.updateNote.mockResolvedValue(updatedNote);

      const result = await noteService.updateNote(1, 1, { title: 'Nota actualizada' });

      expect(result.title).toBe('Nota actualizada');
    });

    it('debería lanzar error si la nota no existe', async () => {
      mockNoteRepository.findNoteByIdAndUserId.mockResolvedValue(null);

      await expect(noteService.updateNote(999, 1, { title: 'New' })).rejects.toThrow(ApiError);
    });
  });

  describe('deleteNote', () => {
    it('debería eliminar una nota', async () => {
      const existingNote = {
        id: 1,
        user_id: 1,
        title: 'Nota'
      };

      mockNoteRepository.findNoteByIdAndUserId.mockResolvedValue(existingNote);
      mockNoteRepository.deleteNote.mockResolvedValue(1);

      const result = await noteService.deleteNote(1, 1);

      expect(result).toHaveProperty('message');
    });

    it('debería lanzar error si la nota no existe', async () => {
      mockNoteRepository.findNoteByIdAndUserId.mockResolvedValue(null);

      await expect(noteService.deleteNote(999, 1)).rejects.toThrow(ApiError);
    });
  });
});
