const Joi = require('joi');

const createNoteValidator = Joi.object({
  title: Joi.string().max(255).required()
    .messages({
      'string.empty': 'El título es requerido',
      'string.max': 'El título debe tener máximo 255 caracteres'
    }),
  content: Joi.string().allow('', null)
    .messages({
      'string.max': 'El contenido debe tener máximo 5000 caracteres'
    })
});

const updateNoteValidator = Joi.object({
  title: Joi.string().max(255)
    .messages({
      'string.max': 'El título debe tener máximo 255 caracteres'
    }),
  content: Joi.string().allow('', null)
    .messages({
      'string.max': 'El contenido debe tener máximo 5000 caracteres'
    })
});

const noteIdValidator = Joi.object({
  id: Joi.number().integer().positive().required()
    .messages({
      'number.base': 'El ID debe ser un número',
      'number.positive': 'El ID debe ser positivo'
    })
});

const taskIdValidator = Joi.object({
  taskId: Joi.number().integer().positive().required()
    .messages({
      'number.base': 'El ID de tarea debe ser un número',
      'number.positive': 'El ID de tarea debe ser positivo'
    })
});

module.exports = {
  createNoteValidator,
  updateNoteValidator,
  noteIdValidator,
  taskIdValidator
};
