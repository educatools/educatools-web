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
    
    try {
     return await usuario.save();
    } catch (err) {
      console.log(err);
      throw new Error("Erro ao criar um novo usuário.");
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

      return await Usuario.findOneAndUpdate(filtro, update , opcoes);

    } catch(err) {
      console.log(err);
      throw new Error("Erro ao tentar alterar dados de um usuário.");
    }
  },

  async deletaUsuario(id) {
    try {
      let usuario = await Usuario.findById(id);
      if (!usuario) {
        throw new Error("Não existe usuário com este id.");
      }
      await Usuario.remove({ _id: id });
      return true;
    } catch (err) {
      console.error(err);
      throw new Error("Erro ao tentar deletar um usuário", err);
    }
  },

  async recuperaUsuarioPorId(id) {
    try {
      return await Usuario.findOne({_id: id}).lean();
    } catch (err) {
      console.log(err);
      throw new Error("Erro ao tentar recuperar usuário por id.");
    }
  },

  async recuperaTodosUsuarios() {
    try {
        return await Usuario.find({}).lean();
    } catch (err) {
        console.error(err);
        throw new Error("Erro ao tentar recuperar todos os usuários.");
    }
  }


}

module.exports = GerenciadorUsuarios;