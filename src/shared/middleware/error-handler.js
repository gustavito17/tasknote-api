const ApiResponse = require('../../shared/utils/response-utils');

const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  if (err.isJoi) {
    return res.status(400).json(
      ApiResponse.validationError(err.details?.[0]?.message || 'Error de validación')
    );
  }

  if (err.code === '23505') {
    return res.status(409).json(
      ApiResponse.conflict('El recurso ya existe')
    );
  }

  if (err.code === '23503') {
    return res.status(400).json(
      ApiResponse.error('FOREIGN_KEY_ERROR', 'Referencia inválida', 400)
    );
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Error interno del servidor';

  return res.status(statusCode).json(
    ApiResponse.error(err.code || 'INTERNAL_ERROR', message, statusCode)
  );
};

const notFoundHandler = (req, res) => {
  return res.status(404).json(
    ApiResponse.notFound('Ruta no encontrada')
  );
};

module.exports = { errorHandler, notFoundHandler };
