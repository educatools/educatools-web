const GerenciadorSenhas = require("../servicos/GerenciadorSenhas");
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
    const conjuntoSalt = await GerenciadorSenhas.genSalt(senha);
    const conjuntoHash = await GerenciadorSenhas.genHash(conjuntoSalt.salt, conjuntoSalt.password);

    usuario.senha = conjuntoHash.hash;
    
    try{
      const novoUsuario = await usuario.save();
      return novoUsuario;
    } catch (err) {
      console.log("Erro ao criar usuário", err);
    }
  },


  async alteraUsuario(id, nome, email, tipo) {
    try {
      const filtro = {_id: id};
      const update = {nome, email, tipo};
      const opcoes = {
        new: true,
        runValidators: true,
      };

      const usuarioAlterado = await Usuario.findOneAndUpdate(filtro, update , opcoes);
      return usuarioAlterado;

    } catch(err) {
      console.log(err);
      throw new Error();
    }
  }


}

module.exports = GerenciadorUsuarios;