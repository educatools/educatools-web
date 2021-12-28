const dbHandler = require('./BancoDeDadosTest');
const GerenciadorFerramentas = require("../servicos/GerenciadorFerramentas");
const GerenciadorComentarios = require("../servicos/GerenciadorComentarios");

/** Configuração do Banco de dados em memória */
beforeAll(async() => await dbHandler.connect());
afterEach(async() => await dbHandler.clearDatabase());
afterAll(async() => await dbHandler.closeDatabase());

test('Cria um novo comentário', async () => {
  const ferramenta = await GerenciadorFerramentas.criaFerramenta("id","url", "usuario", "nome", "descricao", "todos", "video", "desenvolvedor");
  
  const usuarioIdMock = "1231231a23bc";
  const comentario = await GerenciadorComentarios.adicionarComentario(usuarioIdMock, ferramenta._id, "Meu comentário!");

  expect(comentario).not.toBeNull();
  expect(comentario._id).not.toBeNull();
  expect(comentario.usuarioId).toBe(usuarioIdMock);
  expect(comentario.ferramentaId).toBe(ferramenta._id.toString());
  expect(comentario.comentario).toBe("Meu comentário!");
});

test('Recupera todos comentários de uma ferramenta', async () => {
  const ferramenta = await GerenciadorFerramentas.criaFerramenta("id","url", "usuario", "nome", "descricao", "todos", "video", "desenvolvedor");

  const usuario1IdMock = "1231231a23bc";
  const usuario2IdMock = "4565456545ae";

  await GerenciadorComentarios.adicionarComentario(usuario1IdMock, ferramenta._id, "Comentário usuário 1!");
  await GerenciadorComentarios.adicionarComentario(usuario2IdMock, ferramenta._id, "Comentário usuário 2!");

  const comentarios = await GerenciadorComentarios.recuperaTodosComentariosFerramenta(ferramenta._id);
  expect(comentarios.length).toBe(2);
});

test('Remove comentário', async () => {
  const ferramenta = await GerenciadorFerramentas.criaFerramenta("id","url", "usuario", "nome", "descricao", "todos", "video", "desenvolvedor");

  const usuario1IdMock = "1231231a23bc";
  const usuario2IdMock = "4565456545ae";

  const comentario = await GerenciadorComentarios.adicionarComentario(usuario1IdMock, ferramenta._id, "Comentário usuário 1!");
  await GerenciadorComentarios.adicionarComentario(usuario2IdMock, ferramenta._id, "Comentário usuário 2!");

  await GerenciadorComentarios.removeComentario(comentario._id);

  const comentarios = await GerenciadorComentarios.recuperaTodosComentariosFerramenta(ferramenta._id);
  expect(comentarios.length).toBe(1);
  expect(comentarios[0].comentario).toBe("Comentário usuário 2!");
});