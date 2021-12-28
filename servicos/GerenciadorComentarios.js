const Comentario = require("../modelos/Comentario");

const GerenciadorComentarios = {

  async adicionarComentario(usuarioId, ferramentaId, comentario) {
    try {
      const novoComentario = new Comentario({
        usuarioId, ferramentaId, comentario
      });

      return await novoComentario.save();
    } catch(err) {
      console.log(err);
      throw new Error("Erro ao tentar adicionar um comentário.", err);
    }
  },

  async recuperaTodosComentariosFerramenta(ferramentaId) {
    try {
      const comentarios = await Comentario.find({ferramentaId}).lean();
      return comentarios;
    } catch(err) {
      console.log(err);
      throw new Error("Erro ao tentar recuperar comentários da ferramenta.", err);
    }
  },

  async removeComentario(comentarioId) {
    try {
      await Comentario.deleteOne({ _id: comentarioId });
    } catch(err) {
      console.log(err);
      throw new Error("Erro ao tentar recuperar comentários da ferramenta.", err);
    }
  }

};

module.exports = GerenciadorComentarios;