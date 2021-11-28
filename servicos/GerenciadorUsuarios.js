const bcrypt = require('bcryptjs');
const Usuario = require('../modelos/Usuario');

const GerenciadorUsuarios = {

  /**
   * Cria o primeiro usuário administrador do sistema.
   */
  async criaUsuarioAdministrador() {

    const usuarios = await Usuario.find({ tipo: "admin" });
    if (!usuarios || usuarios.length === 0) {

      console.log("Criando o usuário administrador");

      const nome =  process.env.ADMIN_NOME || "admin";
      const email = process.env.ADMIN_EMAIL || "admin";
      const senha = process.env.ADMIN_SENHA || "admin";
      const tipo = "admin";

      await this.criaUsuario(nome, email, tipo, senha);

    }

  },

  async criaUsuario(nome, email, tipo, senha) {

    const usuario = new Usuario({tipo, email, nome, senha});
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(usuario.senha, salt, (err, hash) => {
        if (err) throw err;
        usuario.senha = hash;
        usuario
          .save()
          .then(usuario => {
            console.log("usuário criado com sucesso", usuario);
          })
          .catch(err => console.log(err));
      });
    });

  },


  async alteraUsuario(id, nome, email, tipo) {
    try {
      let usuario = await Usuario.findById(id);
      if(!usuario) throw new Error("Usuário não encontrado para fazer update");

      const filtro = {_id: id};
      const update = {nome, email, tipo};
      const opcoes = {
        new: true,
        runValidators: true,
      };

      usuario = await Usuario.findOneAndUpdate(filtro, update , opcoes);

      return usuario;

    } catch(err) {
      console.log(err);
      throw new Error();
    }
  }


}

module.exports = GerenciadorUsuarios;