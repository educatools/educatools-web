/** Referências 
 * 
 * Ref 1: https://dev.to/paulasantamaria/testing-node-js-mongoose-with-an-in-memory-database-32np
 * Ref 2: https://dev.to/remrkabledev/testing-with-mongodb-memory-server-4ja2
 * 
 * https://jestjs.io/pt-BR/docs/getting-started
 * https://github.com/nodkz/mongodb-memory-server
 * 
*/

const dbHandler = require('./BancoDeDadosTest');
const GerenciadorUsuarios = require("../servicos/GerenciadorUsuarios");

/** Configuração do Banco de dados em memória */
beforeAll(async() => await dbHandler.connect());
afterEach(async() => await dbHandler.clearDatabase());
afterAll(async() => await dbHandler.closeDatabase());

test('Cria novo usuário', async () => {
  const usuario = await GerenciadorUsuarios.criaUsuario("teste", "teste@gmail.com", "usuario", "teste");

  expect(usuario).not.toBeNull();
  expect(usuario.nome).toBe("teste");
  expect(usuario.email).toBe("teste@gmail.com");
  expect(usuario.tipo).toBe("usuario");
  expect(usuario.senha).not.toBe("teste");
});

test('Altera dados de um usuário', async () => {
  const usuario = await GerenciadorUsuarios.criaUsuario("teste", "teste@gmail.com", "usuario", "teste");
  const usuarioAlterado = await GerenciadorUsuarios.alteraUsuario(usuario._id, "teste 2", "teste2@gmail.com", "admin");

  expect(usuarioAlterado).not.toBeNull();
  expect(usuarioAlterado.nome).toBe("teste 2");
  expect(usuarioAlterado.email).toBe("teste2@gmail.com");
  expect(usuarioAlterado.tipo).toBe("admin");
  expect(usuario.senha).not.toBe("teste");

});