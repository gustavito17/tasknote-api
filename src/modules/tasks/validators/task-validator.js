const Joi = require('joi');
const { TASK_STATUS } = require('../../../shared/constants');

const createTaskValidator = Joi.object({
  title: Joi.string().max(255).required()
    .messages({
      'string.empty': 'El título es requerido',
      'string.max': 'El título debe tener máximo 255 caracteres'
    }),
  description: Joi.string().allow('', null)
    .messages({
      'string.max': 'La descripción debe tener máximo 1000 caracteres'
    })
});

const updateTaskValidator = Joi.object({
  title: Joi.string().max(255)
    .messages({
      'string.max': 'El título debe tener máximo 255 caracteres'
    }),
  description: Joi.string().allow('', null)
    .messages({
      'string.max': 'La descripción debe tener máximo 1000 caracteres'
    })
});

const updateStatusValidator = Joi.object({
  status: Joi.string().valid(...Object.values(TASK_STATUS)).required()
    .messages({
      'any.only': 'El estado debe ser "pending" o "completed"',
      'any.required': 'El estado es requerido'
    })
});

const getTasksValidator = Joi.object({
  status: Joi.string().valid(...Object.values(TASK_STATUS)),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10)
});

const taskIdValidator = Joi.object({
  id: Joi.number().integer().positive().required()
    .messages({
      'number.base': 'El ID debe ser un número',
      'number.positive': 'El ID debe ser positivo'
    })
});

module.exports = {
  createTaskValidator,
  updateTaskValidator,
  updateStatusValidator,
  getTasksValidator,
  taskIdValidator
};
