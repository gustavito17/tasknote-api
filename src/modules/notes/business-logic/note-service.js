const noteRepository = require('../data-access/note-repository');
const taskRepository = require('../../tasks/data-access/task-repository');
const ApiError = require('../../../shared/utils/api-error');

class NoteService {
  async createNote(userId, taskId, noteData) {
    const task = await taskRepository.findTaskByIdAndUserId(taskId, userId);
    if (!task) {
      throw new ApiError('Tarea no encontrada', 404);
    }

    const note = await noteRepository.createNote({
      ...noteData,
      task_id: taskId,
      user_id: userId
    });

    return note;
  }

  async getNoteById(noteId, userId) {
    const note = await noteRepository.findNoteByIdAndUserId(noteId, userId);
    if (!note) {
      throw new ApiError('Nota no encontrada', 404);
    }
    return note;
  }

  async getNotesByTaskId(taskId, userId) {
    const task = await taskRepository.findTaskByIdAndUserId(taskId, userId);
    if (!task) {
      throw new ApiError('Tarea no encontrada', 404);
    }

    return noteRepository.findNotesByTaskIdAndUserId(taskId, userId);
  }

  async updateNote(noteId, userId, noteData) {
    const existingNote = await noteRepository.findNoteByIdAndUserId(noteId, userId);
    if (!existingNote) {
      throw new ApiError('Nota no encontrada', 404);
    }

    const allowedFields = ['title', 'content'];
    const updateData = {};

    for (const field of allowedFields) {
      if (noteData[field] !== undefined) {
        updateData[field] = noteData[field];
      }
    }

    const updatedNote = await noteRepository.updateNote(noteId, updateData);
    return updatedNote;
  }

  async deleteNote(noteId, userId) {
    const note = await noteRepository.findNoteByIdAndUserId(noteId, userId);
    if (!note) {
      throw new ApiError('Nota no encontrada', 404);
    }

    await noteRepository.deleteNote(noteId);
    return { message: 'Nota eliminada exitosamente' };
  }
}

module.exports = new NoteService();
