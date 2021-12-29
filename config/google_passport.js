const GoogleStrategy = require('passport-google-oauth20').Strategy;
const Usuario = require('../modelos/Usuario');

module.exports = function (passport) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/login/google/callback',
      },
      async (accessToken, refreshToken, profile, done) => {

        console.log("profile", profile);

        const novoUsuario = {
          googleId: profile.id,
          nome: profile.displayName
        }

        try {
          let usuario = await Usuario.findOne({ googleId: profile.id })
          if (usuario) {
            done(null, usuario);
          } else {
            usuario = await Usuario.create(novoUsuario)
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
