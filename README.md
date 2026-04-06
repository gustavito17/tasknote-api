# GusNote API

Sistema de gestión de tareas con notas integradas - API RESTful con Node.js y PostgreSQL.

## Características

- Autenticación JWT
- CRUD de tareas con estados (pending/completed)
- Sistema de notas vinculadas a tareas
- Timestamps automáticos (created_at, updated_at, completed_at)
- Arquitectura modular por capas
- Documentación Swagger
- Pruebas unitarias e integración

## Requisitos

- Node.js v18+
- PostgreSQL v14+
- npm o yarn

## Instalación

```bash
npm install
# o
yarn install
```

## Configuración

Crear archivo `.env` basado en `.env.example`:

```env
PORT=3000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_NAME=tasknote_db
DB_USER=postgres
DB_PASSWORD=tu_password

JWT_SECRET=tu_secret_key
JWT_EXPIRES_IN=24h
```

## Base de Datos

```bash
# Crear base de datos
createdb tasknote_db

# Ejecutar migraciones
npm run migrate

# (Opcional) Ejecutar seeds
npm run seed
```

## Ejecución

```bash
# Desarrollo
npm run dev

# Producción
npm start
```

## Documentación API

Una vez iniciado el servidor, visita: `http://localhost:3000/api-docs`

## Pruebas

```bash
# Ejecutar pruebas
npm test

# Modo watch
npm run test:watch
```

## Estructura del Proyecto

```
src/
├── config/              # Configuración
│   ├── database.js
│   ├── jwt.js
│   └── server.js
├── modules/             # Módulos por funcionalidad
│   ├── auth/
│   │   ├── business-logic/
│   │   ├── data-access/
│   │   ├── presentation/
│   │   └── validators/
│   ├── tasks/
│   └── notes/
├── shared/              # Código compartido
│   ├── constants/
│   ├── middleware/
│   └── utils/
├── database/
│   ├── migrations/
│   └── seeds/
└── app.js
```

## Endpoints Principales

### Autenticación
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/me` - Usuario actual

### Tareas
- `GET /api/tasks` - Listar tareas
- `POST /api/tasks` - Crear tarea
- `GET /api/tasks/:id` - Obtener tarea
- `PUT /api/tasks/:id` - Actualizar tarea
- `PATCH /api/tasks/:id/status` - Cambiar estado
- `DELETE /api/tasks/:id` - Eliminar tarea

### Notas
- `GET /api/tasks/:taskId/notes` - Listar notas
- `POST /api/tasks/:taskId/notes` - Crear nota
- `GET /api/notes/:id` - Obtener nota
- `PUT /api/notes/:id` - Actualizar nota
- `DELETE /api/notes/:id` - Eliminar nota

## Arquitectura

El proyecto sigue una arquitectura modular por capas:

1. **Presentation** - Controllers y Routes
2. **Business Logic** - Services con lógica de negocio
3. **Data Access** - Repositories y Models

## Licencia

MIT
