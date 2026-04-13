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
      console.error('[Google Auth] supabase.auth.getUser error:', error?.message ?? 'no user returned');
      throw new ApiError(`Token de Google inválido: ${error?.message ?? 'no user'}`, 401);
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
      // 3. Crear nuevo usuario (Google-only: password_hash marcado como inutilizable)
      let finalUsername = username;
      const existing = await authRepository.findUserByUsername(username);
      if (existing) {
        finalUsername = `${username}_${Date.now().toString(36)}`;
      }

      try {
        user = await authRepository.createUser({
          username: finalUsername,
          email,
          password_hash: 'GOOGLE_OAUTH',
        });
      } catch (createErr) {
        console.error('[Google Auth] createUser error:', createErr?.message ?? createErr);
        throw new ApiError(`Error al crear usuario: ${createErr?.message ?? 'unknown'}`, 500);
      }
    }

    // 4. Emitir nuestro JWT propio
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn }
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
