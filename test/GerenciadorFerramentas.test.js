const dbHandler = require('./BancoDeDadosTest');
const GerenciadorFerramentas = require("../servicos/GerenciadorFerramentas");
const { TestWatcher } = require('@jest/core');

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

test("Altera dados de uma ferramenta", async () => {
  const ferramenta = await GerenciadorFerramentas.criaFerramenta("Teste", "https://www.teste.com.br", "Teste", "Teste", "Teste", "todos", "vqJLRvk6_Xc");

  const ferramentaAlterada = await GerenciadorFerramentas.alteraFerramenta(ferramenta._id, "Nome Teste2", "https://www.teste2.com.br", "Descrição Teste2", "aprovado", "infantil", "vqJLRvk6_Xca");

  expect(ferramentaAlterada).not.toBeNull();
  const {nome, url, usuario, descricao, status, ciclos, video} = ferramentaAlterada;

  expect(ferramentaAlterada._id).toStrictEqual(ferramenta._id);
  expect(nome).toBe("Nome Teste2");
  expect(url).toBe("https://www.teste2.com.br");
  expect(usuario).toBe("Teste"); // não foi alterado
  expect(descricao).toBe("Descrição Teste2");
  expect(status).toBe("aprovado");
  expect(ciclos).toBe("infantil");
  expect(video).toBe("vqJLRvk6_Xca");

})

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

test("Deleta uma ferramenta", async () => {
  const {_id} =   await GerenciadorFerramentas.criaFerramenta("id","url", "usuario", "nome", "descricao", "todos", "video");

  await GerenciadorFerramentas.deletaFerramenta(_id);
  const ferramenta = await GerenciadorFerramentas.recuperaFerramentaPorId(_id);

  expect(ferramenta).toBeNull();
})