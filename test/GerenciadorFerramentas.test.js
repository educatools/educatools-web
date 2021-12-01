const dbHandler = require('./BancoDeDadosTest');
const GerenciadorFerramentas = require("../servicos/GerenciadorFerramentas");

/** Configuração do Banco de dados em memória */
beforeAll(async() => await dbHandler.connect());
afterEach(async() => await dbHandler.clearDatabase());
afterAll(async() => await dbHandler.closeDatabase());

test('Cria uma nova ferramenta', async () => {
  const ferramenta = await GerenciadorFerramentas.criaFerramenta("id","url", "usuario", "nome", "descricao", "todos", "video");

  expect(ferramenta).not.toBeNull();
  expect(ferramenta.id).toBe("id");
  expect(ferramenta.url).toBe("url");
  expect(ferramenta.usuario).toBe("usuario");
  expect(ferramenta.nome).toBe("nome");
  expect(ferramenta.descricao).toBe("descricao");
  expect(ferramenta.ciclos).toBe("todos");
  expect(ferramenta.video).toBe("video");

});

test('Recupera todas as ferramentas', async () => {
  await GerenciadorFerramentas.criaFerramenta("id","url", "usuario", "nome", "descricao", "todos", "video");
  await GerenciadorFerramentas.criaFerramenta("id2", "url2", "usuario2", "nome2", "descricao2", "todos", "video2");
  
  const ferramentas = await GerenciadorFerramentas.recuperaTodasFerramentas();
  expect(ferramentas.length).toBe(2);
});

test('Recupera uma ferramenta por id', async () => {
  const {_id} = await GerenciadorFerramentas.criaFerramenta("id","url", "usuario", "nome", "descricao", "todos", "video");
  const ferramenta = await GerenciadorFerramentas.recuperaFerramentaPorId(_id);
  expect(ferramenta).not.toBeNull();
  expect(ferramenta._id).toStrictEqual(_id);
});