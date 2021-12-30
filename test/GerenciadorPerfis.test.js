const dbHandler = require('./BancoDeDadosTest');

const GerenciadorUsuarios = require('../servicos/GerenciadorUsuarios');
const GerenciadorPerfis = require('../servicos/GerenciadorPerfis');

/** Configuração do Banco de dados em memória */
beforeAll(async() => await dbHandler.connect());
afterEach(async() => await dbHandler.clearDatabase());
afterAll(async() => await dbHandler.closeDatabase());

test('Cria um novo perfil', async () => {
  const perfil = await GerenciadorPerfis.criaNovoPerfil("128309128", "Jonas");
  
  expect(perfil).not.toBeNull();
  expect(perfil.usuarioId).toBe("128309128");
  expect(perfil.nomeExibicao).toBe("Jonas");
  expect(perfil.minibio).toBe("Usuário do Educatools!");
  expect(perfil.profissao).toBe("educador");
  expect(perfil.instituicao).toBe("Indefinido");
  expect(perfil.mostraFavoritos).toBeTruthy();
  expect(perfil.mostraFerramentas).toBeTruthy();
  expect(perfil.link).not.toBeNull();
});

test('Altera um perfil', async () => {
  const perfil = await GerenciadorPerfis.criaNovoPerfil("s23ve2123", "Jonas");
  
  const perfilAlterado = await GerenciadorPerfis.alteraPerfil(perfil._id, "Joaquim", "Sou um usuário de testes", "Escola de Testes", "coordenador", false, false);

  expect(perfilAlterado).not.toBeNull();
  expect(perfilAlterado.usuarioId).toBe("s23ve2123");
  expect(perfilAlterado.nomeExibicao).toBe("Joaquim");
  expect(perfilAlterado.minibio).toBe("Sou um usuário de testes");
  expect(perfilAlterado.profissao).toBe("coordenador");
  expect(perfilAlterado.instituicao).toBe("Escola de Testes");
  expect(perfilAlterado.mostraFavoritos).toBeFalsy();
  expect(perfilAlterado.mostraFerramentas).toBeFalsy();
  expect(perfilAlterado.link).toBe(perfil.link);
});

test('Recupera perfil completo por link', async () => {
  const usuario = await GerenciadorUsuarios.criaUsuario("Marcelo", "marcelo@gmail.com", "usuario", "123marcelo");

  const perfil = await GerenciadorPerfis.criaNovoPerfil(usuario._id, "Marcelo exibido");

  const perfilCompleto = await GerenciadorPerfis.recuperaPerfilCompletoPorLink(perfil.link);

  expect(perfilCompleto).not.toBeNull();
  expect(perfilCompleto.usuario).not.toBeNull();
  expect(perfilCompleto.perfil).not.toBeNull();
  
  expect(perfilCompleto.usuario._id.toString()).toBe(usuario._id.toString());
  expect(perfilCompleto.usuario.nome).toBe("Marcelo");
  expect(perfilCompleto.usuario.email).toBe("marcelo@gmail.com");
  expect(perfilCompleto.usuario.tipo).toBe("usuario");

  expect(perfilCompleto.perfil.nomeExibicao).toBe("Marcelo exibido");
  expect(perfilCompleto.perfil.minibio).toBe("Usuário do Educatools!");
  expect(perfilCompleto.perfil.profissao).toBe("educador");
  expect(perfilCompleto.perfil.instituicao).toBe("Indefinido");
  expect(perfilCompleto.perfil.mostraFavoritos).toBeTruthy();
  expect(perfilCompleto.perfil.mostraFerramentas).toBeTruthy();
  expect(perfilCompleto.link).not.toBeNull();
});

test('Recupera perfil por usuário', async () => {
  await GerenciadorPerfis.criaNovoPerfil("3908tr123s108", "Bob");
  const perfil = GerenciadorPerfis.recuperaPerfilPorUsuario("3908tr123s108");
  expect(perfil).not.toBeNull();
});