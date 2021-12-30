const dbHandler = require('./BancoDeDadosTest');
const GerenciadorFerramentas = require("../servicos/GerenciadorFerramentas");
const GerenciadorUsuarios = require('../servicos/GerenciadorUsuarios');
const { TestWatcher } = require('@jest/core');

/** Configuração do Banco de dados em memória */
beforeAll(async() => await dbHandler.connect());
afterEach(async() => await dbHandler.clearDatabase());
afterAll(async() => await dbHandler.closeDatabase());

test('Cria uma nova ferramenta', async () => {
  const ferramenta = await GerenciadorFerramentas.criaFerramenta("id","url", "31a231223123", "nome", "descricao", "todos", "video", "desenvolvedor");

  expect(ferramenta).not.toBeNull();
  expect(ferramenta.id).toBe("id");
  expect(ferramenta.url).toBe("url");
  expect(ferramenta.usuarioId).toBe("31a231223123");
  expect(ferramenta.nome).toBe("nome");
  expect(ferramenta.descricao).toBe("descricao");
  expect(ferramenta.ciclos).toBe("todos");
  expect(ferramenta.video).toBe("video");
  expect(ferramenta.desenvolvedor).toBe("desenvolvedor");

});

test("Altera dados de uma ferramenta", async () => {
  const ferramenta = await GerenciadorFerramentas.criaFerramenta("Teste", "https://www.teste.com.br", "31a231223123", "Teste", "Teste", "todos", "vqJLRvk6_Xc", "desenvolvedor");

  const ferramentaAlterada = await GerenciadorFerramentas.alteraFerramenta(ferramenta._id, "Nome Teste2", "https://www.teste2.com.br", "Descrição Teste2", "aprovado", "infantil", "vqJLRvk6_Xca", "desenvolvedor 2");

  expect(ferramentaAlterada).not.toBeNull();
  const {nome, url, usuarioId, descricao, status, ciclos, video, desenvolvedor} = ferramentaAlterada;

  expect(ferramentaAlterada._id).toStrictEqual(ferramenta._id);
  expect(nome).toBe("Nome Teste2");
  expect(url).toBe("https://www.teste2.com.br");
  expect(usuarioId).toBe("31a231223123"); // não foi alterado
  expect(descricao).toBe("Descrição Teste2");
  expect(status).toBe("aprovado");
  expect(ciclos).toBe("infantil");
  expect(video).toBe("vqJLRvk6_Xca");
  expect(desenvolvedor).toBe("desenvolvedor 2");
});

test('Recupera todas as ferramentas', async () => {
  await GerenciadorFerramentas.criaFerramenta("id","url", "usuario", "nome", "descricao", "todos", "video", "desenvolvedor");
  await GerenciadorFerramentas.criaFerramenta("id2", "url2", "usuario2", "nome2", "descricao2", "todos", "video2", "desenvolvedor 2");
  
  const ferramentas = await GerenciadorFerramentas.recuperaTodasFerramentas();
  expect(ferramentas.length).toBe(2);
});

test('Recupera uma ferramenta por id', async () => {
  const {_id} = await GerenciadorFerramentas.criaFerramenta("id","url", "usuario", "nome", "descricao", "todos", "video", "desenvolvedor");
  const ferramenta = await GerenciadorFerramentas.recuperaFerramentaPorId(_id);
  expect(ferramenta).not.toBeNull();
  expect(ferramenta._id).toStrictEqual(_id);
});

test("Deleta uma ferramenta", async () => {
  const {_id} =   await GerenciadorFerramentas.criaFerramenta("id","url", "usuario", "nome", "descricao", "todos", "video", "desenvolvedor");

  await GerenciadorFerramentas.deletaFerramenta(_id);
  const ferramenta = await GerenciadorFerramentas.recuperaFerramentaPorId(_id);

  expect(ferramenta).toBeNull();
});

test("Favorita uma ferramenta", async () => {
  const {_id: ferramentaId} =   await GerenciadorFerramentas.criaFerramenta("id","url", "usuario", "nome", "descricao", "todos", "video", "desenvolvedor");

  const {_id: usuarioId} = await GerenciadorUsuarios.criaUsuario("Teste", "teste@teste.com.br", "admin", "senha");

  await GerenciadorFerramentas.favoritarFerramenta(ferramentaId, usuarioId);

  const Favorito = require("../modelos/Favorito");
  const favorito = await Favorito.findOne({usuarioId}).lean();
  expect(favorito).not.toBeNull();
  expect(favorito.ferramentas.length).toBe(1);

  expect(favorito.usuarioId).toBe(usuarioId.toString());
  expect(favorito.ferramentas[0]).toBe(ferramentaId.toString());
});

test("Desfavorita uma ferramenta", async () => {
  const ferramenta =   await GerenciadorFerramentas.criaFerramenta("id","url", "usuario", "nome", "descricao", "todos", "video", "desenvolvedor");

  const usuario = await GerenciadorUsuarios.criaUsuario("Teste", "teste@teste.com.br", "admin", "senha");

  const ferramentaId = ferramenta._id.toString();
  const usuarioId = usuario._id.toString();

  await GerenciadorFerramentas.favoritarFerramenta(ferramentaId, usuarioId);

  const Favorito = require("../modelos/Favorito");
  let favorito = await Favorito.findOne({usuarioId}).lean();
  expect(favorito).not.toBeNull();
  expect(favorito.ferramentas.length).toBe(1);
  expect(favorito.usuarioId).toBe(usuarioId.toString());
  expect(favorito.ferramentas[0]).toBe(ferramentaId.toString());

  await GerenciadorFerramentas.desfavoritarFerramenta(ferramentaId, usuarioId);
  favorito = await Favorito.findOne({usuarioId}).lean();
  expect(favorito.ferramentas.length).toBe(0);
});

test("Checa se uma ferramenta é favorita", async () => {
  const ferramenta = await GerenciadorFerramentas.criaFerramenta("id","url", "usuario", "nome", "descricao", "todos", "video", "desenvolvedor");

  const usuario = await GerenciadorUsuarios.criaUsuario("Teste", "teste@teste.com.br", "admin", "senha");

  const ferramentaId = ferramenta._id.toString();
  const usuarioId = usuario._id.toString();

  await GerenciadorFerramentas.favoritarFerramenta(ferramentaId, usuarioId);

  const isFavorita = await GerenciadorFerramentas.isFerramentaFavorita(ferramentaId, usuarioId);

  expect(isFavorita).toBeTruthy();
});

test("Recupera todas as ferramentas favoritas", async () => {
  const ferramenta1 = await GerenciadorFerramentas.criaFerramenta("id","url", "usuario", "nome", "descricao", "todos", "video", "desenvolvedor");

  const ferramenta2 = await GerenciadorFerramentas.criaFerramenta("id2","url2", "usuario2", "nome2", "descricao2", "todos", "video2", "desenvolvedor 2");

  const usuario = await GerenciadorUsuarios.criaUsuario("Teste", "teste@teste.com.br", "admin", "senha");

  const ferramentaId = ferramenta1._id.toString();
  const ferramentaId2 = ferramenta2._id.toString();
  const usuarioId = usuario._id.toString();

  await GerenciadorFerramentas.favoritarFerramenta(ferramentaId, usuarioId);
  await GerenciadorFerramentas.favoritarFerramenta(ferramentaId2, usuarioId);

  const ferramentasFavoritasSalvas = await GerenciadorFerramentas.recuperaTodasFerramentasFavoritas(usuarioId);

  expect(ferramentasFavoritasSalvas.length).toBe(2);
});