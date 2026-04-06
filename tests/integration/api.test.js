const request = require('supertest');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const db = require('../../src/config/database');
const app = require('../../src/app');
const config = require('../../src/config/jwt');

const testUser = {
  username: 'testuser',
  email: 'test@example.com',
  password: 'password123'
};

let authToken;
let testTaskId;
let testNoteId;

const createAuthToken = (user) => {
  return jwt.sign(
    { userId: user.id, email: user.email },
    config.jwtSecret,
    { expiresIn: '1h' }
  );
};

describe('API Integration Tests', () => {
  beforeAll(async () => {
    const hashedPassword = await bcrypt.hash(testUser.password, 10);
    
    await db('users').insert({
      username: testUser.username,
      email: testUser.email,
      password_hash: hashedPassword
    }).onConflict('email').ignore();

    const user = await db('users').where({ email: testUser.email }).first();
    if (user) {
      authToken = createAuthToken(user);
    }
  });

  afterAll(async () => {
    await db('notes').whereIn('task_id', 
      db('tasks').select('id').where('user_id', 1)
    ).del();
    await db('tasks').where({ user_id: 1 }).del();
    await db('users').where({ email: testUser.email }).del();
    await db.destroy();
  });

  describe('Auth Endpoints', () => {
    it('POST /api/auth/register - debe registrar un nuevo usuario', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'newuser',
          email: 'newuser@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('token');
    });

    it('POST /api/auth/login - debe iniciar sesión', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('token');
    });

    it('GET /api/auth/me - debe obtener el usuario actual', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.email).toBe(testUser.email);
    });
  });

  describe('Tasks Endpoints', () => {
    it('POST /api/tasks - debe crear una tarea', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Tarea de prueba',
          description: 'Descripción de prueba'
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe('Tarea de prueba');
      testTaskId = response.body.data.id;
    });

    it('GET /api/tasks - debe listar tareas', async () => {
      const response = await request(app)
        .get('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeInstanceOf(Array);
    });

    it('GET /api/tasks/:id - debe obtener una tarea específica', async () => {
      const response = await request(app)
        .get(`/api/tasks/${testTaskId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data.id).toBe(testTaskId);
    });

    it('PATCH /api/tasks/:id/status - debe cambiar el estado de la tarea', async () => {
      const response = await request(app)
        .patch(`/api/tasks/${testTaskId}/status`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ status: 'completed' });

      expect(response.status).toBe(200);
      expect(response.body.data.status).toBe('completed');
    });
  });

  describe('Notes Endpoints', () => {
    it('POST /api/tasks/:taskId/notes - debe crear una nota', async () => {
      const response = await request(app)
        .post(`/api/tasks/${testTaskId}/notes`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Nota de prueba',
          content: 'Contenido de la nota'
        });

      expect(response.status).toBe(201);
      expect(response.body.data.title).toBe('Nota de prueba');
      testNoteId = response.body.data.id;
    });

    it('GET /api/tasks/:taskId/notes - debe listar notas de una tarea', async () => {
      const response = await request(app)
        .get(`/api/tasks/${testTaskId}/notes`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data).toBeInstanceOf(Array);
    });

    it('GET /api/notes/:id - debe obtener una nota específica', async () => {
      const response = await request(app)
        .get(`/api/notes/${testNoteId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data.id).toBe(testNoteId);
    });

    it('PUT /api/notes/:id - debe actualizar una nota', async () => {
      const response = await request(app)
        .put(`/api/notes/${testNoteId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'Nota actualizada' });

      expect(response.status).toBe(200);
      expect(response.body.data.title).toBe('Nota actualizada');
    });

    it('DELETE /api/notes/:id - debe eliminar una nota', async () => {
      const response = await request(app)
        .delete(`/api/notes/${testNoteId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
    });
  });

  describe('Security Tests', () => {
    it('debe rechazar acceso sin token', async () => {
      const response = await request(app)
        .get('/api/tasks');

      expect(response.status).toBe(401);
    });

    it('debe rechazar token inválido', async () => {
      const response = await request(app)
        .get('/api/tasks')
        .set('Authorization', 'Bearer invalid_token');

      expect(response.status).toBe(401);
    });

    it('debe rechazar acceso a tarea de otro usuario', async () => {
      const otherUserToken = jwt.sign(
        { userId: 999, email: 'other@test.com' },
        config.jwtSecret,
        { expiresIn: '1h' }
      );

      const response = await request(app)
        .get(`/api/tasks/${testTaskId}`)
        .set('Authorization', `Bearer ${otherUserToken}`);

      expect(response.status).toBe(404);
    });
  });
});
