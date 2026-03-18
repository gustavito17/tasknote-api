const express = require('express');
const router = express.Router();
const noteController = require('./note-controller');
const { 
  createNoteValidator, 
  updateNoteValidator,
  noteIdValidator,
  taskIdValidator
} = require('../validators/note-validator');
const { validate, validateParams } = require('../../../shared/middleware/validator-middleware');
const { authenticateToken } = require('../../../shared/middleware/auth-middleware');

router.use(authenticateToken);

/**
 * @swagger
 * /api/tasks/{taskId}/notes:
 *   get:
 *     summary: Listar notas de una tarea
 *     tags: [Notas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la tarea
 *     responses:
 *       200:
 *         description: Lista de notas
 *       404:
 *         description: Tarea no encontrada
 */
router.get('/tasks/:taskId/notes', validateParams(taskIdValidator), noteController.getNotesByTaskId);

/**
 * @swagger
 * /api/tasks/{taskId}/notes:
 *   post:
 *     summary: Crear una nota en una tarea
 *     tags: [Notas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *                 example: Mi nota
 *               content:
 *                 type: string
 *                 example: Contenido de la nota
 *     responses:
 *       201:
 *         description: Nota creada
 *       404:
 *         description: Tarea no encontrada
 */
router.post('/tasks/:taskId/notes', validateParams(taskIdValidator), validate(createNoteValidator), noteController.createNote);

/**
 * @swagger
 * /api/notes/{id}:
 *   get:
 *     summary: Obtener una nota específica
 *     tags: [Notas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Nota encontrada
 *       404:
 *         description: Nota no encontrada
 */
router.get('/notes/:id', validateParams(noteIdValidator), noteController.getNoteById);

/**
 * @swagger
 * /api/notes/{id}:
 *   put:
 *     summary: Actualizar una nota
 *     tags: [Notas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Nota actualizada
 *       404:
 *         description: Nota no encontrada
 */
router.put('/notes/:id', validateParams(noteIdValidator), validate(updateNoteValidator), noteController.updateNote);

/**
 * @swagger
 * /api/notes/{id}:
 *   delete:
 *     summary: Eliminar una nota
 *     tags: [Notas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Nota eliminada
 *       404:
 *         description: Nota no encontrada
 */
router.delete('/notes/:id', validateParams(noteIdValidator), noteController.deleteNote);

module.exports = router;
