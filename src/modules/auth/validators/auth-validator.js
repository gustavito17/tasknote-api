const Joi = require('joi');

const registerValidator = Joi.object({
  username: Joi.string().min(3).max(100).required()
    .messages({
      'string.empty': 'El nombre de usuario es requerido',
      'string.min': 'El nombre de usuario debe tener al menos 3 caracteres',
      'string.max': 'El nombre de usuario debe tener máximo 100 caracteres'
    }),
  email: Joi.string().email().required()
    .messages({
      'string.email': 'El email debe ser válido',
      'string.empty': 'El email es requerido'
    }),
  password: Joi.string().min(8).required()
    .messages({
      'string.empty': 'La contraseña es requerida',
      'string.min': 'La contraseña debe tener al menos 8 caracteres'
    })
});

const loginValidator = Joi.object({
  email: Joi.string().email().required()
    .messages({
      'string.email': 'El email debe ser válido',
      'string.empty': 'El email es requerido'
    }),
  password: Joi.string().required()
    .messages({
      'string.empty': 'La contraseña es requerida'
    })
});

module.exports = { registerValidator, loginValidator };
