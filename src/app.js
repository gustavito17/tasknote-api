require('dotenv').config();

const { createServer } = require('./config/server');
const { errorHandler, notFoundHandler } = require('./shared/middleware/error-handler');
const authRoutes = require('./modules/auth/presentation/auth-routes');
const taskRoutes = require('./modules/tasks/presentation/task-routes');
const noteRoutes = require('./modules/notes/presentation/note-routes');

const app = createServer();

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api', noteRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en el puerto ${PORT}`);
  console.log(`Documentación API: http://localhost:${PORT}/api-docs`);
});

module.exports = app;
