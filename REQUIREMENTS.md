# Sistema de Gestión de Tareas con Notas Integradas

## Documento de Requerimientos Técnicos

---

## 1. Definición Técnica del Proyecto

### 1.1 Nombre del Proyecto
**GusNote API** - Sistema de Gestión de Tareas con Notas Asociadas

### 1.2 Descripción General
API RESTful para gestión de tareas con estado pendiete/completado, incluyendo módulo de notas relacionadas a cada tarea. Persistencia en PostgreSQL con autenticación JWT.

### 1.3 Tech Stack
| Componente | Tecnología |
|------------|------------|
| Runtime | Node.js (v18+) |
| Framework | Express.js |
| Base de Datos | PostgreSQL (v14+) |
| ORM/Query Builder | Knex.js o Prisma |
| Autenticación | JWT (jsonwebtoken) |
| Validación | Joi o Zod |
| Encriptación | bcryptjs |

---

## 2. Arquitectura Modular por Capas

### 2.1 Estructura de Carpetas

```
src/
├── config/                    # Configuración global
│   ├── database.js           # Conexión a PostgreSQL
│   ├── jwt.js                # Configuración JWT
│   └── server.js             # Configuración del servidor
│
├── modules/                  # Módulos funcionales (dominio)
│   ├── auth/                # Módulo de autenticación
│   │   ├── business-logic/
│   │   │   └── auth-service.js
│   │   ├── data-access/
│   │   │   ├── auth-repository.js
│   │   │   └── user-model.js
│   │   ├── presentation/
│   │   │   ├── auth-controller.js
│   │   │   └── auth-routes.js
│   │   └── validators/
│   │       └── auth-validator.js
│   │
│   ├── tasks/               # Módulo de tareas
│   │   ├── business-logic/
│   │   │   └── task-service.js
│   │   ├── data-access/
│   │   │   ├── task-repository.js
│   │   │   └── task-model.js
│   │   ├── presentation/
│   │   │   ├── task-controller.js
│   │   │   └── task-routes.js
│   │   └── validators/
│   │       └── task-validator.js
│   │
│   └── notes/              # Módulo de notas
│       ├── business-logic/
│       │   └── note-service.js
│       ├── data-access/
│       │   ├── note-repository.js
│       │   └── note-model.js
│       ├── presentation/
│       │   ├── note-controller.js
│       │   └── note-routes.js
│       └── validators/
│           └── note-validator.js
│
├── shared/                  # Código compartido
│   ├── middleware/
│   │   ├── auth-middleware.js
│   │   ├── error-handler.js
│   │   └── validator-middleware.js
│   ├── utils/
│   │   ├── date-utils.js
│   │   └── response-utils.js
│   └── constants/
│       └── index.js
│
├── app.js                   # Entry point principal
└── package.json
```

### 2.2 Diagrama de Capas

```
┌─────────────────────────────────────────────────────┐
│                  PRESENTATION                       │
│    (Controllers + Routes + Validators)              │
├─────────────────────────────────────────────────────┤
│               BUSINESS LOGIC                         │
│    (Services - Lógica de negocio pura)              │
├─────────────────────────────────────────────────────┤
│                 DATA ACCESS                         │
│    (Repositories + Models - Persistencia)          │
├─────────────────────────────────────────────────────┤
│                   DATABASE                          │
│              (PostgreSQL)                           │
└─────────────────────────────────────────────────────┘
```

---

## 3. Modelo de Datos

### 3.1 Tabla de Usuarios

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
```

### 3.2 Tabla de Tareas

```sql
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);

CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_status ON tasks(status);
```

### 3.3 Tabla de Notas

```sql
CREATE TABLE notes (
    id SERIAL PRIMARY KEY,
    task_id INTEGER NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_notes_task_id ON notes(task_id);
CREATE INDEX idx_notes_user_id ON notes(user_id);
```

---

## 4. Especificaciones Funcionales

### 4.1 Módulo de Autenticación

#### Endpoints

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | /api/auth/register | Registrar nuevo usuario |
| POST | /api/auth/login | Iniciar sesión |
| GET | /api/auth/me | Obtener usuario actual |

#### Flujo de Registro
1. Validar email y password (email válido, password min 8 caracteres)
2. Verificar que email no exista
3. Encriptar password con bcrypt (10 rondas)
4. Guardar usuario en BD
5. Retornar token JWT

#### Flujo de Login
1. Validar credenciales
2. Buscar usuario por email
3. Verificar password con bcrypt
4. Generar token JWT (exp: 24h)
5. Retornar token y datos de usuario

#### Payload JWT
```javascript
{
    userId: number,
    email: string,
    iat: number,
    exp: number
}
```

### 4.2 Módulo de Tareas

#### Endpoints

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | /api/tasks | Listar todas las tareas del usuario |
| GET | /api/tasks/:id | Obtener tarea específica |
| POST | /api/tasks | Crear nueva tarea |
| PUT | /api/tasks/:id | Actualizar tarea |
| PATCH | /api/tasks/:id/status | Cambiar estado de tarea |
| DELETE | /api/tasks/:id | Eliminar tarea |

#### Casos de Uso

**Crear Tarea**
- Validar título (requerido, max 255 chars)
- Asignar user_id del token JWT
- Establecer status por defecto: "pending"
- Guardar created_at y updated_at automáticamente

**Actualizar Tarea**
- Solo el propietario puede modificar
- Validar título si se proporciona
- Actualizar updated_at automáticamente

**Cambiar Estado**
- Transición: pending → completed
- Al marcar completado: guardar timestamp en completed_at
- Al marcar pendiente: limpiar completed_at

**Listar Tareas**
- Filtrar por status (query param opcional)
- Ordenar por created_at descendente
- Soporte paginación (page, limit)

### 4.3 Módulo de Notas

#### Endpoints

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | /api/tasks/:taskId/notes | Listar notas de una tarea |
| GET | /api/notes/:id | Obtener nota específica |
| POST | /api/tasks/:taskId/notes | Crear nota en tarea |
| PUT | /api/notes/:id | Actualizar nota |
| DELETE | /api/notes/:id | Eliminar nota |

#### Casos de Uso

**Crear Nota**
- Vincular a tarea existente (task_id)
- Validar que tarea pertenezca al usuario
- Validar título (requerido)

**Listar Notas por Tarea**
- Verificar propiedad de la tarea
- Retornar notas asociadas

---

## 5. Reglas de Negocio

### 5.1 Tareas
- Una tarea siempre pertenece a un usuario autenticado
- El título es obligatorio, máximo 255 caracteres
- La descripción es opcional
- Estado inicial: "pending"
- No se puede cambiar el user_id de una tarea
- Al completar tarea, se registra completed_at

### 5.2 Notas
- Una nota siempre pertenece a una tarea
- Una nota siempre pertenece a un usuario
- Título obligatorio, máximo 255 caracteres
- Contenido opcional
- Al eliminar una tarea, se eliminan sus notas (CASCADE)

### 5.3 Fechas
- created_at: se asigna automáticamente al crear
- updated_at: se actualiza automáticamente al modificar
- completed_at: se asigna al marcar tarea como completada

---

## 6. Autenticación y Seguridad

### 6.1 Middleware de Autenticación
```javascript
// Verifica token JWT en header: Authorization: Bearer <token>
- Decodifica token
- Adjunta userId al request
- Maneja token expirado o inválido
```

### 6.2 Validaciones de Propiedad
- Cada endpoint verifica que el recurso pertenezca al usuario autenticado
- Retorna 404 si no existe, 403 si no tiene permiso

### 6.3 Manejo de Errores
- 400: Validación fallida
- 401: No autenticado
- 403: No autorizado
- 404: Recurso no encontrado
- 500: Error interno

---

## 7. Formato de Respuestas

### 7.1 Respuesta Exitosa
```javascript
{
    success: true,
    data: { ... },
    message: "Operación exitosa"
}
```

### 7.2 Respuesta de Error
```javascript
{
    success: false,
    error: {
        code: "ERROR_CODE",
        message: "Descripción del error"
    }
}
```

### 7.3 Paginación
```javascript
{
    success: true,
    data: [...],
    pagination: {
        page: 1,
        limit: 10,
        total: 50,
        totalPages: 5
    }
}
```

---

## 8. Casos de Prueba Principales

### 8.1 Autenticación
- [ ] Registro con email válido
- [ ] Registro con email duplicado → 400
- [ ] Login con credenciales válidas
- [ ] Login con password incorrecto → 401
- [ ] Acceso a endpoint protegido sin token → 401

### 8.2 Tareas
- [ ] Crear tarea autenticado
- [ ] Crear tarea sin título → 400
- [ ] Listar solo mis tareas
- [ ] Actualizar tarea de otro usuario → 404/403
- [ ] Marcar tarea como completada
- [ ] Marcar tarea como pendiente
- [ ] Eliminar tarea elimina sus notas

### 8.3 Notas
- [ ] Crear nota en tarea propia
- [ ] Crear nota en tarea ajena → 404
- [ ] Actualizar nota de otra tarea → 404
- [ ] Listar notas de tarea propia

---

## 9. Dependencias package.json

```json
{
  "name": "tasknote-api",
  "version": "1.0.0",
  "main": "src/app.js",
  "scripts": {
    "start": "node src/app.js",
    "dev": "nodemon src/app.js",
    "migrate": "knex migrate:latest",
    "migrate:rollback": "knex migrate:rollback",
    "seed": "knex seed:run"
  },
  "dependencies": {
    "bcryptjs": "^2.4.3",
    "dotenv": "^16.0.3",
    "express": "^4.18.2",
    "joi": "^17.9.2",
    "jsonwebtoken": "^9.0.0",
    "knex": "^2.4.2",
    "pg": "^8.11.0"
  },
  "devDependencies": {
    "nodemon": "^2.0.22"
  }
}
```

---

## 10. Variables de Entorno

```env
# Server
PORT=3000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=tasknote_db
DB_USER=postgres
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=24h
```

---

## 11. Próximos Pasos para Desarrollo

1. Inicializar proyecto Node.js
2. Configurar Knex.js y migraciones
3. Implementar módulo de autenticación
4. Implementar módulo de tareas
5. Implementar módulo de notas
6. Agregar middleware de autenticación
7. Pruebas unitarias e integración
8. Documentación de API (opcional: Swagger)

---

**Documento creado para desarrollo - TaskNote API**
