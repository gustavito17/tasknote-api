const { createClient } = require('@supabase/supabase-js');
const authRepository = require('../data-access/auth-repository');
const ApiError = require('../../../shared/utils/api-error');
const jwt = require('jsonwebtoken');
const config = require('../../../config/jwt');

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

class AuthServiceGoogle {
  /**
   * Verifica el access_token de Supabase OAuth, crea o busca el usuario
   * en nuestra tabla users, y devuelve nuestro JWT propio.
   */
  async loginWithGoogle(supabaseAccessToken) {
    // 1. Verificar el token con Supabase
    const { data: { user: supabaseUser }, error } = await supabaseAdmin.auth.getUser(supabaseAccessToken);

    if (error || !supabaseUser) {
      throw new ApiError('Token de Google inválido', 401);
    }

    const email = supabaseUser.email;
    const googleName = supabaseUser.user_metadata?.full_name
      || supabaseUser.user_metadata?.name
      || email.split('@')[0];

    // Sanitiza el username: solo alfanumérico + guión bajo
    const username = googleName.replace(/[^a-zA-Z0-9_]/g, '_').toLowerCase();

    // 2. Buscar usuario existente por email
    let user = await authRepository.findUserByEmail(email);

    if (!user) {
      // 3. Crear nuevo usuario (sin password_hash — solo Google)
      let finalUsername = username;
      const existing = await authRepository.findUserByUsername(username);
      if (existing) {
        finalUsername = `${username}_${Date.now().toString(36)}`;
      }

      user = await authRepository.createUser({
        username: finalUsername,
        email,
        password_hash: null,
      });
    }

    // 4. Emitir nuestro JWT propio
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      config.secret,
      { expiresIn: config.expiresIn }
    );

    return {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        createdAt: user.created_at,
      },
      token,
    };
  }
}

module.exports = new AuthServiceGoogle();
