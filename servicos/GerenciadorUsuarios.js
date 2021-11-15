const bcrypt = require('bcryptjs');
const Usuario = require('../modelos/Usuario');

const GerenciadorUsuarios = {

  async criaUsuarioAdministrador() {

    const usuarios = await Usuario.find({ tipo: "admin" });
    if (!usuarios || usuarios.length === 0) {

      console.log("Criando o usuário administrador");

      const administrador = new Usuario({
        tipo: "admin",
        nome: process.env.ADMIN_NOME || "Administrador",
        sobrenome: process.env.ADMIN_SOBRENOME || "administrador",
        email: process.env.ADMIN_EMAIL || "admin",
        senha: process.env.ADMIN_SENHA || "admin"
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(administrador.senha, salt, (err, hash) => {
          if (err) throw err;
          administrador.senha = hash;
          administrador
            .save()
            .then(administrador => {
              console.log("usuário administrador criado com sucesso", administrador);
            })
            .catch(err => console.log(err));
        });
      });
    }

  }
}

module.exports = GerenciadorUsuarios;