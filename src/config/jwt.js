if (!process.env.JWT_SECRET) {
  console.error('FATAL: JWT_SECRET env var is not set');
  process.exit(1);
}

module.exports = {
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',
  jwtAlgorithm: 'HS256',
};
