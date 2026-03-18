const { HTTP_STATUS } = require('../constants');

class ApiResponse {
  static success(data, message = 'Operación exitosa', statusCode = HTTP_STATUS.OK) {
    return {
      success: true,
      data,
      message
    };
  }

  static created(data, message = 'Recurso creado exitosamente') {
    return this.success(data, message, HTTP_STATUS.CREATED);
  }

  static error(code, message, statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR) {
    return {
      success: false,
      error: {
        code,
        message
      }
    };
  }

  static paginated(data, pagination, message = 'Operación exitosa') {
    return {
      success: true,
      data,
      pagination,
      message
    };
  }

  static validationError(message) {
    return this.error('VALIDATION_ERROR', message, HTTP_STATUS.BAD_REQUEST);
  }

  static unauthorized(message = 'No autenticado') {
    return this.error('AUTHENTICATION_ERROR', message, HTTP_STATUS.UNAUTHORIZED);
  }

  static forbidden(message = 'No autorizado') {
    return this.error('AUTHORIZATION_ERROR', message, HTTP_STATUS.FORBIDDEN);
  }

  static notFound(message = 'Recurso no encontrado') {
    return this.error('NOT_FOUND', message, HTTP_STATUS.NOT_FOUND);
  }

  static conflict(message = 'Conflicto de datos') {
    return this.error('CONFLICT', message, HTTP_STATUS.CONFLICT);
  }
}

module.exports = ApiResponse;
