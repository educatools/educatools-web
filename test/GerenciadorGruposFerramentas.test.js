const dbHandler = require('./BancoDeDadosTest');
const GerenciadorGruposFerramentas = require('../servicos/GerenciadorGruposFerramentas');

const { TestWatcher } = require('@jest/core');

/** Configuração do Banco de dados em memória */
beforeAll(async() => await dbHandler.connect());
afterEach(async() => await dbHandler.clearDatabase());
afterAll(async() => await dbHandler.closeDatabase());

test('Cria um novo grupo de ferramentas', async () => {
  const grupo = await GerenciadorGruposFerramentas.criaGrupoFerramentas("usuarioId", "Nome do Grupo", true, []);

  expect(grupo).not.toBeNull();
  expect(grupo._id).not.toBeUndefined();
  expect(grupo.usuarioId).toBe("usuarioId");
  expect(grupo.nome).toBe("Nome do Grupo");
  expect(grupo.compartilhado).toBeTruthy();
  expect(grupo.ferramentas.length).toBe(0);
  expect(grupo.link).not.toBeUndefined();
});

test('Recupera todos os grupos de ferramentas do usuário', async () => {
  await GerenciadorGruposFerramentas.criaGrupoFerramentas("usuarioId", "Nome do Grupo 1", true, []);
  await GerenciadorGruposFerramentas.criaGrupoFerramentas("usuarioId", "Nome do Grupo 2", true, []);

  const grupos = await GerenciadorGruposFerramentas.recuperaTodosGruposFerramentas("usuarioId");

  expect(grupos.length).toBe(2);
});

test('Recupera grupo de ferramentas por id', async () => {
  const {_id: grupoId} = await GerenciadorGruposFerramentas.criaGrupoFerramentas("usuarioId", "Nome do Grupo", false, ["id"]);

  const grupo = await GerenciadorGruposFerramentas.recuperaGrupoFerramentasPorId(grupoId);

  expect(grupo).not.toBeNull();
  expect(grupo._id).toStrictEqual(grupoId);
  expect(grupo.usuarioId).toBe("usuarioId");
  expect(grupo.nome).toBe("Nome do Grupo");
  expect(grupo.compartilhado).toBeFalsy();
  expect(grupo.ferramentas.length).toBe(1);
  expect(grupo.link).not.toBeUndefined();
});

test('Altera grupo de ferramentas', async () => {
  const {_id: grupoId} = await GerenciadorGruposFerramentas.criaGrupoFerramentas("usuarioId", "Nome do Grupo", false, ["id"]);

  const {link} = await GerenciadorGruposFerramentas.alteraGrupo(grupoId, "Nome do Grupo Alterado", ["id1", "id2"], true);

  const grupoAlterado = await GerenciadorGruposFerramentas.recuperaGrupoFerramentasPorId(grupoId);

  expect(grupoAlterado).not.toBeNull();
  expect(grupoAlterado._id).toStrictEqual(grupoId);
  expect(grupoAlterado.usuarioId).toBe("usuarioId");
  expect(grupoAlterado.nome).toBe("Nome do Grupo Alterado");
  expect(grupoAlterado.compartilhado).toBeTruthy();
  expect(grupoAlterado.ferramentas.length).toBe(2);
  expect(grupoAlterado.link).toBe(link);
});

test('Deleta um grupo de ferramentas', async () => {
  const {_id: grupoId} = await GerenciadorGruposFerramentas.criaGrupoFerramentas("usuarioId", "Nome do Grupo", false, ["id"]);

  await GerenciadorGruposFerramentas.deletaGrupoFerramentas(grupoId);

  const grupoRecuperado = await GerenciadorGruposFerramentas.recuperaGrupoFerramentasPorId(grupoId);

  expect(grupoRecuperado).toBeNull();
});

test('Recupera grupo por link único', async () => {
  const {link, _id: grupoId} = await GerenciadorGruposFerramentas.criaGrupoFerramentas("usuarioId", "Nome do Grupo", false, ["id"]);

  const grupo = await GerenciadorGruposFerramentas.recuperaGrupoPorLinkUnico(link);

  expect(grupo).not.toBeNull();
  expect(grupo._id).toStrictEqual(grupoId);
  expect(grupo.usuarioId).toBe("usuarioId");
  expect(grupo.nome).toBe("Nome do Grupo");
  expect(grupo.compartilhado).toBeFalsy();
  expect(grupo.ferramentas.length).toBe(1);
  expect(grupo.link).toBe(link);
});