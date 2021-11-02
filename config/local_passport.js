const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

const Usuario = require('../modelos/Usuario');

module.exports = function(passport) {
  passport.use(
    new LocalStrategy({ usernameField: 'email', passwordField: 'senha' }, (email, senha, done) => {
      Usuario.findOne({
        email: email
      }).then(usuario => {
        if (!usuario) {
          return done(null, false, { message: 'Este e-mail não foi registrado.' });
        }

        // bate a senha do usuário
        bcrypt.compare(senha, usuario.senha, (err, isMatch) => {
          if (err) throw err;
          if (isMatch) {
            return done(null, usuario);
          } else {
            return done(null, false, { message: 'Senha incorreta.' });
          }
        });
      });
    })
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    Usuario.findById(id, (err, user) => {
      done(err, user);
    });
  });
};
