const noteService = require('../business-logic/note-service');
const ApiResponse = require('../../../shared/utils/response-utils');

class NoteController {
  async createNote(req, res, next) {
    try {
      const note = await noteService.createNote(
        req.user.userId,
        parseInt(req.params.taskId, 10),
        req.body
      );
      return res.status(201).json(ApiResponse.created(note, 'Nota creada exitosamente'));
    } catch (error) {
      next(error);
    }
  }

  async getNoteById(req, res, next) {
    try {
      const note = await noteService.getNoteById(parseInt(req.params.id, 10), req.user.userId);
      return res.status(200).json(ApiResponse.success(note));
    } catch (error) {
      next(error);
    }
  }

  async getNotesByTaskId(req, res, next) {
    try {
      const notes = await noteService.getNotesByTaskId(
        parseInt(req.params.taskId, 10),
        req.user.userId
      );
      return res.status(200).json(ApiResponse.success(notes));
    } catch (error) {
      next(error);
    }
  }

  async updateNote(req, res, next) {
    try {
      const note = await noteService.updateNote(
        parseInt(req.params.id, 10),
        req.user.userId,
        req.body
      );
      return res.status(200).json(ApiResponse.success(note, 'Nota actualizada exitosamente'));
    } catch (error) {
      next(error);
    }
  }

  async deleteNote(req, res, next) {
    try {
      const result = await noteService.deleteNote(parseInt(req.params.id, 10), req.user.userId);
      return res.status(200).json(ApiResponse.success(result));
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new NoteController();
