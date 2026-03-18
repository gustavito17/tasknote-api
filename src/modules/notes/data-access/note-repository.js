const NoteModel = require('./note-model');

class NoteRepository {
  async findNoteById(noteId) {
    return NoteModel.findById(noteId);
  }

  async findNoteByIdAndUserId(noteId, userId) {
    return NoteModel.findByIdAndUserId(noteId, userId);
  }

  async findNotesByTaskId(taskId) {
    return NoteModel.findByTaskId(taskId);
  }

  async findNotesByTaskIdAndUserId(taskId, userId) {
    return NoteModel.findByTaskIdAndUserId(taskId, userId);
  }

  async createNote(noteData) {
    return NoteModel.create(noteData);
  }

  async updateNote(noteId, noteData) {
    return NoteModel.update(noteId, noteData);
  }

  async deleteNote(noteId) {
    return NoteModel.delete(noteId);
  }
}

module.exports = new NoteRepository();
