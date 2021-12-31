const GoogleStrategy = require('passport-google-oauth20').Strategy;
const Usuario = require('../modelos/Usuario');
const GerenciadorPerfis = require('../servicos/GerenciadorPerfis');

module.exports = function (passport) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CLIENT_REDIRECT_URL || '/login/google/callback',
      },
      async (accessToken, refreshToken, profile, done) => {
        const novoUsuario = {
          googleId: profile.id,
          nome: profile.displayName
        }

        try {
          let usuario = await Usuario.findOne({ googleId: profile.id })
          if (usuario) {
            done(null, usuario);
          } else {
            
            // cria usuário e perfil
            usuario = await Usuario.create(novoUsuario)
            await GerenciadorPerfis.criaNovoPerfil(usuario._id, usuario.nome);
            done(null, usuario)
          }
        } catch (err) {
          console.error(err)
        }
      }
    )
  )

  passport.serializeUser((user, done) => {
    done(null, user.id)
  })

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => done(err, user))
  })
}
